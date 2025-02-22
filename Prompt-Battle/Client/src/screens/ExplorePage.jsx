import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowBigUp, Eye, Clock, Award, Share2, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PromptDetailModal from '../components/PromptDetailModal';
import { formatDistanceToNow } from 'date-fns';
import { useWebSocket } from '../hooks/useWebSocket';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [userId] = useState(localStorage.getItem('userId') || 'user-' + Math.random());

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'VOTE_UPDATE') {
        setPrompts(currentPrompts => 
          currentPrompts.map(p => 
            p._id === data.promptId ? { ...p, votes: data.votes } : p
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    checkVoteStatuses();
  }, [prompts]);

  const checkVoteStatuses = async () => {
    try {
      const votedStatuses = await Promise.all(
        prompts.map(prompt =>
          fetch(`http://localhost:5001/api/prompts/${prompt._id}/vote-status?userId=${userId}`)
            .then(res => res.json())
        )
      );

      setPrompts(prompts.map((prompt, index) => ({
        ...prompt,
        hasVoted: votedStatuses[index].hasVoted,
        votes: votedStatuses[index].votes
      })));
    } catch (error) {
      console.error('Error checking vote statuses:', error);
    }
  };

  const handleVote = async (promptId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/prompts/${promptId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'Already voted') {
          return;
        }
        throw new Error(data.error);
      }

      setPrompts(currentPrompts =>
        currentPrompts.map(p =>
          p._id === promptId ? { ...p, votes: data.votes, hasVoted: true } : p
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleShare = async (prompt) => {
    try {
      const shareData = {
        title: 'Check out this prompt battle!',
        text: `${prompt.problemStatement}\nTheme: ${prompt.subject}`,
        url: `${window.location.origin}/prompt/${prompt._id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying link
        await navigator.clipboard.writeText(shareData.url);
        // You might want to add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={24} />
            Back
          </button>
          <h1 className="text-3xl font-bold">Explore Prompts</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <PenSquare className="text-purple-400" size={48} />
            <h2 className="text-2xl font-bold text-gray-300">No Prompts Yet</h2>
            <p className="text-gray-400 text-center max-w-md">
              Be the first to submit a prompt and start the battle!
            </p>
            <button
              onClick={() => navigate('/submit-prompt')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PenSquare size={20} />
              Submit a Prompt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prompts.map((prompt) => (
              <div
                key={prompt._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-lg"
              >
                {/* Theme and Title */}
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-purple-400" size={20} />
                  <span className="text-purple-400 font-semibold">{prompt.subject}</span>
                </div>

                {/* Problem Statement */}
                <div className="mb-6">
                  <h3 className="text-gray-400 text-sm mb-2">Problem Statement:</h3>
                  <h2 className="text-xl font-bold text-gray-100">{prompt.problemStatement}</h2>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
                  {/* Left side: Date, Votes, and Share */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleVote(prompt._id)}
                      disabled={prompt.hasVoted}
                      className={`flex items-center gap-1.5 transition-colors group ${
                        prompt.hasVoted ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                      }`}
                    >
                      <ArrowBigUp 
                        size={24} 
                        className={`transform transition-transform group-hover:scale-110 ${
                          prompt.hasVoted ? 'fill-current' : ''
                        }`}
                      />
                      <span className="text-sm font-medium">{prompt.votes}</span>
                    </button>
                    <button
                      onClick={() => handleShare(prompt)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  {/* Right side: View Button */}
                  <button
                    onClick={() => setSelectedPrompt(prompt)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                    View Full Prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPrompt && (
        <PromptDetailModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          onVote={handleVote}
        />
      )}
    </div>
  );
};

export default ExplorePage;
