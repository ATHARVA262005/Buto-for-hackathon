import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaShoppingCart, FaTag, FaFilter, FaSearch, FaClock } from 'react-icons/fa';
import { SiPolygon } from 'react-icons/si';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const transactions = [
    {
      id: 1,
      type: 'purchase',
      nftTitle: "Epic Creator Badge",
      amount: 50,
      date: "2024-02-20",
      status: 'completed',
      from: 'Marketplace',
      to: 'You',
      hash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'trade',
      nftGiven: "Rare Prompt Master",
      nftReceived: "Legendary Token",
      date: "2024-02-19",
      status: 'completed',
      with: 'Alex',
      hash: '0x8765...4321'
    },
    {
      id: 3,
      type: 'sale',
      nftTitle: "AI Innovation Badge",
      amount: 30,
      date: "2024-02-18",
      status: 'pending',
      from: 'You',
      to: 'Sarah',
      hash: '0x9876...1234'
    }
  ];

  const transactionTypes = [
    { id: 'all', name: 'All', icon: <FaFilter /> },
    { id: 'purchase', name: 'Purchases', icon: <FaShoppingCart /> },
    { id: 'sale', name: 'Sales', icon: <FaTag /> },
    { id: 'trade', name: 'Trades', icon: <FaExchangeAlt /> }
  ];

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.nftTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.nftGiven?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.nftReceived?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderTransaction = (tx) => {
    const commonClasses = "bg-gray-800 rounded-lg p-6 border border-gray-700";
    
    switch (tx.type) {
      case 'purchase':
      case 'sale':
        return (
          <motion.div 
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${commonClasses} ${
              tx.status === 'pending' ? 'bg-yellow-900/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  tx.type === 'purchase' ? 'bg-green-900/30' : 'bg-blue-900/30'
                }`}>
                  {tx.type === 'purchase' ? <FaShoppingCart /> : <FaTag />}
                </div>
                <div>
                  <h3 className="font-bold">{tx.nftTitle}</h3>
                  <p className="text-sm text-gray-400">
                    {tx.type === 'purchase' ? 'Purchased from' : 'Sold to'} {tx.type === 'purchase' ? tx.from : tx.to}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <SiPolygon className="text-purple-500" />
                  <span className="font-bold">{tx.amount} MATIC</span>
                </div>
                <p className="text-sm text-gray-400">{tx.date}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">{tx.hash}</div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                tx.status === 'completed' 
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-yellow-900/30 text-yellow-400'
              }`}>
                {tx.status}
              </div>
            </div>
          </motion.div>
        );

      case 'trade':
        return (
          <motion.div 
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={commonClasses}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-900/30 rounded-full">
                  <FaExchangeAlt />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{tx.nftGiven}</span>
                    <FaExchangeAlt className="text-purple-500" />
                    <span className="font-bold">{tx.nftReceived}</span>
                  </div>
                  <p className="text-sm text-gray-400">Traded with {tx.with}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{tx.date}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">{tx.hash}</div>
              <div className="px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400">
                {tx.status}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-gray-400">Track your NFT purchases, sales, and trades</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-400" />
            <span className="text-gray-400">Last 30 days</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {transactionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  selectedType === type.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type.icon}
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map(renderTransaction)}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
