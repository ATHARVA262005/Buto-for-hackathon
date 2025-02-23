import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowBigUp, Share2, Award, Clock, Medal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const PromptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'VOTE_UPDATE' && data.promptId === id) {
        setPrompt(prev => ({ ...prev, votes: data.votes }));
      }
    };

    return () => ws.close();
  }, [id]);

  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        if (!window.petra) {
          alert('Please install Petra wallet');
          return;
        }
        
        const wallet = window.petra;
        await wallet.connect();
        const account = await wallet.account();
        // Only store the address string
        if (account && typeof account === 'object' && account.address) {
          setWalletAddress(account.address);
          console.log('Connected wallet address:', account.address);
        }
      } catch (error) {
        console.error('Error connecting to Petra wallet:', error);
      }
    };
    getWalletAddress();
  }, []);

  useEffect(() => {
    fetchPromptAndVoteStatus();
  }, [id, walletAddress]);

  const fetchPromptAndVoteStatus = async () => {
    if (!walletAddress) return;

    try {
      const [promptRes, voteStatusRes] = await Promise.all([
        fetch(`http://localhost:5001/api/prompts/${id}`),
        fetch(`http://localhost:5001/api/prompts/${id}/vote-status?walletAddress=${walletAddress}`)
      ]);

      if (!promptRes.ok) throw new Error('Prompt not found');

      const promptData = await promptRes.json();
      const voteStatus = await voteStatusRes.json();

      setPrompt({
        ...promptData,
        votes: voteStatus.votes,
        hasVoted: voteStatus.hasVoted
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Optimistically update UI
      setPrompt(prev => ({
        ...prev,
        votes: prev.hasVoted ? prev.votes - 1 : prev.votes + 1,
        hasVoted: !prev.hasVoted
      }));

      const response = await fetch(`http://localhost:5001/api/prompts/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }) 
      });

      if (!response.ok) {
        const error = await response.json();
        // Revert optimistic update if request fails
        setPrompt(prev => ({
          ...prev,
          votes: prev.hasVoted ? prev.votes - 1 : prev.votes + 1,
          hasVoted: !prev.hasVoted
        }));
        throw new Error(error.error);
      }

      const data = await response.json();
      // Update with actual server data
      setPrompt(prev => ({
        ...prev,
        votes: data.votes,
        hasVoted: data.hasVoted
      }));
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this prompt battle!',
      text: `${prompt.problemStatement}\nTheme: ${prompt.subject}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
        <Medal className="text-purple-500" size={48} />
        <h1 className="text-2xl font-bold">Prompt Not Found</h1>
        <p className="text-gray-400">This prompt may have been removed or doesn't exist.</p>
        <button
          onClick={() => navigate('/explore')}
          className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
        >
          Explore Other Prompts
        </button>
      </div>
    );
  }

  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 {...props} />,
    h2: ({ node, ...props }) => <h2 {...props} />,
    p: ({ node, ...props }) => <p {...props} />,
    code: ({ node, inline, ...props }) => (
      <code {...props} />
    ),
    ul: ({ node, ...props }) => <ul {...props} />,
    ol: ({ node, ...props }) => <ol {...props} />,
    li: ({ node, ...props }) => <li {...props} />,
    strong: ({ node, ...props }) => <strong {...props} />,
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <button
          onClick={() => navigate('/explore')}
          className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Explore
        </button>

        {/* Main Content Container */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          {/* Fixed Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-purple-400" size={24} />
              <span className="text-purple-400 font-semibold text-lg">{prompt.subject}</span>
            </div>
            <h1 className="text-2xl font-bold mb-6">{prompt.problemStatement}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}</span>
              </div>
              <button
                onClick={handleVote}
                className={`flex items-center gap-1.5 transition-colors group ${
                  prompt.hasVoted ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                }`}
                title={prompt.hasVoted ? 'Click to remove vote' : 'Click to vote'}
              >
                <ArrowBigUp 
                  size={24} 
                  className={`transform transition-transform group-hover:scale-110 ${
                    prompt.hasVoted ? 'fill-current' : ''
                  }`}
                />
                <span>{prompt.votes || 0} votes</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Prompt Section */}
            <div className="bg-gray-900 rounded-lg flex flex-col">
              <h2 className="p-4 font-bold text-xl border-b border-gray-800">Prompt</h2>
              <div className="h-[500px] overflow-y-auto custom-scrollbar">
                <div className="p-4">
                  <div className="text-gray-300 whitespace-pre-wrap">{prompt?.prompt}</div>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-gray-900 rounded-lg flex flex-col">
              <h2 className="p-4 font-bold text-xl border-b border-gray-800">Generated Result</h2>
              <div className="h-[500px] overflow-y-auto custom-scrollbar">
                <div className="p-4">
                  <div className="prose prose-invert prose-h1:text-blue-400 prose-h1:text-2xl prose-h1:font-bold prose-h1:my-4 
                    prose-h2:text-blue-400 prose-h2:text-xl prose-h2:font-bold prose-h2:my-3 
                    prose-p:text-gray-300 prose-p:my-2
                    prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-4
                    prose-ul:list-disc prose-ul:list-inside prose-ul:my-4
                    prose-ol:list-decimal prose-ol:list-inside prose-ol:my-4
                    prose-li:ml-4 prose-li:my-2
                    prose-strong:font-bold prose-strong:text-white
                    max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {prompt?.generatedOutput}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPage;
