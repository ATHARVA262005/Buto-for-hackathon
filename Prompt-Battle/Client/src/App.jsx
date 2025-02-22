import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaChartBar,
  FaWallet,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaStore,
  FaExchangeAlt,
  FaHistory,
  FaMedal,
  FaSignOutAlt,
} from "react-icons/fa";
import Dashboard from "./screens/Dashboard";
import SubmitPrompt from "./screens/SubmitPrompt.jsx";
import Home from "./screens/Home";
import Marketplace from "./screens/Marketplace";
import Checkout from "./screens/Checkout";
import Trade from "./screens/Trade";
import Transactions from "./screens/Transactions";
import ClaimNFT from "./screens/ClaimNFT";
import ExplorePage from './screens/ExplorePage';
import PromptPage from './screens/PromptPage';

function NavLink({ to, children, icon, collapsed, notificationCount }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center ${
        collapsed ? "justify-center px-0" : "justify-start px-4"
      } py-3 rounded-lg transition-all duration-200 relative ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <div
        className={`h-8 flex items-center justify-center ${
          collapsed ? "w-12" : "w-8"
        }`}
      >
        {icon}
      </div>
      {!collapsed && <span className="ml-2">{children}</span>}
      {notificationCount > 0 && (
        <div
          className={`absolute ${collapsed ? "top-2 right-2" : "top-2 right-4"} 
          bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center
          animate-pulse`}
        >
          {notificationCount}
        </div>
      )}
    </Link>
  );
}

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tradeRequests] = useState([{ id: 1, status: "pending" }]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
    checkWalletConnection();
  }, [isSidebarCollapsed]);

  const checkWalletConnection = async () => {
    try {
      // Check if Petra wallet is installed
      if (window.aptos) {
        const response = await window.aptos.isConnected();
        if (response) {
          const account = await window.aptos.account();
          setWalletAddress(account.address);
          setIsWalletConnected(true);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.aptos) {
        alert("Please install Petra Wallet");
        return;
      }

      const response = await window.aptos.connect();
      const account = await window.aptos.account();
      setWalletAddress(account.address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setIsWalletConnected(false);
      setWalletAddress("");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const pendingRequestsCount = tradeRequests.filter(
    (req) => req.status === "pending"
  ).length;

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-16" : "w-64"}`}
        >
          <div className="h-16 border-b border-gray-700 flex items-center">
            {!isSidebarCollapsed && (
              <div className="flex-1 px-4">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
                  Prompt Battle
                </span>
              </div>
            )}
            <div
              onClick={toggleSidebar}
              className="w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? (
                <FaAngleDoubleRight size={20} />
              ) : (
                <FaAngleDoubleLeft size={20} />
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/"
              icon={<FaHome size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Home
            </NavLink>
            <NavLink
              to="/submit-prompt"
              icon={<FaPlusCircle size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Submit Prompt
            </NavLink>
            <NavLink
              to="/dashboard"
              icon={<FaChartBar size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/marketplace"
              icon={<FaStore size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Marketplace
            </NavLink>
            <NavLink
              to="/trade"
              icon={<FaExchangeAlt size={20} />}
              collapsed={isSidebarCollapsed}
              notificationCount={pendingRequestsCount}
            >
              Trade NFTs
            </NavLink>
            <NavLink
              to="/transactions"
              icon={<FaHistory size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Transactions
            </NavLink>
            <NavLink
              to="/claim-nft"
              icon={<FaMedal size={20} />}
              collapsed={isSidebarCollapsed}
            >
              Claim NFT
            </NavLink>
          </nav>

          <div className="p-4 border-t border-gray-700 space-y-2">
            {isWalletConnected && (
              <div
                className={`text-center ${
                  isSidebarCollapsed ? "px-1" : "px-4"
                }`}
              >
                <span className="text-sm text-gray-400">
                  {isSidebarCollapsed ? "..." : formatAddress(walletAddress)}
                </span>
              </div>
            )}
            <button
              onClick={isWalletConnected ? disconnectWallet : connectWallet}
              className={`w-full flex items-center ${
                isSidebarCollapsed
                  ? "justify-center py-3"
                  : "justify-start px-4 py-3"
              } rounded-lg bg-gradient-to-r ${
                isWalletConnected
                  ? "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } transition-all duration-200`}
            >
              <div
                className={`h-8 flex items-center justify-center ${
                  isSidebarCollapsed ? "w-12" : "w-8"
                }`}
              >
                {isWalletConnected ? (
                  <FaSignOutAlt size={20} className="flex-shrink-0" />
                ) : (
                  <FaWallet size={20} className="flex-shrink-0" />
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  {isWalletConnected ? "Disconnect" : "Connect Wallet"}
                </span>
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit-prompt" element={<SubmitPrompt />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/claim-nft" element={<ClaimNFT />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/prompt/:id" element={<PromptPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
