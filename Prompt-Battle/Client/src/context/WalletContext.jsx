import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const checkWalletConnection = async () => {
    try {
      console.log('Checking wallet connection...');
      if (window.aptos) {
        const response = await window.aptos.isConnected();
        console.log('Wallet connected status:', response);
        if (response) {
          const account = await window.aptos.account();
          console.log('Connected wallet account:', account);
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
      console.log('Attempting to connect wallet...');
      if (!window.aptos) {
        console.log('Petra wallet not found');
        alert("Please install Petra Wallet");
        return;
      }
      const response = await window.aptos.connect();
      console.log('Wallet connect response:', response);
      const account = await window.aptos.account();
      console.log('Connected account:', account);
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
      setWalletAddress('');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <WalletContext.Provider value={{
      isWalletConnected,
      walletAddress,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
