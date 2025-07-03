"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { solana } from "@/app/Images";
import axiosInstanceAuth from "@/apiInstance/axiosInstanceAuth";
import { showToaster } from "@/utils/toaster/toaster.style";

const WithdrawPopup = ({
  isOpen,
  onClose,
  balance = 0,
  tokenSymbol = "SOL",
  solanaLivePrice = 0,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isSubmittingRef = useRef(false);

  const handleMaxClick = () => {
    const smallAmtInSol = +(0.2 / Number(solanaLivePrice)).toFixed(9);
    if (Number(balance) <= smallAmtInSol) {
      return showToaster(
        `Minimum sol for withdraw is more then ${smallAmtInSol.toFixed(5)}`
      );
    }
    setWithdrawAmount(Number(balance));
    setReceiveAmount(+(Number(balance) - smallAmtInSol).toFixed(9));
  };

  const handleWithdrawAmountChange = (value) => {
    const numValue = Number(value) || 0;
    if (numValue > balance) {
      return;
    }
    const smallAmtInSol = +(0.2 / Number(solanaLivePrice)).toFixed(9);
    if (numValue + smallAmtInSol >= balance) {
      const finalAmtAfterMinusGas = +(numValue - smallAmtInSol).toFixed(9);
      if (finalAmtAfterMinusGas > 0) {
        setReceiveAmount(+(numValue - smallAmtInSol).toFixed(9));
      } else {
        setReceiveAmount(0);
      }
    } else {
      setReceiveAmount(numValue);
    }
    setWithdrawAmount(numValue);
    setError(""); // Clear error when user changes input
    setSuccess(false); // Clear success when user changes input
  };

  const handleReceiveAmountChange = (value) => {
    const numValue = Number(value) || 0;
    if (numValue > balance) {
      return;
    }
    const smallAmtInSol = +(0.2 / Number(solanaLivePrice)).toFixed(9);
    if (numValue + smallAmtInSol >= balance) {
      setReceiveAmount(+(numValue - smallAmtInSol).toFixed(9));
    } else {
      setReceiveAmount(numValue);
    }
    setWithdrawAmount(numValue);
    setError(""); // Clear error when user changes input
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current || isLoading || success) {
      return;
    }

    if (!destinationAddress) {
      setError("Please enter a valid destination address.");
      return;
    }

    const smallAmtInSol = +(0.2 / Number(solanaLivePrice)).toFixed(9);
    if (!receiveAmount || parseFloat(receiveAmount) <= 0) {
      return showToaster(
        `Minimum sol for withdraw is more then ${smallAmtInSol.toFixed(5)}`
      );
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        toWallet: destinationAddress,
        amount: receiveAmount,
      };

      const response = await axiosInstanceAuth.post(
        "/transactions/withrawSolUser",
        payload
      );

      // Handle successful response
      // console.log("Withdrawal successful:", response.data);

      // Show success message
      setSuccess(true);

      // Reset form after a delay to show success message
      setTimeout(() => {
        setWithdrawAmount("");
        setDestinationAddress("");
        setReceiveAmount("");
        setSuccess(false);
        isSubmittingRef.current = false;
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Withdrawal failed:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Withdrawal failed";
        setError(errorMessage);
      } else if (error.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const hasValidInputs =
    destinationAddress && withdrawAmount && parseFloat(withdrawAmount) > 0;
  const canSubmit =
    hasValidInputs && !isLoading && !success && !isSubmittingRef.current;

  const usdValue = (parseFloat(withdrawAmount) * solanaLivePrice || 0).toFixed(
    2
  );

  if (!isOpen) return null;

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClose()}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center !z-[999999999999999]"
    >
      <motion.div
        key="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="LanguagePopup-lg max-w-sm sm:w-[90%] w-full max-h-[90vh] bg-[#08080E] rounded-md !z-[999999999999999] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between sm:p-4 p-3 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Withdraw</h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-hidden">
          <div className="500px flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg py-2 px-3">
                <Image src={solana} width={16} height={16} alt="solana" />
                <span className="text-sm text-white">Solana</span>
              </div>
              <span className="text-white text-sm">
                Balance:{" "}
                <span className="text-blue-500">
                  {Number(balance || 0).toFixed(3)} {tokenSymbol}
                </span>
              </span>
            </div>
            <div className="text-[#A8A8A8] text-sm mb-4">
              Only withdraw {tokenSymbol} to Solana network addresses.
              Double-check the destination address.
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg">
                <p className="text-green-400 text-sm">
                  Withdrawal successful! Transaction is being processed.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#A8A8A8] text-sm">Withdraw Amount</span>
                <button
                  onClick={handleMaxClick}
                  className="text-blue-500 text-sm hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || success}
                >
                  Max
                </button>
              </div>
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => handleWithdrawAmountChange(e.target.value)}
                    max={balance}
                    disabled={isLoading || success}
                    className="bg-transparent text-white text-xl font-medium outline-none flex-1 disabled:opacity-50"
                    placeholder="0.0"
                  />
                  <div className="flex items-center gap-2">
                    <Image src={solana} width={16} height={16} alt="solana" />
                    <span className="text-white font-medium">
                      {tokenSymbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-[#A8A8A8] text-xs mt-1">
                ≈ ${usdValue} USD
              </div>
            </div>
            <div className="flex justify-center my-4">
              <div className="bg-[#2A2A2A] p-2 rounded-full">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg py-2 px-3">
                <Image src={solana} width={16} height={16} alt="solana" />
                <span className="text-sm text-white">Solana</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#A8A8A8] text-sm">Address</span>
                <span className="text-[#A8A8A8] text-xs">
                  Address of destination wallet
                </span>
              </div>
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  disabled={isLoading || success}
                  placeholder="Enter wallet address"
                  className="w-full bg-transparent text-white outline-none text-sm disabled:opacity-50"
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#A8A8A8] text-sm">Receive</span>
              </div>
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={receiveAmount}
                    disabled={true}
                    className="bg-transparent text-white text-xl font-medium outline-none flex-1 disabled:opacity-100 disabled:text-white"
                    placeholder="0.0"
                  />
                  <div className="flex items-center gap-2">
                    <Image src={solana} width={16} height={16} alt="solana" />
                    <span className="text-white font-medium">
                      {tokenSymbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-[#A8A8A8] text-xs mt-1">
                1 {tokenSymbol} = ${solanaLivePrice.toFixed(2)} USD
              </div>
            </div>
            <div className="mt-auto">
              {canSubmit && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-colors bg-[#1d73fc] hover:bg-[#438bff] text-black cursor-pointer"
                >
                  Confirm Withdrawal
                </button>
              )}

              {!canSubmit && (
                <button
                  disabled
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-colors cursor-not-allowed ${
                    success
                      ? "bg-green-600 text-white"
                      : isLoading || isSubmittingRef.current
                      ? "bg-blue-600 text-white cursor-wait"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {success
                    ? "✓ Withdrawal Successful!"
                    : isLoading || isSubmittingRef.current
                    ? "Processing..."
                    : !destinationAddress
                    ? "Enter Destination Address"
                    : "Enter Amount"}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawPopup;
