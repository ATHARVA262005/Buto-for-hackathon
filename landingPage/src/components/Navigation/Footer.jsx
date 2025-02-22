import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] py-4">
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
        <span>Made with</span>
        <FaHeart className="text-red-500 animate-pulse" />
        <span>by</span>
        <a 
          href="https://algoknight.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Team AlgoKnight
        </a>
      </div>
    </footer>
  );
};

export default Footer;
