import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, X, ArrowUpDown } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { walletBalance } from "@/app/Images";
import { useSelector } from "react-redux";
import { BiCheckDouble } from "react-icons/bi";

const ExchangePopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Deposit");
  const [copied, setCopied] = useState(false);
  const [convertAmount, setConvertAmount] = useState("0.0");
  const [receiveAmount, setReceiveAmount] = useState("0.0");
  const [buyAmount, setBuyAmount] = useState("0.0");

  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance);

  const depositAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);

  // Mock exchange rate (1 SOL = 174.21 USDC)
  const solToUsdcRate = 174.21;
  const usdcBalance = 0; // Mock USDC balance

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvertAmountChange = (value) => {
    setConvertAmount(value);
    const numValue = parseFloat(value) || 0;
    setReceiveAmount((numValue * solToUsdcRate).toFixed(2));
  };

  const handleReceiveAmountChange = (value) => {
    setReceiveAmount(value);
    const numValue = parseFloat(value) || 0;
    setConvertAmount((numValue / solToUsdcRate).toFixed(6));
  };

  const handleSwapTokens = () => {
    // Logic to swap between SOL and USDC would go here
    const tempAmount = convertAmount;
    setConvertAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

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
        className="LanguagePopup-lg max-w-sm sm:w-[90%]  w-full bg-[#08080E] rounded-md !z-[999999999999999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between sm:p-4 p-3 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Exchange</h2>
          <button onClick={() => onClose()} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Container */}
        <div className="p-4">
          <div className="bg-[#1A1A1A] rounded-lg p-1 flex mb-4">
            {["Convert", "Deposit", "Buy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab ? "text-white bg-[#2A2A2A]" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Fixed height content container */}
          <div className="h-[400px] flex flex-col">
            {/* Convert Tab */}
            {activeTab === "Convert" && (
              <div className="flex flex-col h-full">
                <div className="text-[#A8A8A8] text-sm mb-4">
                  Exchange Native Solana for USDC on Hyperliquid. The minimum deposit is 6 USDC.
                </div>

                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8A8A8] text-sm">Converting</span>
                    <span className="text-white text-sm">
                      Balance: <span className="text-blue-500">{Number(nativeTokenbalance || 0).toFixed(3)}</span>
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => handleConvertAmountChange(e.target.value)}
                        className="bg-transparent text-white text-xl font-medium outline-none flex-1"
                        placeholder="0.0"
                      />
                      <div className="flex items-center gap-2">
                        <Image src={walletBalance} alt="solana" height={20} width={20} className="rounded-full" />
                        <span className="text-white font-medium">SOL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center my-4">
                  <button
                    onClick={handleSwapTokens}
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2 rounded-full transition-colors"
                  >
                    <ArrowUpDown size={16} className="text-white" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8A8A8] text-sm">Gaining</span>
                    <span className="text-white text-sm">
                      Balance: <span className="text-blue-500">{usdcBalance}</span>
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={receiveAmount}
                        onChange={(e) => handleReceiveAmountChange(e.target.value)}
                        className="bg-transparent text-white text-xl font-medium outline-none flex-1"
                        placeholder="0.0"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">$</span>
                        </div>
                        <span className="text-white font-medium">USDC</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[#A8A8A8] text-xs mt-1">1 SOL = {solToUsdcRate} USDC</div>
                </div>

                <div className="mt-auto">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-sm text-white transition-colors">
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* Deposit Tab */}
            {activeTab === "Deposit" && (
              <div className="flex flex-col h-full">
                {/* Token info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Image src={walletBalance} alt="solana" height={20} width={20} className="rounded-full" />
                    <span className="text-white text-sm">Solana</span>
                  </div>
                  <span className="text-white text-sm">
                    Balance: <span className="text-blue-500">{Number(nativeTokenbalance || 0).toFixed(3)} SOL</span>
                  </span>
                </div>

                {/* Warning text */}
                <div className="text-[#A8A8A8] text-sm mb-4">
                  Only deposit SOL through the Solana network for this address.
                </div>

                {/* QR code and address */}
                <div className="bg-[#08080E] hover:bg-[#1E1E1ECC] rounded-lg p-4 cursor-pointer border-gray-800 px-2 py-2 mb-4 flex-1 ">
                  <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-lg w-32 h-32 flex items-center justify-center flex-shrink-0">
                      <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={depositAddress}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[#A8A8A8] text-sm mb-2">Deposit Address</p>
                        <p className="text-white text-sm break-all font-mono leading-tight">{depositAddress}</p>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={handleCopyAddress} className="text-gray-400 hover:text-white p-1">
                          {copied ? <BiCheckDouble size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-[#A8A8A8] text-sm">Don&apos;t have any Solana? </span>
                  <button className="text-blue-500 hover:text-blue-400 text-sm underline">Buy through Coinbase</button>
                </div>

                <div className="sm:px-4 px-3 pb-4 pt-2 ">
                  <button
                    onClick={handleCopyAddress}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-sm text-white transition-colors"
                  >
                    {copied ? "Address Copied!" : "Copy Address"}
                  </button>
                </div>
              </div>
            )}

            {/* Buy Tab */}
            {activeTab === "Buy" && (
              <div className="flex flex-col h-full">
                {/* Token info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src={walletBalance} alt="solana" height={20} width={20} className="rounded-full" />
                    <span className="text-white text-sm">Solana</span>
                  </div>
                  <span className="text-white text-sm">
                    Balance: <span className="text-blue-500">{Number(nativeTokenbalance || 0).toFixed(3)} SOL</span>
                  </span>
                </div>

                {/* Buying Section */}
                <div className="mb-6 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8A8A8] text-sm">Buying</span>
                    <span className="text-white text-sm">
                      SOL Price: <span className="text-green-400">174.22</span>
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="bg-transparent text-white text-3xl font-medium outline-none w-full"
                        placeholder="0.0"
                      />
                      <div className="flex items-center gap-2 ml-4">
                        <Image src={walletBalance} alt="solana" height={24} width={24} className="rounded-full" />
                        <span className="text-white font-medium">SOL</span>
                      </div>
                    </div>
                    <div className="text-right text-[#A8A8A8] text-sm">
                      ≈ {(parseFloat(buyAmount) * solToUsdcRate || 0).toFixed(2)} USD
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Powered by Coinbase */}
                  <div className="text-center mb-4">
                    <span className="text-[#A8A8A8] text-sm">powered by </span>
                    <span className="text-blue-500 font-medium text-sm">coinbase</span>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-sm text-white transition-colors">
                    Buy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExchangePopup;
