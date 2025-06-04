"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  subscribeToWalletTracker,
  unsubscribeFromWalletTracker,
} from "@/websocket/walletTracker";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";

function AddWalletModal({
  wallettrackerPage,
  walletData,
  isOpen,
  onClose,
  onAddWallet,
  solAddress,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const [wallet, setWallet] = useState({
    name: "",
    address: "",
  });

  const isValidSolanaAddress = (address) => {
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    return isSolanaAddress;
  };

  // Handle input change
  const handleChange = (e) => {
    setWallet({
      ...wallet,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!wallet.name || !wallet.address) {
      return showToaster("Please fill all fields.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }

    // ✅ Check if wallet already exists in walletData
    const isAddressExists = walletData.some(
      (item) => item.walletAddress === wallet.address.trim()
    );

    if (isAddressExists) {
      return showToaster("This Wallet Address is already added.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }

    // ✅ Validate Solana Address
    if (!isValidSolanaAddress(wallet.address)) {
      return showToaster("Please enter a valid Solana Wallet Address.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }

    const userId = solAddress;

    // ✅ Ensure user and wallet addresses are different
    if (userId === wallet.address.trim()) {
      return showToaster("User and Wallet address must be different.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }

    const walletDataToSend = {
      walletAddress: wallet.address.trim(),
      chain: "Solana",
      walletName: wallet.name.trim(),
      alert: false,
      tag: [],
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.post(
        `${BASE_URL}wallettracker/walletTracking`,
        walletDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "🚀 ~ handleSubmit ~ response:",
        response?.data?.data?.addWallet
      );
      if (response.data?.success) {
        const newWallet = response.data.data?.addWallet;
        onAddWallet(newWallet);

        showToasterSuccess("Wallet added successfully.");

        setWallet({ name: "", address: "", chain: "Solana", tags: [] });
        onClose();
        await unsubscribeFromWalletTracker();
        await subscribeToWalletTracker(solAddress);
      } else {
        showToaster(response.data?.message || "Failed to add wallet.", {
          position: "top-center",
          style: { fontSize: "12px" },
        });
      }
    } catch (err) {
      console.error("🚀 ~ axios.post ~ err:", err?.message);
      showToaster("Failed to add wallet.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex p-2 justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0A0A0B] text-white rounded-lg w-[500px] shadow-lg border border-[#404040]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#404040] px-4 pt-4">
          <h2 className="text-[22px] font-bold">
            {wallettrackerPage?.addwallet}
          </h2>
          <button onClick={onClose} className="text-[#A8A8A8] text-xl">
            ×
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-4 px-4">
          <div className="relative border border-[#404040] rounded-md">
            <span className="absolute left-0 top-0 h-full flex items-center px-3 bg-[#1A1A1A] rounded-l-md text-white text-[12px] font-medium tracking-wider">
              {wallettrackerPage?.walletname}
            </span>
            <input
              type="text"
              name="name"
              value={wallet.name}
              maxLength={15}
              onChange={handleChange}
              className="w-full bg-transparent text-[12px] font-normal text-white p-3 pl-[120px] pr-3 rounded-md focus:outline-none placeholder:text-right text-left placeholder:text-[12px] placeholder:tracking-wider"
              placeholder="Enter wallet name"
            />
          </div>

          <div className="relative border border-[#404040] rounded-md">
            <span className="absolute left-0 top-0 h-full flex items-center px-3 bg-[#1A1A1A] rounded-l-md text-white text-[12px] font-medium tracking-wider">
              {wallettrackerPage?.walletaddress}
            </span>
            <input
              type="text"
              value={wallet.address}
              onChange={handleChange}
              name="address"
              className="w-full bg-transparent text-white font-normal p-3 pl-[120px] text-[12px] pr-3 rounded-md focus:outline-none placeholder:text-right text-left placeholder:text-[12px] placeholder:tracking-wider"
              placeholder="Enter wallet address"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-5 space-x-3 pb-4 px-4">
          <button
            onClick={onClose}
            className="border border-[#ED1B24] text-[#ED1B24] px-5 py-2 rounded-md hover:bg-[#ED1B24] hover:text-white transition"
          >
            {wallettrackerPage?.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!wallet.name || !wallet.address}
            className={`px-5 py-2 rounded-md text-white transition 
        ${
          wallet.name && wallet.address
            ? "bg-[#1F73FC] hover:bg-blue-600"
            : "bg-gray-500 cursor-not-allowed"
        }
    `}
          >
            {wallettrackerPage?.addwallet}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AddWalletModal;
