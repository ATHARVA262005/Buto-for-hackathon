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
        const { prompt, generatedOutput, subject, problemStatement } = req.body;
        const newPrompt = new Prompt({
            prompt,
            generatedOutput,
            subject,
            problemStatement
        });
        await newPrompt.save();
        res.json({ message: 'Prompt submitted successfully', prompt: newPrompt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/vote', async (req, res) => {
  try {
    const { userId } = req.body;
    const promptId = req.params.id;

    const prompt = await Prompt.findById(promptId);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Check if user already voted
    if (prompt.votedBy.includes(userId)) {
      return res.status(400).json({ error: 'Already voted', votes: prompt.votes });
    }

    // Update votes
    prompt.votes += 1;
    prompt.votedBy.push(userId);
    await prompt.save();

    // Broadcast to WebSocket clients
    const wss = req.app.locals.wss;
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'VOTE_UPDATE',
            promptId,
            votes: prompt.votes
          }));
        }
      });
    }

    res.json({ success: true, votes: prompt.votes });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/vote-status', async (req, res) => {
  try {
    const { userId } = req.query;
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      hasVoted: prompt.votedBy.includes(userId),
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
