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
  const [isMobile, setIsMobile] = useState(false);
  const [isInPhantomBrowser, setIsInPhantomBrowser] = useState(false);

  useEffect(() => {
    const detectMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const detectPhantomBrowser = () => {
      if (typeof window === "undefined") return false;

      const userAgent = navigator.userAgent.toLowerCase();
      const isPhantomUserAgent = userAgent.includes("phantom") || userAgent.includes("phantombrowser");

      const hasPhantomWallet = window.phantom && window.phantom.isPhantom;

      const hasPhantomProps = window.phantom && window.phantom.solana;

      return isPhantomUserAgent || (hasPhantomWallet && hasPhantomProps);
    };

    setIsMobile(detectMobile());
    setIsInPhantomBrowser(detectPhantomBrowser());

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
      provider.on("connect", (publicKey) => {
        setConnected(true);
        setPublicKey(publicKey.toString());
      });

      provider.on("disconnect", () => {
        setConnected(false);
        setPublicKey(null);
      });

      // Check if already connected
      provider
        .connect({ onlyIfTrusted: true })
        .then((response) => {
          setConnected(true);
          setPublicKey(response.publicKey.toString());
        })
        .catch(() => {
          // User not previously connected
        });
    }
  }, []);

  const isPhantomAvailable = () => {
    if (isMobile) {
      return isInPhantomBrowser;
    }
    return !!phantom;
  };

  const connectWallet = async () => {
    if (isMobile && !isInPhantomBrowser) {
      return {
        success: false,
        error: "You must use the Phantom browser to sign in on mobile with Phantom",
        needsPhantomBrowser: true,
        redirectUrl: generatePhantomDeepLink(),
      };
    }

    if (!phantom) {
      return {
        success: false,
        error: "Phantom wallet not available. Please install Phantom wallet.",
        needsInstall: true,
      };
    }

    try {
      setConnecting(true);

      const response = await phantom.connect();

      if (response && response.publicKey) {
        setConnected(true);
        setPublicKey(response.publicKey.toString());

        return {
          success: true,
          publicKey: response.publicKey.toString(),
          phantomInstance: phantom,
        };
      } else {
        throw new Error("No response from wallet");
      }
    } catch (error) {
      console.error("Failed to connect to Phantom:", error);
      return { success: false, error: error.message };
    } finally {
      setConnecting(false);
    }
  };

  const generatePhantomDeepLink = () => {
    const currentUrl = window.location.href;
    return `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=https://phantom.app`;
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

  const signMessage = async (message, phantomInstance = null) => {
    const walletToUse = phantomInstance || phantom;

    if (!walletToUse) {
      throw new Error("Wallet not available");
    }

    if (!walletToUse.isConnected && !connected) {
      throw new Error("Wallet not connected");
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await walletToUse.signMessage(encodedMessage, "utf8");
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
    isInstalled: isPhantomAvailable(),
    isMobile,
    isInPhantomBrowser,
    generatePhantomDeepLink,
  };

  return <PhantomWalletContext.Provider value={value}>{children}</PhantomWalletContext.Provider>;
};
