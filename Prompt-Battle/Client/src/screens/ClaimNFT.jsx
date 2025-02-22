import React, { useState, useEffect } from 'react';
import { SiPolygon } from 'react-icons/si';
import { 
  FaClock, 
  FaGasPump, 
  FaNetworkWired, 
  FaTrophy, 
  FaChartLine, 
  FaPlusCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NFTCard from '../components/NFTCard';

const ClaimNFT = () => {
  const navigate = useNavigate();
  const [isEligible, setIsEligible] = useState(true);
  const [rank, setRank] = useState(42);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const [hasNFTToClaim, setHasNFTToClaim] = useState(true);
  const [promptDetails] = useState({
    subject: "AI Image Generation",
    week: "Week 3",
    theme: "Future of Technology",
    image: "https://your-ai-generated-image-url.com/image.jpg"
  });
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 48,
    minutes: 0,
    seconds: 0
  });
  const [networkDetails] = useState({
    name: 'Polygon Mumbai',
    chainId: '0x13881',
    currency: 'MATIC',
    estimatedGas: '0.001',
    gasPrice: '40'
  });

  useEffect(() => {
    const claimedStatus = localStorage.getItem('nftClaimed');
    if (claimedStatus === 'true') {
      setClaimed(true);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkClaimableNFT = async () => {
      setLoading(true);
      try {
        const hasClaimable = false;
        setHasNFTToClaim(hasClaimable);
      } catch (err) {
        setError('Failed to check NFT status');
      } finally {
        setLoading(false);
      }
    };

    checkClaimableNFT();
  }, []);

  const getNFTDetailsByRank = (rank) => {
    if (rank <= 10) {
      return {
        category: 'legendary',
        tier: 'Legendary',
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=diamond",
        weekBonus: "Triple Score Week"
      };
    } else if (rank <= 25) {
      return {
        category: 'epic',
        tier: 'Epic',
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=platinum",
        weekBonus: "Double Score Week"
      };
    } else {
      return {
        category: 'rare',
        tier: 'Rare',
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=gold",
        weekBonus: "" // Removed "Standard Week" text
      };
    }
  };

  const nftDetails = getNFTDetailsByRank(rank);
  const metadata = {
    subject: promptDetails.subject,
    details: {
      Week: promptDetails.week,
      Theme: promptDetails.theme
    }
  };

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

  const handleClaim = async () => {
    if (!isEligible || claimed) {
      return;
    }
    
    try {
      setClaiming(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      localStorage.setItem('nftClaimed', 'true');
      setClaimed(true);
      alert(`NFT "${promptDetails.subject}" minted successfully!`);
    } catch (err) {
      setError('Failed to mint NFT');
    } finally {
      setClaiming(false);
    }
  };

  if (claimed) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4">NFT Already Claimed!</h2>
            <p className="text-gray-400 mb-4">
              You have already claimed your NFT reward. Check your wallet or visit the marketplace to view your NFT.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/marketplace'}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View in Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasNFTToClaim && !loading) {
    return (
      <div className="h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-gray-800 rounded-xl p-8 space-y-6">
            <div className="flex justify-center">
              <div className="bg-gray-700 p-4 rounded-full">
                <FaTrophy className="text-gray-400 w-12 h-12" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">No NFT Available to Claim</h2>
              <p className="text-gray-400">
                Participate in prompt battles and reach top 50 to earn claimable NFTs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/submit-prompt')}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <FaPlusCircle />
                <span>Submit Prompt</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaChartLine />
                <span>View Rankings</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              Top 50 participants in each prompt battle receive claimable NFTs with special perks!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Network Details Component
  const NetworkInfo = () => (
    <div className="bg-gray-800 p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaNetworkWired className="text-blue-400" />
          <span className="text-sm text-gray-400">Network</span>
        </div>
        <span className="font-semibold text-blue-400">{networkDetails.name}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaGasPump className="text-purple-400" />
          <span className="text-sm text-gray-400">Est. Gas Fee</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-purple-400">
            {networkDetails.estimatedGas} {networkDetails.currency}
          </span>
          <p className="text-xs text-gray-500">
            Gas Price: {networkDetails.gasPrice} Gwei
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: NFT Card - Using new component */}
        <div className="flex items-start">
          <NFTCard
            image={promptDetails.image}
            title={promptDetails.subject}
            metadata={metadata}
            category={nftDetails.category}
            tier={nftDetails.tier}
            rank={rank}
            weekBonus={nftDetails.weekBonus}
            getCategoryStyle={getCategoryStyle}
            getCategoryButtonStyle={getCategoryButtonStyle}
          />
        </div>

        {/* Right side: All content vertically centered */}
        <div className="flex items-center">
          <div className="w-full space-y-6">
            {/* Top content group */}
            <div className="space-y-4 flex flex-col items-center text-center">
              <h1 className="text-3xl font-bold">Your Exclusive NFT</h1>
              
              {/* Countdown Timer */}
              <div className="bg-gray-800 p-4 rounded-lg w-full max-w-sm">
                <div className="flex items-center justify-center space-x-2">
                  <FaClock className="text-blue-400" size={20} />
                  <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Time Remaining: {String(timeRemaining.hours).padStart(2, '0')}:
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Network Details */}
              <div className="w-full max-w-sm">
                <NetworkInfo />
              </div>

              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg w-full max-w-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Mint Button Section */}
            <div className="space-y-3 flex flex-col items-center w-full max-w-sm mx-auto">
              <p className="text-sm text-gray-400 text-center">
                Make sure you have enough {networkDetails.currency} for gas fees before minting
              </p>
              <button
                onClick={handleClaim}
                disabled={claiming || timeRemaining.hours === 0}
                className={`w-full py-4 rounded-lg ${
                  claiming || timeRemaining.hours === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : getCategoryButtonStyle(nftDetails.category)
                } transition-all duration-200 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl`}
              >
                {claiming ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Minting...</span>
                  </>
                ) : timeRemaining.hours === 0 ? (
                  <span>Claim Period Expired</span>
                ) : (
                  <>
                    <SiPolygon />
                    <span>Mint NFT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimNFT;