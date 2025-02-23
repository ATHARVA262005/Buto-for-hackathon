import React from 'react';
import { X, ArrowBigUp, Award, Clock, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const PromptDetailModal = ({ prompt, onClose, onVote }) => {
  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 {...props} />,
    h2: ({ node, ...props }) => <h2 {...props} />,
    // ... rest of markdown components
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Check out this prompt battle!',
        text: `${prompt.problemStatement}\nTheme: ${prompt.subject}`,
        url: `${window.location.origin}/prompt/${prompt._id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleVote = async () => {
    // Call the onVote handler from parent with optimistic update
    onVote(prompt._id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-radial from-transparent via-gray-900/95 to-gray-900/98" />
      
      <div className="relative bg-gray-800 w-full max-w-6xl mx-4 h-[90vh] rounded-xl shadow-2xl border border-gray-700/50 flex flex-col">
        {/* Header Section */}
        <div className="shrink-0 p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-purple-400" size={24} />
                <span className="text-purple-400 font-semibold text-lg">{prompt.subject}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{prompt.problemStatement}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={16} />
              <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}</span>
            </div>
            <button
              onClick={handleVote}
              className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors group"
            >
              <ArrowBigUp 
                size={24} 
                className={`transform transition-transform group-hover:scale-110 ${
                  prompt.hasVoted ? 'text-purple-400 fill-current' : ''
                }`}
              />
              <span>{prompt.votes} votes</span>
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

        {/* Content Container */}
        <div className="flex-1 min-h-0 p-6">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Prompt Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden flex flex-col min-h-0">
              <div className="shrink-0 p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold">Prompt</h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="text-gray-300 whitespace-pre-wrap">
                  {prompt?.prompt}
                </div>
              </div>
            </div>

            {/* Generated Result Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden flex flex-col min-h-0">
              <div className="shrink-0 p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold">Generated Result</h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
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
  );
};

export default PromptDetailModal;
