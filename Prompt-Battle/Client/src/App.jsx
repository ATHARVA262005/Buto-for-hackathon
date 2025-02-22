import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaChartBar, FaWallet, FaBars, FaAngleDoubleLeft, FaAngleDoubleRight, FaStore, FaExchangeAlt, FaHistory, FaMedal } from 'react-icons/fa';
import Dashboard from './screens/Dashboard';
import SubmitPrompt from './screens/SubmitPrompt.jsx';
import Home from './screens/Home';
import Marketplace from './screens/Marketplace';
import Checkout from './screens/Checkout';
import Trade from './screens/Trade';
import Transactions from './screens/Transactions';
import ClaimNFT from './screens/ClaimNFT';

function NavLink({ to, children, icon, collapsed, notificationCount }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center ${
        collapsed ? 'justify-center px-0' : 'justify-start px-4'
      } py-3 rounded-lg transition-all duration-200 relative ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <div className={`h-8 flex items-center justify-center ${collapsed ? 'w-12' : 'w-8'}`}>
        {icon}
      </div>
      {!collapsed && <span className="ml-2">{children}</span>}
      {notificationCount > 0 && (
        <div className={`absolute ${collapsed ? 'top-2 right-2' : 'top-2 right-4'} 
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
  // Initialize sidebar state from localStorage
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  // Store sidebar state in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Toggle sidebar state
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const [tradeRequests] = useState([
    // Example trade request for notification demo
    {
      id: 1,
      status: 'pending'
    }
  ]);

  // Get pending requests count
  const pendingRequestsCount = tradeRequests.filter(req => req.status === 'pending').length;

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
        >
          {/* Logo Section - Updated Layout */}
          <div className="h-16 border-b border-gray-700 flex items-center">
            {!isSidebarCollapsed && (
              <div className="flex-1 px-4">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
                  Prompt Battle
                </span>
              </div>
            )}
            {/* Toggle button with fixed width */}
            <div 
              onClick={toggleSidebar}
              className="w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <FaAngleDoubleRight size={20} /> : <FaAngleDoubleLeft size={20} />}
            </div>
          </div>

          {/* Updated Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink to="/" icon={<FaHome size={20} />} collapsed={isSidebarCollapsed}>Home</NavLink>
            <NavLink to="/submit-prompt" icon={<FaPlusCircle size={20} />} collapsed={isSidebarCollapsed}>Submit Prompt</NavLink>
            <NavLink to="/dashboard" icon={<FaChartBar size={20} />} collapsed={isSidebarCollapsed}>Dashboard</NavLink>
            <NavLink to="/marketplace" icon={<FaStore size={20} />} collapsed={isSidebarCollapsed}>Marketplace</NavLink>
            <NavLink 
              to="/trade" 
              icon={<FaExchangeAlt size={20} />} 
              collapsed={isSidebarCollapsed}
              notificationCount={pendingRequestsCount}
            >
              Trade NFTs
            </NavLink>
            <NavLink to="/transactions" icon={<FaHistory size={20} />} collapsed={isSidebarCollapsed}>
              Transactions
            </NavLink>
            <NavLink to="/claim-nft" icon={<FaMedal size={20} />} collapsed={isSidebarCollapsed}>
              Claim NFT
            </NavLink>
          </nav>

          {/* Updated Bottom Section with consistent icon size */}
          <div className="p-4 border-t border-gray-700">
            <button className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center py-3' : 'justify-start px-4 py-3'
            } rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200`}
            >
              <div className={`h-8 flex items-center justify-center ${isSidebarCollapsed ? 'w-12' : 'w-8'}`}>
                <FaWallet size={20} className="flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">Connect Wallet</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;