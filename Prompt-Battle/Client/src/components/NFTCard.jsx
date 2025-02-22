import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowBigUp } from 'lucide-react';

const NFTCard = ({ 
  metadata, 
  rank,
  votes,
  prompt
}) => {
  const getNFTType = (rank) => {
    if (rank === 1) return { type: 'Legendary', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' };
    if (rank === 2) return { type: 'Epic', color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' };
    if (rank === 3) return { type: 'Rare', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' };
    return { type: 'Common', color: 'border-gray-500/50 bg-gray-500/10 text-gray-400' };
  };

  const nftStyle = getNFTType(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow border-2 ${nftStyle.color}`}
    >
      {/* Prompt Text */}
      <div className="bg-gray-700/50 p-3 h-24 overflow-hidden border-b border-gray-700">
        <p className="text-sm text-gray-300 font-medium line-clamp-4">
          {prompt || "No prompt available"}
        </p>
      </div>

      {/* Problem Statement Section */}
      <div className="p-3 border-b border-gray-700">
        <p className="text-gray-400 text-xs mb-1">Problem Statement</p>
        <p className="font-medium text-sm line-clamp-2">{metadata.problemStatement}</p>
      </div>

      {/* Stats Row */}
      <div className="border-t border-gray-700 p-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Trophy size={14} />
            <span>#{rank}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowBigUp size={14} className="fill-current" />
            <span>{votes}</span>
          </div>
        </div>
      </div>

      {/* Theme and Badge */}
      <div className="border-t border-gray-700 p-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-300">{metadata.subject}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${nftStyle.color}`}>
            {nftStyle.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NFTCard;
