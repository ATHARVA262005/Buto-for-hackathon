import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaTrophy, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getNextSundayMidnight, formatTimeLeft } from '../utils/timeUtils';

const Home = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const currentEvent = {
    title: "Weekly Prompt Battle #1",
    theme: "Programming Challenge",
    participants: 234,
  };

  const CURRENT_THEME = "Programming Challenge"; // Updated theme

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching leaderboard data...');
      
      const response = await fetch('http://localhost:5001/api/prompts/leaderboard', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      console.log('Received leaderboard data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid leaderboard data format');
      }
      
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setPrompts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const endDate = getNextSundayMidnight();
      setTimeLeft(formatTimeLeft(endDate));
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch participant count (unique wallet addresses)
  useEffect(() => {
    const fetchParticipantCount = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/prompts/participant-count');
        const data = await response.json();
        setParticipantCount(data.count);
      } catch (error) {
        console.error('Error fetching participant count:', error);
      }
    };

    fetchParticipantCount();
  }, []);

  // Function to truncate wallet address
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleOpenPrompt = (promptId) => {
    window.open(`/prompt/${promptId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Current Event */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4">
                <FaClock className="text-yellow-400" />
                <span>Event Ends In: {timeLeft} (Sunday 11:59 PM IST)</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{currentEvent.title}</h1>
              <p className="text-xl text-gray-300 mb-6">Theme: {currentEvent.theme}</p>
              <div className="flex gap-4 mb-6">
                <div className="bg-black/30 px-4 py-2 rounded-lg">
                  <span className="block text-2xl font-bold">{participantCount}</span>
                  <span className="text-sm text-gray-400">Participants</span>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-lg">
                  <span className="block text-2xl font-bold">50</span>
                  <span className="text-sm text-gray-400">NFTs Available</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/submit-prompt')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Submit Your Prompt
              </button>
            </div>
            <div className="hidden lg:block">
              <img src="https://i.postimg.cc/cHSdvs1p/image.png" alt="Event" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex flex-col mb-6 space-y-6"> {/* Added space-y-6 */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                Current Leaderboard
              </h2>
              <span className="text-sm text-gray-400">
                Ranked by votes and freshness
              </span>
            </div>
            <div className="py-3 px-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
              <span className="text-purple-400 font-medium text-lg">Theme: {CURRENT_THEME}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-96 text-red-400">
              <p>{error}</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="flex justify-center items-center h-96 text-gray-400">
              <p>No prompts found in leaderboard</p>
            </div>
          ) : (
            <div className="h-[600px] overflow-y-auto pr-2 space-y-4 hide-scrollbar">
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt._id}
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-400">
                        by {truncateAddress(prompt.walletAddress)}
                      </h3>
                      <p className="font-medium">{prompt.problemStatement}</p>
                    </div>
                    <div className="w-px h-12 bg-gray-600"></div>
                    <div className="text-center w-24">
                      <div className="font-bold">{prompt.votes}</div>
                      <div className="text-sm text-gray-400">votes</div>
                    </div>
                    <div className="w-px h-12 bg-gray-600"></div>
                    <button 
                      onClick={() => handleOpenPrompt(prompt._id)}
                      className="w-12 flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors"
                      title="Open prompt details"
                    >
                      <FaExternalLinkAlt size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keep the scrollbar styling */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
