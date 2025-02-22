import React from 'react';
import { motion } from 'framer-motion';

const NFTCard = ({ 
  image, 
  title, 
  metadata, 
  category, 
  tier, 
  rank, 
  weekBonus, 
  getCategoryStyle, 
  getCategoryButtonStyle 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${getCategoryStyle(category)}`}
    >
      <div className="aspect-square bg-gray-700">
        <img
          src={image}
          alt={`${tier} NFT`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="mb-4 space-y-2">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className={key === 'subject' ? 'bg-gray-700 p-3 rounded-lg' : ''}>
              {key === 'subject' ? (
                <>
                  <p className="text-sm text-gray-400">{key}</p>
                  <p className="font-semibold">{value}</p>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">{subKey}</p>
                      <p className="font-semibold">{subValue}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryButtonStyle(category)}`}>
            {tier}
          </div>
          <div className="text-right">
            <p className="text-gray-400">Rank: #{rank}</p>
            {weekBonus && (
              <p className="text-sm text-purple-400">{weekBonus}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NFTCard;
