"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const PhantomWalletContext = createContext();

export const usePhantomWallet = () => {
  const context = useContext(PhantomWalletContext);
  if (!context) {
    throw new Error("usePhantomWallet must be used within a PhantomWalletProvider");
  }
  return context;
};

export const PhantomWalletProvider = ({ children }) => {
  const [phantom, setPhantom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const getProvider = () => {
      if (typeof window !== "undefined" && "solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          return provider;
        }
      }
      return null;
    };

    const provider = getProvider();
    setPhantom(provider);

    if (provider) {
      // check if already connected
      provider
        .connect({ onlyIfTrusted: true })
        .then((response) => {
          setConnected(true);
          setPublicKey(response.publicKey.toString());
        })
        .catch(() => {
          // user not previously connected
        });
    }
  }, []);

  const connectWallet = async () => {
    if (!phantom) {
      window.open("https://phantom.app/", "_blank");
      return { success: false, error: "Phantom wallet not installed" };
    }

    try {
      setConnecting(true);
      const response = await phantom.connect();
      setConnected(true);
      setPublicKey(response.publicKey.toString());
      return { success: true, publicKey: response.publicKey.toString() };
    } catch (error) {
      console.error("Failed to connect to Phantom:", error);
      return { success: false, error: error.message };
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (phantom && connected) {
      try {
        await phantom.disconnect();
        setConnected(false);
        setPublicKey(null);
        return { success: true };
      } catch (error) {
        console.error("Failed to disconnect from Phantom:", error);
        return { success: false, error: error.message };
      }
    }
  };

  const signMessage = async (message) => {
    if (!phantom || !connected) {
      throw new Error("Wallet not connected");
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await phantom.signMessage(encodedMessage, "utf8");
      return {
        signature: Array.from(signedMessage.signature),
        publicKey: signedMessage.publicKey.toString(),
      };
    } catch (error) {
      console.error("Failed to sign message:", error);
      throw error;
    }
  };

  const value = {
    phantom,
    connected,
    publicKey,
    connecting,
    connectWallet,
    disconnectWallet,
    signMessage,
    isInstalled: !!phantom,
  };

  return <PhantomWalletContext.Provider value={value}>{children}</PhantomWalletContext.Provider>;
};
