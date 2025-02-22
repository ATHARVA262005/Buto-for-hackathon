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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Wallet Details</h2>
        <FaWallet className="text-blue-500 h-5 w-5" />
      </div>

      <div className="bg-gray-700/50 rounded-lg p-6 space-y-6">
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

      <div className="bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {walletInfo.transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No recent transactions
          </div>
        ) : (
          <div className="space-y-3">
            {walletInfo.transactions.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                {/* Transaction details would go here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [currentParticipationIndex, setCurrentParticipationIndex] = useState(0);
  const [showAllParticipations, setShowAllParticipations] = useState(false);

  const [prompts, setPrompts] = useState([]);
  const [leaderboard] = useState([
    {
      name: "Alex Chen",
      score: 2847,
      prompts: 32,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      badge: "Champion Creator",
    },
    {
      name: "Sarah Smith",
      score: 2456,
      prompts: 28,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      badge: "Elite Prompter",
    },
    {
      name: "Mike Johnson",
      score: 2123,
      prompts: 25,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      badge: "Rising Star",
    },
  ]);
  const [userStats, setUserStats] = useState({
    totalPrompts: 42,
    totalVotes: 156,
    nftsMinted: 8,
    ranking: 15,
  });
  const [recentParticipations] = useState([
    {
      eventName: "AI Prompt Challenge #24",
      date: "2024-02-15",
      position: "3rd",
      reward: "Bronze NFT",
      votes: 156,
    },
    {
      eventName: "Weekly Prompt Battle",
      date: "2024-02-10",
      position: "5th",
      reward: "Participation NFT",
      votes: 142,
    },
    {
      eventName: "Creative Prompt Contest",
      date: "2024-02-05",
      position: "1st",
      reward: "Gold NFT",
      votes: 289,
    },
  ]);

  const nfts = [
    { id: 1, title: "NFT #1" },
    { id: 2, title: "NFT #2" },
    { id: 3, title: "NFT #3" },
    { id: 4, title: "NFT #4" },
    { id: 5, title: "NFT #5" },
    { id: 6, title: "NFT #6" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const nftsPerPage = 3;
  const totalPages = Math.ceil(nfts.length / nftsPerPage);

  const getCurrentNFTs = () => {
    const start = currentPage * nftsPerPage;
    return nfts.slice(start, start + nftsPerPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextNFT = () => {
    setCurrentNFTIndex((prev) => (prev + 1) % nfts.length);
  };

  const handlePrevNFT = () => {
    setCurrentNFTIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
  };

  const renderParticipationCard = (participation) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">
            {participation.eventName}
          </h3>
          <p className="text-sm text-gray-400">{participation.date}</p>
        </div>
        <div className="text-right">
          <div
            className={`px-3 py-1 rounded-full text-sm mb-1
            ${
              participation.position === "1st"
                ? "bg-yellow-900/30 text-yellow-300"
                : participation.position === "2nd"
                ? "bg-gray-400/30 text-gray-300"
                : participation.position === "3rd"
                ? "bg-yellow-700/30 text-yellow-600"
                : "bg-blue-900/30 text-blue-400"
            }`}
          >
            {participation.position}
          </div>
          <div className="text-xs text-gray-400">
            {participation.votes} votes
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
          {participation.reward}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Back Button and Header */}
        <div className="shrink-0 px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Stats Cards - Fixed Height */}
        <div className="shrink-0 px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-full">
                  <FaChartLine className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Your Prompts</p>
                  <h3 className="text-xl font-bold text-white">
                    {userStats.totalPrompts}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-full">
                  <FaTrophy className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Votes</p>
                  <h3 className="text-xl font-bold text-white">
                    {userStats.totalVotes}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-full">
                  <FaMedal className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">NFTs Minted</p>
                  <h3 className="text-xl font-bold text-white">
                    {userStats.nftsMinted}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-full">
                  <FaFireAlt className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Your Ranking</p>
                  <h3 className="text-xl font-bold text-white">
                    #{userStats.ranking}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flex grow with no scroll */}
        <div className="flex-1 min-h-screen px-6 pb-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6 h-full">
              {/* NFT Showcase - Increased Height */}
              <div className="h-[400px] bg-gray-800 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-xl font-bold text-white">
                    Your NFT Collection
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                  </div>
                </div>
                <div className="relative flex h-[300px]">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`w-12 h-full flex items-center justify-center transition-colors
                      ${
                        currentPage === 0
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                  >
                    <FaChevronLeft className="h-8 w-8" />
                  </button>

                  <div className="flex-1 grid grid-cols-3 gap-4 px-4">
                    {getCurrentNFTs().map((nft) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="aspect-square rounded-lg bg-gray-700 p-2"
                      >
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {nft.title}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`w-12 h-full flex items-center justify-center transition-colors
                      ${
                        currentPage === totalPages - 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                  >
                    <FaChevronRight className="h-8 w-8" />
                  </button>
                </div>
              </div>

              {/* Recent Participations - Remaining Height */}
              <div className="flex-4 bg-gray-800 rounded-lg shadow-lg p-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Recent Participations
                  </h2>
                  <button
                    onClick={() => setShowAllParticipations(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View All
                  </button>
                </div>
                {/* Show only most recent participation */}
                {recentParticipations.length > 0 &&
                  renderParticipationCard(recentParticipations[0])}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 h-full">
              {/* Top Creators - Flex grow */}
              <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <WalletDetails />
              </div>

              {/* Upcoming Events - Fixed Height */}
              <div className="h-[200px] bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-white">
                      Weekly Prompt Battle
                    </h3>
                    <p className="text-sm text-gray-400">Starts in 2 days</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-white">
                      AI Art Challenge
                    </h3>
                    <p className="text-sm text-gray-400">Starts in 5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Participations Modal with Vignette */}
      {showAllParticipations && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/10 z-50" />
          <div className="fixed inset-0 z-50 vignette-overlay" />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden border border-gray-700/50 shadow-xl">
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">All Participations</h2>
                <button
                  onClick={() => setShowAllParticipations(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="space-y-4">
                  {recentParticipations.map((participation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {renderParticipationCard(participation)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(75, 85, 99);
          border-radius: 3px;
        }
        .vignette-overlay {
          background: radial-gradient(
            circle at center,
            transparent 30%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
