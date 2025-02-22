import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaFireAlt,
  FaChartLine,
  FaMedal,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaWallet,
  FaExchangeAlt,
  FaCopy,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";
import NFTCard from '../components/NFTCard';
import NFTCardList from '../components/NFTCardList';
import { useWebSocket } from '../hooks/useWebSocket';

const WalletDetails = () => {
  const [walletInfo, setWalletInfo] = useState({
    address: "",
    balance: 0,
    transactions: [],
  });
  const [isCopied, setIsCopied] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    const intervalId = setInterval(checkWalletConnection, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const checkWalletConnection = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // Check if Petra wallet is available
      if (typeof window.aptos === "undefined") {
        console.log("Petra wallet is not installed");
        return;
      }

      try {
        // Connect to Petra wallet
        const response = await window.aptos.connect();

        // Get account info
        const account = await window.aptos.account();

        if (account?.address) {
          try {
            // Get balance using Aptos API
            const balanceResponse = await fetch(
              `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/resources`
            );

            if (!balanceResponse.ok) {
              throw new Error(`HTTP error! status: ${balanceResponse.status}`);
            }

            const resources = await balanceResponse.json();

            // Find APT coin store resource
            const coinResource = resources.find(
              (r) =>
                r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
            );

            const balance = coinResource
              ? parseInt(coinResource.data.coin.value) / 100000000
              : 0;

            setWalletInfo((prevState) => ({
              ...prevState,
              address: account.address,
              balance: balance,
            }));
          } catch (error) {
            console.error("Error fetching balance:", error);
            setWalletInfo((prevState) => ({
              ...prevState,
              address: account.address,
              balance: 0,
            }));
          }
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected wallet connection");
        } else {
          console.error("Error connecting to wallet:", error);
        }
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletInfo.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const validateAptosAddress = (address) => {
    return /^0x[a-fA-F0-9]{64}$/.test(address);
  };

  const SendModal = ({ onClose }) => {
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!recipientAddress || !amount) {
        setError("⚠️ Please fill in all fields");
        return;
      }
      if (!validateAptosAddress(recipientAddress)) {
        setError("❌ Invalid Aptos address");
        return;
      }

      setError("");
      setSuccess(true);

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    };

    return (
      <>
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/80 z-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl relative">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Send APT</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
              >
                <FaTimes />
              </button>
            </div>

            {/* Success Message */}
            {success ? (
              <div className="p-5 bg-green-800 text-white rounded-lg shadow-lg animate-fade-in space-y-4">
                <div className="flex flex-col items-center">
                  <FaCheckCircle className="text-5xl text-green-300 animate-pulse mb-3" />
                  <h3 className="text-xl font-bold">
                    Transaction Successful! ✅
                  </h3>
                </div>

                <div className="bg-green-900 p-3 rounded-md text-sm">
                  <p className="truncate w-full">
                    <span className="font-bold">📩 Sent to:</span>{" "}
                    {recipientAddress}
                  </p>
                  <p className="mt-1">
                    <span className="font-bold">💰 Amount:</span> {amount} APT
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-white text-green-800 font-semibold py-2 rounded-lg hover:bg-green-300 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              // Form for entering transaction details
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter APT address"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">
                    Amount (APT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2 text-white font-semibold"
                >
                  Send APT
                </button>
              </form>
            )}
          </div>
        </div>
      </>
    );
  };

  const ReceiveModal = () => (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/80 z-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Receive APT</h3>
            <button
              onClick={() => setShowReceiveModal(false)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center p-6 bg-gray-700 rounded-lg">
              <div className="mb-4">
                <FaDownload className="mx-auto h-12 w-12 text-blue-500" />
              </div>
              <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
              <p className="font-mono bg-gray-800 p-3 rounded break-all">
                {walletInfo.address}
              </p>
            </div>

            <button
              onClick={copyAddress}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <FaCopy />
              <span>{isCopied ? "Copied!" : "Copy Address"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const ConnectWalletButton = () => (
    <button
      onClick={checkWalletConnection}
      disabled={isConnecting}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
    >
      <FaWallet className="h-4 w-4" />
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );

  return (
    <div className="p-4 space-y-3"> {/* Reduced padding and spacing */}
      <div className="flex items-center justify-between mb-2"> {/* Reduced margin */}
        <h2 className="text-lg font-bold text-white">Wallet Details</h2> {/* Smaller text */}
        <FaWallet className="text-blue-500 h-4 w-4" /> {/* Smaller icon */}
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4 space-y-4"> {/* Reduced padding and spacing */}
        {!walletInfo.address ? (
          <ConnectWalletButton />
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Wallet Address</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-800 rounded-lg p-3 font-mono text-sm">
                  {formatAddress(walletInfo.address)}
                </div>
                <button
                  onClick={copyAddress}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copy address"
                >
                  {isCopied ? (
                    <span className="text-green-500 text-sm">Copied!</span>
                  ) : (
                    <FaCopy className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Balance</label>
              <div className="bg-gray-800 rounded-lg p-3">
                <span className="text-2xl font-bold text-white">
                  {walletInfo.balance.toFixed(4)}
                </span>
                <span className="ml-2 text-gray-400">APT</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Quick Actions</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowSendModal(true)}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-lg p-3 transition-colors"
                >
                  <FaExchangeAlt className="h-4 w-4" />
                  <span>Send APT</span>
                </button>
                <button
                  onClick={() => setShowReceiveModal(true)}
                  className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 rounded-lg p-3 transition-colors"
                >
                  <FaDownload className="h-4 w-4" />
                  <span>Receive APT</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showReceiveModal && <ReceiveModal />}
      {showSendModal && <SendModal onClose={() => setShowSendModal(false)} />}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalPrompts: 0, // Initialize to 0
    totalVotes: 156,
    nftsMinted: 8,
    ranking: 15,
  });
  const [walletAddress, setWalletAddress] = useState(null);
  const [recentNFTs, setRecentNFTs] = useState([
    {
      prompt: "I want an AI system that can automatically review code, identify potential bugs, and suggest improvements while following best practices.",
      metadata: {
        subject: "Programming Challenge",
        problemStatement: "Create an AI-powered code review assistant",
      },
      rank: 1,
      votes: 156
    },
    {
      prompt: "I want an AI system that can automatically review code, identify potential bugs, and suggest improvements while following best practices.",
      metadata: {
        subject: "AI Development",
        problemStatement: "Design a natural language processing system",
      },
      rank: 2,
      votes: 142
    },
    {
      prompt: "I want an AI system that can automatically review code, identify potential bugs, and suggest improvements while following best practices.",
      metadata: {
        subject: "Web3 Integration",
        problemStatement: "Build a decentralized voting system",
      },
      rank: 3,
      votes: 128
    }
  ]);
  const [recentParticipations, setRecentParticipations] = useState([
    {
      eventName: "Weekly Prompt Battle",
      date: "2024-02-18",
      rank: 3,
      votes: 128,
      problemStatement: "Build a decentralized voting system"
    },
    {
      eventName: "AI Challenge",
      date: "2024-02-11",
      rank: 2,
      votes: 142,
      problemStatement: "Design an AI code reviewer"
    }
  ]);

  // Modified to fetch both prompt count and votes
  const fetchUserStats = async (address) => {
    try {
      console.log('Fetching user stats for address:', address);
      const response = await fetch(`http://localhost:5001/api/prompts/user-stats/${address}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received user stats:', data);
      
      setUserStats(prev => ({
        ...prev,
        totalPrompts: data.totalPrompts || 0,
        totalVotes: data.totalVotes || 0,
        ranking: data.ranking || 0
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Update wallet connection effect to use new stats function
  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (typeof window.aptos === "undefined") {
          console.log("Petra wallet is not installed");
          return;
        }

        const response = await window.aptos.connect();
        const account = await window.aptos.account();
        
        if (account?.address) {
          console.log('Connected wallet address:', account.address);
          setWalletAddress(account.address);
          // Fetch both prompt count and votes
          fetchUserStats(account.address);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    };
    connectWallet();
  }, []);

  // Update WebSocket handler
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'STATS_UPDATE':
        if (data.walletAddress === walletAddress) {
          setUserStats(prev => ({
            ...prev,
            totalPrompts: data.totalPrompts,
            totalVotes: data.totalVotes
          }));
        }
        break;
      case 'PROMPT_COUNT_UPDATE':
        if (data.walletAddress === walletAddress) {
          setUserStats(prev => ({
            ...prev,
            totalPrompts: data.count
          }));
        }
        break;
      case 'NFT_UPDATE':
        setRecentNFTs(prevNFTs => {
          const updatedNFTs = [...prevNFTs];
          const index = updatedNFTs.findIndex(nft => nft._id === data.nft._id);
          if (index !== -1) {
            updatedNFTs[index] = data.nft;
          }
          return updatedNFTs;
        });
        break;
      case 'PARTICIPATION_UPDATE':
        setRecentParticipations(data.participations);
        break;
    }
  };

  // Initialize WebSocket connection
  useWebSocket('ws://localhost:5001', handleWebSocketMessage);

  // Add fetch function for initial data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, nftsRes, participationsRes] = await Promise.all([
          fetch('http://localhost:5001/api/user/stats'),
          fetch('http://localhost:5001/api/user/nfts'),
          fetch('http://localhost:5001/api/user/participations')
        ]);

        const [stats, nfts, participations] = await Promise.all([
          statsRes.json(),
          nftsRes.json(),
          participationsRes.json()
        ]);

        setUserStats(stats);
        setRecentNFTs(nfts);
        setRecentParticipations(participations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800"> {/* Reduced padding */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft size={14} /> {/* Smaller icon */}
          <span className="text-sm">Back to Home</span> {/* Smaller text */}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"> {/* Reduced padding and gap */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-900/30 rounded-full">
              <FaChartLine className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Your Prompts</p>
              <h3 className="text-xl font-bold">{userStats.totalPrompts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-900/30 rounded-full">
              <FaTrophy className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total Votes</p>
              <h3 className="text-xl font-bold">{userStats.totalVotes}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-900/30 rounded-full">
              <FaMedal className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">NFTs Minted</p>
              <h3 className="text-xl font-bold">{userStats.nftsMinted}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-900/30 rounded-full">
              <FaFireAlt className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Your Ranking</p>
              <h3 className="text-xl font-bold">#{userStats.ranking}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3"> {/* Reduced padding and gap */}
        {/* Left Column - Recent NFTs */}
        <div className="lg:col-span-2 space-y-3"> {/* Added space-y-3 */}
          <NFTCardList nfts={recentNFTs} />

          {/* Recent Participations Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" size={16} />
              Recent Participations
            </h2>
            <div className="space-y-2">
              {recentParticipations.map((participation, index) => (
                <div 
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{participation.eventName}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {participation.problemStatement}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Rank</p>
                      <p className={`font-bold ${
                        participation.rank === 1 ? 'text-yellow-400' :
                        participation.rank === 2 ? 'text-purple-400' :
                        participation.rank === 3 ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>#{participation.rank}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Votes</p>
                      <p className="font-bold text-white">{participation.votes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Wallet and Events */}
        <div className="space-y-3"> {/* Reduced spacing */}
          {/* Wallet Section */}
          <div className="bg-gray-800 rounded-lg">
            <WalletDetails />
          </div>

          {/* Compact Upcoming Event Section */}
          <div className="bg-gray-800 rounded-lg p-3"> {/* Reduced padding */}
            <h2 className="text-base font-bold mb-2 flex items-center gap-2"> {/* Smaller text and margin */}
              <FaChartLine className="text-purple-500" size={14} /> {/* Smaller icon */}
              Next Events
            </h2>
            <div className="space-y-2"> {/* Added container with spacing */}
              <div className="border-l-4 border-blue-500 pl-2 py-1"> {/* Reduced padding */}
                <h3 className="font-semibold text-sm">Weekly Prompt Battle</h3>
                <p className="text-xs text-gray-400 mt-0.5">Starts in 2 days</p> {/* Smaller text and margin */}
              </div>
              <div className="border-l-4 border-purple-500 pl-2 py-1">
                <h3 className="font-semibold text-sm">AI Challenge</h3>
                <p className="text-xs text-gray-400 mt-0.5">Starts in 4 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
