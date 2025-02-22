import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaArrowRight, FaSearch, FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { SiPolygon } from 'react-icons/si';

const Trade = () => {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTradeSuccess, setShowTradeSuccess] = useState(false);
  const [tradedNFT, setTradedNFT] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedTargetNFT, setSelectedTargetNFT] = useState(null);
  const [tradeRequests, setTradeRequests] = useState([
    {
      id: 1,
      from: 'Alex',
      fromNFT: {
        id: 201,
        title: "Alex's Epic Badge",
        category: "epic",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=alex1",
        estimatedValue: 65
      },
      toNFT: {
        id: 1,
        title: "My Rare Prompt",
        category: "rare",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=myNFT1",
        estimatedValue: 50
      },
      status: 'pending'
    }
  ]);
  
  const [myNFTs, setMyNFTs] = useState([
    {
      id: 1,
      title: "My Rare Prompt",
      category: "rare",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=myNFT1",
      estimatedValue: 50,
      isAvailableForTrade: false
    },
    {
      id: 2,
      title: "My Epic Badge",
      category: "epic",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=myNFT2",
      estimatedValue: 75,
      isAvailableForTrade: false
    }
  ]);

  const [availableNFTs, setAvailableNFTs] = useState([
    {
      id: 101,
      title: "Epic Creator Badge",
      category: "epic",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=trade1",
      owner: "Alex",
      estimatedValue: 55
    },
    {
      id: 102,
      title: "Legendary Prompt Token",
      category: "legendary",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=trade2",
      owner: "Sarah",
      estimatedValue: 120
    },
    // Add more available NFTs
  ]);

  const getCategoryStyle = (category) => {
    const styles = {
      legendary: 'border-yellow-500 bg-yellow-500/10',
      epic: 'border-purple-500 bg-purple-500/10',
      rare: 'border-blue-500 bg-blue-500/10',
      common: 'border-gray-500 bg-gray-500/10'
    };
    return styles[category] || 'border-gray-700';
  };

  const handleSetAvailableToTrade = (nft) => {
    setMyNFTs(currentNFTs => 
      currentNFTs.map(item => 
        item.id === nft.id 
          ? { ...item, isAvailableForTrade: !item.isAvailableForTrade }
          : item
      )
    );

    // If NFT is being made unavailable, deselect it
    if (selectedNFT?.id === nft.id) {
      setSelectedNFT(null);
    }
  };

  const handleProposeTrade = (offeredNFT, requestedNFT) => {
    // Simulate successful trade
    setTradedNFT({
      offered: offeredNFT,
      received: requestedNFT
    });
    
    // Update NFT lists
    setMyNFTs(current => [
      ...current.filter(nft => nft.id !== offeredNFT.id),
      { ...requestedNFT, isAvailableForTrade: false }
    ]);
    
    setAvailableNFTs(current => [
      ...current.filter(nft => nft.id !== requestedNFT.id),
      { ...offeredNFT, owner: requestedNFT.owner }
    ]);

    setShowTradeSuccess(true);
    setSelectedNFT(null);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowTradeSuccess(false);
      setTradedNFT(null);
    }, 3000);
  };

  const initiateTradeRequest = (targetNFT) => {
    if (!selectedNFT) {
      // Show modal to select user's NFT first
      setSelectedTargetNFT(targetNFT);
      setShowTradeModal(true);
    } else {
      handleProposeTrade(selectedNFT, targetNFT);
    }
  };

  const sendTradeRequest = (myNFT, theirNFT) => {
    const newRequest = {
      id: Date.now(),
      from: 'You',
      fromNFT: myNFT,
      toNFT: theirNFT,
      status: 'pending'
    };
    setTradeRequests(prev => [...prev, newRequest]);
    setShowTradeModal(false);
    setSelectedNFT(null);
  };

  const handleTradeResponse = (requestId, accepted) => {
    setTradeRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: accepted ? 'accepted' : 'rejected' }
          : req
      )
    );

    if (accepted) {
      // Simulate trade completion
      setTimeout(() => {
        setTradeRequests(prev => prev.filter(req => req.id !== requestId));
        // Update NFTs ownership here
      }, 2000);
    } else {
      // Remove rejected request after delay
      setTimeout(() => {
        setTradeRequests(prev => prev.filter(req => req.id !== requestId));
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">NFT Trading Hub</h1>
          <p className="text-gray-400">Exchange your NFTs with other creators</p>
        </div>

        {/* Success Message */}
        {showTradeSuccess && tradedNFT && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-green-900/30 border border-green-500/50 rounded-lg p-4"
          >
            <div className="flex items-center text-green-400">
              <FaExchangeAlt className="mr-2" />
              <span>Trade Successful!</span>
            </div>
            <p className="text-sm text-green-300 mt-1">
              You traded "{tradedNFT.offered.title}" for "{tradedNFT.received.title}"
            </p>
          </motion.div>
        )}

        {/* Trade Requests Section */}
        {tradeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaBell className="mr-2 text-yellow-500" />
              Trade Requests
            </h2>
            <div className="grid gap-4">
              {tradeRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* From NFT */}
                      <div className="text-center">
                        <img
                          src={request.fromNFT.image}
                          alt={request.fromNFT.title}
                          className="w-16 h-16 rounded-lg mb-2"
                        />
                        <p className="text-sm text-gray-400">{request.from}</p>
                      </div>
                      
                      {/* Exchange Icon */}
                      <FaExchangeAlt className="text-purple-500" />
                      
                      {/* To NFT */}
                      <div className="text-center">
                        <img
                          src={request.toNFT.image}
                          alt={request.toNFT.title}
                          className="w-16 h-16 rounded-lg mb-2"
                        />
                        <p className="text-sm text-gray-400">You</p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTradeResponse(request.id, true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <FaCheck />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleTradeResponse(request.id, false)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <FaTimes />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <div className="text-green-400 flex items-center">
                        <FaCheck className="mr-2" />
                        Accepted
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your NFTs Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your NFTs</h2>
            <div className="space-y-4">
              {myNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-2 ${getCategoryStyle(nft.category)} rounded-lg p-4 ${
                    nft.isAvailableForTrade ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-75'
                  } transition-all`}
                  onClick={() => nft.isAvailableForTrade && setSelectedNFT(nft)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{nft.title}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <SiPolygon className="mr-1" />
                        <span>Est. {nft.estimatedValue} MATIC</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedNFT?.id === nft.id && (
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Selected
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAvailableToTrade(nft);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          nft.isAvailableForTrade
                            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                        }`}
                      >
                        {nft.isAvailableForTrade ? 'Remove from Trade' : 'Set Available'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Available Trades Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available for Trade</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  className="bg-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              {availableNFTs
                .filter(nft => 
                  nft.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((nft) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-2 ${getCategoryStyle(nft.category)} rounded-lg p-4`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={nft.image}
                        alt={nft.title}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{nft.title}</h3>
                        <p className="text-sm text-gray-400">Owned by {nft.owner}</p>
                        <div className="flex items-center text-sm text-gray-400">
                          <SiPolygon className="mr-1" />
                          <span>Est. {nft.estimatedValue} MATIC</span>
                        </div>
                      </div>
                      <button
                        onClick={() => initiateTradeRequest(nft)}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors 
                          bg-purple-600 hover:bg-purple-700 text-white`}
                      >
                        <FaExchangeAlt />
                        <span>Trade</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        {/* Trade Modal */}
        {showTradeModal && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Select Your NFT to Trade</h2>
                  <button
                    onClick={() => setShowTradeModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <img
                      src={selectedTargetNFT.image}
                      alt={selectedTargetNFT.title}
                      className="w-16 h-16 rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{selectedTargetNFT.title}</h3>
                      <p className="text-sm text-gray-400">Owned by {selectedTargetNFT.owner}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {myNFTs
                    .filter(nft => nft.isAvailableForTrade)
                    .map((nft) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-2 ${getCategoryStyle(nft.category)} rounded-lg p-4 cursor-pointer
                          ${selectedNFT?.id === nft.id ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedNFT(nft)}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={nft.image}
                            alt={nft.title}
                            className="w-16 h-16 rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold">{nft.title}</h3>
                            <div className="flex items-center text-sm text-gray-400">
                              <SiPolygon className="mr-1" />
                              <span>Est. {nft.estimatedValue} MATIC</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowTradeModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedNFT) {
                        sendTradeRequest(selectedNFT, selectedTargetNFT);
                      }
                    }}
                    disabled={!selectedNFT}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
                      ${selectedNFT
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                  >
                    <FaExchangeAlt />
                    <span>Send Trade Request</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trade;
