import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaFireAlt, FaChartLine, FaMedal, FaCrown, FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [currentParticipationIndex, setCurrentParticipationIndex] = useState(0);
  const [showAllParticipations, setShowAllParticipations] = useState(false);
  
  const [prompts, setPrompts] = useState([]);
  const [leaderboard] = useState([
    {
      name: "Alex Chen",
      score: 2847,
      prompts: 32,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      badge: "Champion Creator"
    },
    {
      name: "Sarah Smith",
      score: 2456,
      prompts: 28,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      badge: "Elite Prompter"
    },
    {
      name: "Mike Johnson",
      score: 2123,
      prompts: 25,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      badge: "Rising Star"
    }
  ]);
  const [userStats, setUserStats] = useState({
    totalPrompts: 42,
    totalVotes: 156,
    nftsMinted: 8,
    ranking: 15
  });
  const [recentParticipations] = useState([
    {
      eventName: "AI Prompt Challenge #24",
      date: "2024-02-15",
      position: "3rd",
      reward: "Bronze NFT",
      votes: 156
    },
    {
      eventName: "Weekly Prompt Battle",
      date: "2024-02-10",
      position: "5th",
      reward: "Participation NFT",
      votes: 142
    },
    {
      eventName: "Creative Prompt Contest",
      date: "2024-02-05",
      position: "1st",
      reward: "Gold NFT",
      votes: 289
    }
  ]);

  const nfts = [
    { id: 1, title: "NFT #1" },
    { id: 2, title: "NFT #2" },
    { id: 3, title: "NFT #3" },
    { id: 4, title: "NFT #4" },
    { id: 5, title: "NFT #5" },
    { id: 6, title: "NFT #6" }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const nftsPerPage = 3;
  const totalPages = Math.ceil(nfts.length / nftsPerPage);

  const getCurrentNFTs = () => {
    const start = currentPage * nftsPerPage;
    return nfts.slice(start, start + nftsPerPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextNFT = () => {
    setCurrentNFTIndex((prev) => (prev + 1) % nfts.length);
  };

  const handlePrevNFT = () => {
    setCurrentNFTIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
  };

  const renderParticipationCard = (participation) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">
            {participation.eventName}
          </h3>
          <p className="text-sm text-gray-400">
            {participation.date}
          </p>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-sm mb-1
            ${participation.position === '1st' ? 'bg-yellow-900/30 text-yellow-300' :
              participation.position === '2nd' ? 'bg-gray-400/30 text-gray-300' :
              participation.position === '3rd' ? 'bg-yellow-700/30 text-yellow-600' :
              'bg-blue-900/30 text-blue-400'}`}
          >
            {participation.position}
          </div>
          <div className="text-xs text-gray-400">
            {participation.votes} votes
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
          {participation.reward}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Back Button and Header */}
        <div className="shrink-0 px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Stats Cards - Fixed Height */}
        <div className="shrink-0 px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-full">
                  <FaChartLine className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Your Prompts</p>
                  <h3 className="text-xl font-bold text-white">{userStats.totalPrompts}</h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-full">
                  <FaTrophy className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Votes</p>
                  <h3 className="text-xl font-bold text-white">{userStats.totalVotes}</h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-full">
                  <FaMedal className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">NFTs Minted</p>
                  <h3 className="text-xl font-bold text-white">{userStats.nftsMinted}</h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-full">
                  <FaFireAlt className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Your Ranking</p>
                  <h3 className="text-xl font-bold text-white">#{userStats.ranking}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flex grow with no scroll */}
        <div className="flex-1 min-h-screen px-6 pb-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6 h-full">
              {/* NFT Showcase - Increased Height */}
              <div className="h-[400px] bg-gray-800 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-xl font-bold text-white">Your NFT Collection</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                  </div>
                </div>
                <div className="relative flex h-[300px]">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`w-12 h-full flex items-center justify-center transition-colors
                      ${currentPage === 0 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                  >
                    <FaChevronLeft className="h-8 w-8" />
                  </button>

                  <div className="flex-1 grid grid-cols-3 gap-4 px-4">
                    {getCurrentNFTs().map((nft) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="aspect-square rounded-lg bg-gray-700 p-2"
                      >
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">{nft.title}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`w-12 h-full flex items-center justify-center transition-colors
                      ${currentPage === totalPages - 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                  >
                    <FaChevronRight className="h-8 w-8" />
                  </button>
                </div>
              </div>

              {/* Recent Participations - Remaining Height */}
              <div className="flex-4 bg-gray-800 rounded-lg shadow-lg p-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Participations</h2>
                  <button
                    onClick={() => setShowAllParticipations(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View All
                  </button>
                </div>
                {/* Show only most recent participation */}
                {recentParticipations.length > 0 && renderParticipationCard(recentParticipations[0])}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 h-full">
              {/* Top Creators - Flex grow */}
              <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Top Creators</h2>
                  <FaCrown className="text-yellow-500 h-5 w-5" />
                </div>
                <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent h-[calc(100%-3rem)]">
                  <div className="space-y-3 pr-2">
                    {leaderboard.map((creator, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative ${
                          index === 0
                            ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30'
                            : 'bg-gray-700'
                        } rounded-lg p-4 transform transition-all duration-300 hover:scale-102 hover:shadow-xl`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-12 h-12 rounded-full bg-gray-600"
                            />
                            <div className={`absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full
                              ${index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-300' : 
                                'bg-yellow-700'}`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-white">{creator.name}</h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`px-2 py-0.5 rounded-full text-xs
                                ${index === 0 ? 'bg-purple-900/50 text-purple-300' :
                                  index === 1 ? 'bg-blue-900/50 text-blue-300' :
                                  'bg-yellow-900/50 text-yellow-300'}`}>
                                {creator.badge}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                              {creator.score}
                            </div>
                            <div className="text-xs text-gray-400">
                              {creator.prompts} prompts
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Events - Fixed Height */}
              <div className="h-[200px] bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Upcoming Events</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-white">Weekly Prompt Battle</h3>
                    <p className="text-sm text-gray-400">Starts in 2 days</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-white">AI Art Challenge</h3>
                    <p className="text-sm text-gray-400">Starts in 5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Participations Modal with Vignette */}
      {showAllParticipations && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/10 z-50" />
          <div className="fixed inset-0 z-50 vignette-overlay" />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden border border-gray-700/50 shadow-xl">
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">All Participations</h2>
                <button
                  onClick={() => setShowAllParticipations(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="space-y-4">
                  {recentParticipations.map((participation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {renderParticipationCard(participation)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(75, 85, 99);
          border-radius: 3px;
        }
        .vignette-overlay {
          background: radial-gradient(
            circle at center,
            transparent 30%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
