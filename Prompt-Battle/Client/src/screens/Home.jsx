import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEthereum, FaClock, FaTrophy, FaCrown, FaFire, FaMedal, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [activeTab, setActiveTab] = useState('current');

  const currentEvent = {
    title: "Weekly Prompt Battle #42",
    theme: "AI Assistant Improvement",
    endsIn: "2d 14h 35m",
    participants: 234,
    prize: "Top 50 NFT Minting + 10 ETH Pool"
  };

  const topPrompts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    prompt: [
      "Create an AI assistant that revolutionizes healthcare diagnostics",
      "Design a prompt for generating photorealistic landscapes",
      "Develop an AI teaching assistant for coding",
      "Build a creative writing enhancement system",
      "Create a mental health support conversation model",
      "Design a business strategy optimization assistant",
      "Develop a language learning acceleration system",
      "Create a scientific research analysis assistant",
      "Build a music composition enhancement tool",
      "Design a sustainable architecture planning system"
    ][i % 10],
    creator: [
      "Alex Chen",
      "Sarah Smith",
      "Mike Johnson",
      "Emma Wilson",
      "David Lee",
      "Julia Martinez",
      "Ryan Taylor",
      "Sophie Brown",
      "James Anderson",
      "Laura Garcia"
    ][i % 10],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`,
    rank: i + 1,
    votes: Math.floor(2000 - (i * 35) + Math.random() * 50),
    mintedNFT: `https://picsum.photos/400/300?random=${i}`,
    badge: i < 3 ? "Elite Creator" : 
           i < 10 ? "Master Prompter" : 
           i < 20 ? "Rising Star" : 
           "Challenger"
  }));

  const previousWinners = Array.from({ length: 10 }, (_, i) => ({
    week: 41 - i,
    winner: [
      "Sarah Smith",
      "Alex Chen",
      "Mike Johnson",
      "Emma Wilson",
      "David Lee",
      "Julia Martinez",
      "Ryan Taylor",
      "Sophie Brown",
      "James Anderson",
      "Laura Garcia"
    ][i],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Winner${i}`,
    nftValue: (5 - i * 0.2).toFixed(1),
    promptPreview: [
      "AI Healthcare Revolution",
      "Creative Writing Assistant",
      "Code Generation Expert",
      "Image Generation Master",
      "Business Strategy AI",
      "Language Learning Pro",
      "Scientific Research AI",
      "Music Composition Aid",
      "Architecture Design Pro",
      "Education Assistant"
    ][i],
    nftImage: `https://picsum.photos/400/300?random=${i + 10}`,
    rank: i + 1
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Current Event */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4">
                <FaClock className="text-yellow-400" />
                <span>Event Ends In: {currentEvent.endsIn}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{currentEvent.title}</h1>
              <p className="text-xl text-gray-300 mb-6">Theme: {currentEvent.theme}</p>
              <div className="flex gap-4 mb-6">
                <div className="bg-black/30 px-4 py-2 rounded-lg">
                  <span className="block text-2xl font-bold">{currentEvent.participants}</span>
                  <span className="text-sm text-gray-400">Participants</span>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-lg">
                  <span className="block text-2xl font-bold">50</span>
                  <span className="text-sm text-gray-400">NFTs Available</span>
                </div>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all">
                Submit Your Prompt
              </button>
            </div>
            <div className="hidden lg:block">
              <img src="https://picsum.photos/600/400?random=1" alt="Event" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaTrophy className="text-yellow-400" />
                  Current Leaderboard
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    Showing top 50 participants
                  </span>
                </div>
              </div>

              {/* Updated scrollable container */}
              <div className="h-[500px] overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                {topPrompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 1) }}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-yellow-600' :
                        'text-gray-400'
                      }`}>
                        #{prompt.rank}
                      </div>
                      <img src={prompt.avatar} alt={prompt.creator} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{prompt.creator}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{prompt.prompt}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{prompt.votes.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">votes</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Previous Winners NFT Showcase */}
          <div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaCrown className="text-yellow-400" />
                Winner NFTs
              </h2>
              {/* Updated scrollable container */}
              <div className="h-[500px] overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                {previousWinners.map((winner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-gray-700/30 rounded-lg overflow-hidden"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative shrink-0">
                        <img
                          src={winner.nftImage}
                          alt={`Week ${winner.week} Winner`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="absolute -top-1 -left-1 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-bold">
                          #{winner.rank}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <img src={winner.avatar} alt={winner.winner} className="w-6 h-6 rounded-full" />
                          <h3 className="font-semibold truncate">{winner.winner}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Week #{winner.week}</p>
                        <p className="text-sm text-gray-300 truncate">{winner.promptPreview}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="flex items-center gap-1 text-sm">
                            <FaEthereum className="text-blue-400" />
                            <span className="font-medium">{winner.nftValue} ETH</span>
                          </span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            View NFT <FaArrowRight className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styling */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default Home;
