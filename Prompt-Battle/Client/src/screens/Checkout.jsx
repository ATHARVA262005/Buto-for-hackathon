import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaWallet } from 'react-icons/fa';
import { SiPolygon } from 'react-icons/si';  // Correct import for Polygon icon

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nft = location.state?.nft; // Get NFT data passed through navigation
  const [isProcessing, setIsProcessing] = useState(false);

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No NFT Selected</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-blue-400 hover:text-blue-300"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page or show success message
      navigate('/marketplace');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <FaArrowLeft />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NFT Preview */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold mb-2">{nft.title}</h2>
            <p className="text-gray-400 mb-4">{nft.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Creator</span>
              <span className="font-medium">{nft.creator}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400">Category</span>
              <span className="capitalize font-medium">{nft.category}</span>
            </div>
          </div>

          {/* Checkout Details */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Checkout Details</h2>
            
            {/* Price Summary */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price</span>
                <div className="flex items-center space-x-2">
                  <SiPolygon className="text-purple-500" />
                  <span className="font-bold">{nft.price} MATIC</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network Fee</span>
                <div className="flex items-center space-x-2">
                  <SiPolygon className="text-purple-500" />
                  <span className="font-bold">0.001 MATIC</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <div className="flex items-center space-x-2">
                    <SiPolygon className="text-purple-500" />
                    <span className="font-bold">{nft.price + 0.001} MATIC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-lg mb-4 flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors`}
            >
              <FaWallet size={20} />
              <span>{isProcessing ? 'Processing...' : 'Pay with Wallet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
