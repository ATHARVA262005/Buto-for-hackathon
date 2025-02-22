import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navigation/Navbar";
import Footer from '../components/Navigation/Footer';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft, FiShare2, FiBookmark, FiAward, FiThumbsUp, FiCopy, FiPlus } from 'react-icons/fi';
import { events } from '../data/event';
import { prompts, participants, userVotes } from '../data/prompts';

const PromptCard = ({ prompt, onUpvote, hasVoted }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50"
  >
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs text-blue-400 uppercase tracking-wider">{prompt.category}</span>
          <h3 className="text-lg font-semibold text-white">{prompt.prompt}</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpvote(prompt.id)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            hasVoted 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FiThumbsUp size={14} />
          <span>{prompt.upvotes}</span>
        </motion.button>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-4">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap">{prompt.example}</pre>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {new Date(prompt.timestamp).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiCopy size={14} />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiShare2 size={14} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const Leaderboard = ({ participants }) => (
  <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <FiAward className="text-yellow-500" /> Leaderboard
    </h2>
    <div className="space-y-4">
      {participants
        .sort((a, b) => b.totalUpvotes - a.totalUpvotes)
        .slice(0, 10)
        .map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50"
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-600' :
              'bg-gray-700'
            }`}>
              {index + 1}
            </div>
            <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <h3 className="font-semibold">{participant.name}</h3>
              <p className="text-sm text-gray-400">{participant.promptsSubmitted} prompts</p>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <FiThumbsUp size={14} />
              {participant.totalUpvotes}
            </div>
          </motion.div>
        ))}
    </div>
  </div>
);

const PromptBattle = () => {
  const navigate = useNavigate();
  const [userPromptVotes, setUserPromptVotes] = useState(userVotes);
  const [userState, setUserState] = useState({
    isRegistered: false,
    hasSubmittedPrompt: false,
    submissionComplete: false
  });
  
  const event = events.find(e => e.eventType === 'promptBattle');

  const handleRegister = () => {
    setUserState(prev => ({
      ...prev,
      isRegistered: true
    }));
  };

  const handlePromptSubmit = () => {
    setUserState(prev => ({
      ...prev,
      hasSubmittedPrompt: true,
      submissionComplete: true
    }));
  };

  const handleUpvote = (promptId) => {
    const userId = 1;
    const voteKey = `${userId}_${promptId}`;
    setUserPromptVotes(prev => ({
      ...prev,
      [voteKey]: !prev[voteKey]
    }));
  };

  const renderActionButton = () => {
    if (!userState.isRegistered) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold flex items-center gap-2"
        >
          Register Now
        </motion.button>
      );
    }

    if (!userState.hasSubmittedPrompt) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromptSubmit}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-xl font-semibold flex items-center gap-2 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300"
        >
          Submit Prompt
        </motion.button>
      );
    }

    if (userState.submissionComplete) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl font-semibold flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
        >
          View Performance
        </motion.button>
      );
    }
  };

  if (!event) return null;

  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section with Animated Elements */}
        <div className="relative min-h-[80vh] overflow-hidden flex items-center">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A]">
            <div className="absolute inset-0">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-20 bg-grid-pattern animate-grid" />
              
              {/* Floating orbs */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full blur-xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                  >
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Live Event
                    </span>
                  </motion.div>
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    Prompt Engineering
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Battle 2024
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400">
                    Showcase your prompt engineering skills and compete for amazing prizes
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex gap-4">
                  {renderActionButton()}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      $1,750
                    </div>
                    <div className="text-gray-400">Total Prize Pool</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                      450+
                    </div>
                    <div className="text-gray-400">Participants</div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Visual Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative z-10">
                  <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20240506115102/What-is-an-AI-Prompt.webp"
                    alt="Prompt Battle"
                    className="rounded-2xl shadow-2xl"
                  />
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Event Details Section - New */}
        <div className="bg-gray-900/50 border-y border-gray-800/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">About the Event</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">
                    The ButoAI Prompt Battle 2024 is the ultimate challenge for prompt engineers worldwide. 
                    Showcase your creativity and technical skills by crafting powerful AI prompts that push 
                    the boundaries of what's possible with language models.
                  </p>
                  <h3 className="text-xl font-semibold mt-6 mb-4">What to Expect</h3>
                  <ul className="list-disc pl-4 text-gray-300 space-y-2">
                    <li>Daily prompt challenges across different categories</li>
                    <li>Real-time voting and feedback from the community</li>
                    <li>Live leaderboard updates</li>
                    <li>Exclusive workshops with prompt engineering experts</li>
                    <li>Networking opportunities with fellow participants</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">How to Participate</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Register for the Event</h3>
                      <p className="text-gray-400">Create your account and join the competition</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Submit Your Prompts</h3>
                      <p className="text-gray-400">Create and submit unique, effective prompts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Engage and Vote</h3>
                      <p className="text-gray-400">Vote on other prompts and receive community feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Prompts */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Prompt Submissions</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold flex items-center gap-2"
                >
                  <FiPlus /> Submit Prompt
                </motion.button>
              </div>
              
              <div className="space-y-6">
                {prompts
                  .sort((a, b) => b.upvotes - a.upvotes)
                  .map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onUpvote={handleUpvote}
                      hasVoted={userPromptVotes[`1_${prompt.id}`]}
                    />
                  ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <Leaderboard participants={participants} />
              {/* Prize Pool Section */}
              <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-xl font-bold mb-4">Prize Pool</h2>
                <div className="space-y-4">
                  {event.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-600'
                        }`}>
                          #{prize.position}
                        </div>
                        <span>{prize.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules Section */}
              <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-xl font-bold mb-4">Rules</h2>
                <ul className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-400">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptBattle;
