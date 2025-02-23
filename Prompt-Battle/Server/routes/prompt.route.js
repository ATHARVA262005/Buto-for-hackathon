const express = require('express');
const router = express.Router();
const WebSocket = require('ws'); // Add this import
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Prompt = require('../models/prompt.model');

// Initialize Gemini with error handling
let genAI;
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
    console.error('Error initializing Gemini:', error);
}

router.post('/generate', async (req, res) => {
    try {
        if (!genAI) {
            throw new Error('Gemini AI is not properly initialized');
        }

        const { prompt, subject, problemStatement } = req.body;
        
        // Create the system prompt
        const systemPrompt = `You are an AI assistant specialized in ${subject}. 
        Context: You are evaluating a submission for a prompt battle competition.

        Problem Statement: ${problemStatement}
        
        Your task is to generate a response following these parameters:
        1. Theme: ${subject}
        2. Format your response using markdown:
           ## Problem Analysis
           [Brief analysis of the problem statement]

           ## Approach
           [How the prompt addresses the problem]

           ## Solution
           \`\`\`
           [Detailed solution based on the prompt]
           \`\`\`

           ## Evaluation
           **Strengths:**
           - [Point 1]
           - [Point 2]

           **Areas for Improvement:**
           - [Point 1]
           - [Point 2]
           
        Ensure all responses are strictly related to ${subject} and the problem statement.
        If either the prompt or problem statement is not relevant to ${subject}, 
        respond with "Please provide a relevant prompt and problem statement for ${subject}."

        User's Prompt: ${prompt}`;

        // Generate content using the correct API method
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ output: text });
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/submit', async (req, res) => {
    try {
        const { prompt, generatedOutput, subject, problemStatement, walletAddress } = req.body;
        
        console.log('Received submission request:', {
            prompt: prompt.substring(0, 50) + '...',
            subject,
            problemStatement: problemStatement.substring(0, 50) + '...',
            walletAddress
        });

        if (!walletAddress) {
            console.log('Missing wallet address in submission');
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        const newPrompt = new Prompt({
            prompt,
            generatedOutput,
            subject,
            problemStatement,
            walletAddress,
            votes: 0,
            votedBy: [],
            votedByWallets: [] // Add this field
        });
        
        console.log('Saving prompt with wallet:', walletAddress);
        await newPrompt.save();
        console.log('Prompt saved successfully');
        
        res.json({ message: 'Prompt submitted successfully', prompt: newPrompt });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/vote', async (req, res) => {
  try {
    let { walletAddress } = req.body;
    const promptId = req.params.id;

    // Ensure walletAddress is a string and properly formatted
    if (typeof walletAddress === 'object' && walletAddress.address) {
      walletAddress = walletAddress.address;
    }

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ error: 'Valid wallet address is required' });
    }

    const prompt = await Prompt.findById(promptId);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const hasVoted = prompt.votedByWallets.includes(walletAddress);

    if (hasVoted) {
      // Remove vote
      prompt.votes = Math.max(0, prompt.votes - 1);
      prompt.votedByWallets = prompt.votedByWallets.filter(w => w !== walletAddress);
    } else {
      // Add vote
      prompt.votes += 1;
      prompt.votedByWallets.push(walletAddress);
    }

    // Use findByIdAndUpdate instead of save() to avoid validation issues
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      promptId,
      { 
        votes: prompt.votes,
        votedByWallets: prompt.votedByWallets
      },
      { new: true }
    );

    // Broadcast to WebSocket clients
    const wss = req.app.locals.wss;
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'VOTE_UPDATE',
            promptId,
            votes: updatedPrompt.votes,
            votedByWallets: updatedPrompt.votedByWallets
          }));
        }
      });
    }

    res.json({ 
      success: true, 
      votes: updatedPrompt.votes,
      hasVoted: !hasVoted 
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Move leaderboard route BEFORE any parameterized routes
router.get('/leaderboard', async (req, res) => {
  try {
    console.log('Fetching leaderboard...');
    // Get all prompts with at least 1 vote
    const prompts = await Prompt.find({ votes: { $gte: 1 } });
    
    console.log(`Found ${prompts.length} prompts with votes`);
    
    if (!prompts || prompts.length === 0) {
      console.log('No prompts found, returning empty array');
      return res.json([]);
    }
    
    // Calculate score based on votes and time
    const rankedPrompts = prompts.map(prompt => {
      const ageInHours = (Date.now() - new Date(prompt.createdAt)) / (1000 * 60 * 60);
      const score = (prompt.votes) / Math.pow(ageInHours + 2, 1.5);
      
      return {
        _id: prompt._id,
        prompt: prompt.prompt,
        subject: prompt.subject,
        problemStatement: prompt.problemStatement,
        votes: prompt.votes,
        createdAt: prompt.createdAt,
        walletAddress: prompt.walletAddress,
        score
      };
    });

    // Sort by score
    rankedPrompts.sort((a, b) => b.score - a.score);

    // Add ranks
    const rankedResults = rankedPrompts.map((prompt, index) => ({
      ...prompt,
      rank: index + 1
    }));

    console.log(`Returning ${rankedResults.length} ranked prompts`);
    res.json(rankedResults);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new endpoint for participant count
router.get('/participant-count', async (req, res) => {
  try {
    // Count unique wallet addresses
    const uniqueWallets = await Prompt.distinct('walletAddress');
    res.json({ count: uniqueWallets.length });
  } catch (error) {
    console.error('Error getting participant count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new route to get prompt count by wallet address
router.get('/count/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    console.log('Getting prompt count for wallet:', walletAddress);

    // Ensure case-insensitive comparison and trim any whitespace
    const count = await Prompt.countDocuments({
      walletAddress: { 
        $regex: new RegExp(`^${walletAddress}$`, 'i')
      }
    });

    console.log('Found prompts:', count);
    res.json({ count });
  } catch (error) {
    console.error('Error getting prompt count:', error);
    res.status(500).json({ error: 'Failed to get prompt count', details: error.message });
  }
});

// Add new route to get user stats by wallet address
router.get('/user-stats/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    console.log('Getting user stats for wallet:', walletAddress);

    // Get all prompts with votes
    const prompts = await Prompt.find({ votes: { $gte: 1 } });
    
    // Calculate scores and sort
    const rankedPrompts = prompts.map(prompt => ({
      walletAddress: prompt.walletAddress,
      score: (prompt.votes) / Math.pow((Date.now() - new Date(prompt.createdAt)) / (1000 * 60 * 60) + 2, 1.5)
    }));

    rankedPrompts.sort((a, b) => b.score - a.score);

    // Find user's best rank
    const userRank = rankedPrompts.findIndex(p => 
      p.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    ) + 1;

    // Get user's prompts and total votes
    const userPrompts = await Prompt.find({
      walletAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') }
    });

    const totalVotes = userPrompts.reduce((sum, prompt) => sum + prompt.votes, 0);
    const promptCount = userPrompts.length;

    console.log('Stats found:', { promptCount, totalVotes, userRank });
    res.json({ 
      totalPrompts: promptCount,
      totalVotes: totalVotes,
      ranking: userRank || 0
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Failed to get user stats', details: error.message });
  }
});

// Then add all other routes
router.get('/:id/vote-status', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      hasVoted: prompt.votedByWallets.includes(walletAddress),
      votes: prompt.votes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
