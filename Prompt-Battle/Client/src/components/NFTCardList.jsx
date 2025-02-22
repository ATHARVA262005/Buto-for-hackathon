import React from 'react';
import { FaMedal } from 'react-icons/fa';
import NFTCard from './NFTCard';

const NFTCardList = ({ nfts, title = "Recent NFTs" }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <FaMedal className="text-purple-500" size={16} />
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {nfts.map((nft, index) => (
          <NFTCard
            key={index}
            {...nft}
          />
        ))}
      </div>
    </div>
  );
};

export default NFTCardList;
