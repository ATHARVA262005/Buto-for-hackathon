import React from 'react';
import { Share2, Trophy, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitSuccessModal = ({ onClose, promptData }) => {
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Check out my prompt battle submission!',
        text: `${promptData.problemStatement}\nTheme: ${promptData.subject}`,
        url: `${window.location.origin}/prompt/${promptData._id}`
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Vignette overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-radial from-transparent via-gray-900/95 to-gray-900/98" />
      
      <div className="bg-gray-800/95 backdrop-blur-md rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-700/50 relative z-10">
        <div className="text-center">
          <div className="bg-purple-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Prompt Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Share your prompt to increase your chances of winning NFTs and climbing the leaderboard!
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={handleShare}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={20} />
              Share Prompt
            </button>
            
            <button 
              onClick={() => navigate('/explore')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 flex items-center justify-center gap-2"
            >
              <ListChecks size={20} />
              Explore Other Prompts
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-gray-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccessModal;
