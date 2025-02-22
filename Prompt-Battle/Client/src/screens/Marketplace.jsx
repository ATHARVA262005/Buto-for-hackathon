import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import { SiPolygon } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('buy'); // Add new state for tabs
  const [userNFTs] = useState([
    {
      id: 101,
      title: "My Prompt Master",
      creator: "You",
      price: 0, // Initial price before listing
      category: "rare",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=101",
      description: "Your earned NFT from winning battles"
    },
    // Add more user NFTs as needed
  ]);

  const nfts = [
    {
      id: 1,
      title: "Creative Prompt Master",
      creator: "Alex Chen",
      price: 50, // Updated prices to realistic MATIC values
      category: "rare",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=1",
      description: "Earned for winning the weekly prompt battle"
    },
    {
      id: 2,
      title: "AI Innovation Badge",
      creator: "Sarah Smith",
      price: 30,
      category: "common",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=2",
      description: "Awarded for innovative AI prompt creation"
    },
    {
      id: 3,
      title: "Legendary Prompter",
      creator: "Mike Johnson",
      price: 120,
      category: "legendary",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=3",
      description: "Exclusive NFT for top prompters"
    },
    {
      id: 4,
      title: "Epic Prompt Oracle",
      creator: "John Doe",
      price: 80,
      category: "epic",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=4",
      description: "Ultra-rare epic NFT for master prompt creators"
    }
  ];

  const categories = [
    { id: 'all', name: 'All NFTs' },
    { id: 'legendary', name: 'Legendary' },
    { id: 'epic', name: 'Epic' },
    { id: 'rare', name: 'Rare' },
    { id: 'common', name: 'Common' },
  ];

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'legendary':
        return 'border-4 border-yellow-500';
      case 'epic':
        return 'border-4 border-purple-500';
      case 'rare':
        return 'border-4 border-blue-500';
      case 'common':
        return 'border-4 border-gray-500';
      default:
        return 'border border-gray-700';
    }
  };

  const getCategoryButtonStyle = (category) => {
    switch (category) {
      case 'legendary':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'epic':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'rare':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'common':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-purple-600 hover:bg-purple-700';
    }
  };

  const getCategoryFilterStyle = (categoryId) => {
    if (selectedCategory === categoryId) {
      switch (categoryId) {
        case 'legendary':
          return 'bg-yellow-600 text-white hover:bg-yellow-700';
        case 'epic':
          return 'bg-purple-600 text-white hover:bg-purple-700';
        case 'rare':
          return 'bg-blue-600 text-white hover:bg-blue-700';
        case 'common':
          return 'bg-gray-600 text-white hover:bg-gray-700';
        default:
          return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
      }
    }
    // Inactive state with border
    switch (categoryId) {
      case 'legendary':
        return 'border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20';
      case 'epic':
        return 'border-2 border-purple-500/50 text-purple-500 hover:bg-purple-500/20';
      case 'rare':
        return 'border-2 border-blue-500/50 text-blue-500 hover:bg-blue-500/20';
      case 'common':
        return 'border-2 border-gray-500/50 text-gray-400 hover:bg-gray-500/20';
      default:
        return 'border-2 border-gray-500/50 text-gray-400 hover:bg-gray-700';
    }
  };

  const handleCheckout = (nft) => {
    navigate('/checkout', { state: { nft } });
  };

  const handleListNFT = (nft, price) => {
    // Here you would implement the blockchain interaction to list the NFT
    console.log(`Listing NFT ${nft.id} for ${price} MATIC`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">NFT Marketplace</h1>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'buy'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'sell'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sell
            </button>
          </div>
        </div>
        <p className="text-gray-400">
          {activeTab === 'buy' 
            ? 'Discover and collect unique AI prompt NFTs' 
            : 'List your NFTs for sale on the marketplace'}
        </p>
      </div>

      {activeTab === 'buy' ? (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${getCategoryFilterStyle(category.id)}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${getCategoryStyle(nft.category)}`}
              >
                <div className="aspect-square bg-gray-700">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{nft.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">By {nft.creator}</p>
                  <p className="text-sm text-gray-400 mb-4">{nft.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <SiPolygon className="text-purple-500" /> {/* Changed to MATIC icon */}
                      <span className="font-bold">{nft.price} MATIC</span>
                    </div>
                    <button 
                      onClick={() => handleCheckout(nft)}
                      className={`px-4 py-2 rounded-lg transition-colors ${getCategoryButtonStyle(nft.category)}`}
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        // Sell Section
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userNFTs.map((nft) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${getCategoryStyle(nft.category)}`}
            >
              <div className="aspect-square bg-gray-700">
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.title}</h3>
                <p className="text-sm text-gray-400 mb-2">By {nft.creator}</p>
                <p className="text-sm text-gray-400 mb-4">{nft.description}</p>
                
                {/* Price Input and List Button */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Set price in MATIC"
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                        step="0.1"
                      />
                      <SiPolygon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    </div>
                  </div>
                  <button
                    onClick={() => handleListNFT(nft, 0)}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <FaPlus size={14} />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
