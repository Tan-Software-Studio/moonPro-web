import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, X, ArrowUpDown } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { Solana, usdc } from "@/app/Images";
import { useSelector } from "react-redux";
import { BiCheckDouble } from "react-icons/bi";
import { getSoalanaTokenBalance } from "@/utils/solanaNativeBalance";
import { convertSOLtoUSDC, convertUSDCtoSOL,  } from "@/utils/solanaBuySell/solanaBuySell";

const ExchangePopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Deposit");
  const [copied, setCopied] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("0.0");
  const [isSwapped, setIsSwapped] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance);
  const solWalletAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);
  const depositAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);
  const solanaLivePrice = useSelector((state) => state?.AllStatesData?.solanaLivePrice);
  const usdcLivePrice = useSelector((state) => state?.AllStatesData?.usdcLivePrice);
  const dispatch = useSelector((state) => state?.dispatch);

  const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (solWalletAddress) {
        const balance = await getSoalanaTokenBalance(solWalletAddress, USDC_MINT_ADDRESS);
        setUsdcBalance(balance);
      }
    };

    fetchUsdcBalance();
  }, [solWalletAddress]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvertAmountChange = (value) => {
    const numValue = parseFloat(value) || 0;

    const maxBalance = isSwapped ? usdcBalance : nativeTokenbalance;
    if (numValue > maxBalance) {
      return;
    }

    setConvertAmount(value);

    if (isSwapped) {
      const solPrice = solanaLivePrice || 174.21;
      setReceiveAmount((numValue / solPrice).toFixed(6));
    } else {
      const solPrice = solanaLivePrice || 174.21;
      setReceiveAmount((numValue * solPrice).toFixed(2));
    }
  };

  const handleReceiveAmountChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setReceiveAmount(value);

    if (isSwapped) {
      const solPrice = solanaLivePrice || 174.21;
      const convertValue = numValue * solPrice;
      if (convertValue > usdcBalance) {
        return;
      }
      setConvertAmount(convertValue.toFixed(2));
    } else {
      const solPrice = solanaLivePrice || 174.21;
      const convertValue = numValue / solPrice;
      if (convertValue > nativeTokenbalance) {
        return;
      }
      setConvertAmount(convertValue.toFixed(6));
    }
  };

  const handleSwapTokens = () => {
    setIsSwapped(!isSwapped);
    setConvertAmount("");
    setReceiveAmount("");
  };

  const handleConfirmConvert = async () => {
    if (!convertAmount || parseFloat(convertAmount) <= 0) return;

    setIsLoading(true);

    try {
      if (isSwapped) {
        // USDC to SOL - This is a SELL operation (selling USDC for SOL)
        await convertUSDCtoSOL(
          parseFloat(convertAmount),
          parseFloat(receiveAmount),
          50,
          0.0001,
          usdcLivePrice || 1,
          solWalletAddress,
          setIsLoading,
          setUsdcBalance,
          dispatch
        );
      } else {
        // SOL to USDC - This is a BUY operation (buying USDC with SOL)
        await convertSOLtoUSDC(
          parseFloat(convertAmount),
          50,
          0.0001,
          solanaLivePrice || 174.21,
          usdcLivePrice || 1,
          solWalletAddress,
          setIsLoading,
          setUsdcBalance,
          dispatch
        );
      }

      // Reset form after successful transaction
      setConvertAmount("");
      setReceiveAmount("");
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const fromToken = isSwapped ? "USDC" : "SOL";
  const toToken = isSwapped ? "SOL" : "USDC";
  const fromBalance = isSwapped ? usdcBalance : nativeTokenbalance;
  const toBalance = isSwapped ? nativeTokenbalance : usdcBalance;
  const solPrice = solanaLivePrice || 174.21;
  const rateText = isSwapped ? `1 USDC ≈ ${(1 / solPrice).toFixed(6)} SOL` : `1 SOL = ${solPrice} USDC`;

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
        className="LanguagePopup-lg max-w-sm sm:w-[90%] w-full bg-[#08080E] rounded-md !z-[999999999999999]"
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

          <div className="h-[400px] flex flex-col">
            {/* Convert Tab */}
            {activeTab === "Convert" && (
              <div className="flex flex-col h-full">
                <div className="text-[#A8A8A8] text-sm mb-4">
                  {isSwapped
                    ? "Exchange USDC for SOL on Solana. Transaction fees apply."
                    : "Exchange SOL for USDC on Solana. The minimum deposit is 6 USDC equivalent."}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8A8A8] text-sm">Converting</span>
                    <span className="text-white text-sm">
                      Balance: <span className="text-blue-500">{Number(fromBalance || 0).toFixed(3)}</span>
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => handleConvertAmountChange(e.target.value)}
                        max={fromBalance}
                        className="bg-transparent text-white text-xl font-medium outline-none flex-1"
                        placeholder="0.0"
                      />
                      <div className="flex items-center gap-2">
                        {isSwapped ? (
                          <>
                            <Image src={usdc} alt="usdc" height={20} width={20} className="rounded-full" />
                            <span className="text-white font-medium">USDC</span>
                          </>
                        ) : (
                          <>
                            <Image src={Solana} alt="solana" height={20} width={20} className="rounded-full" />
                            <span className="text-white font-medium">SOL</span>
                          </>
                        )}
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
                      Balance: <span className="text-blue-500">{Number(toBalance || 0).toFixed(3)}</span>
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
                        {isSwapped ? (
                          <>
                            <Image src={Solana} alt="solana" height={20} width={20} className="rounded-full" />
                            <span className="text-white font-medium">SOL</span>
                          </>
                        ) : (
                          <>
                            <Image src={usdc} alt="usdc" height={20} width={20} className="rounded-full" />
                            <span className="text-white font-medium">USDC</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[#A8A8A8] text-xs mt-1">{rateText}</div>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={handleConfirmConvert}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-sm text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!convertAmount || parseFloat(convertAmount) <= 0 || isLoading}
                  >
                    {isLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            )}

            {/* Deposit Tab */}
            {activeTab === "Deposit" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Image src={Solana} alt="solana" height={20} width={20} className="rounded-full" />
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
                  <button className="text-blue-500 hover:text-blue-400 text-sm underline">Buy through Wavepro</button>
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src={Solana} alt="solana" height={20} width={20} className="rounded-full" />
                    <span className="text-white text-sm">Solana</span>
                  </div>
                  <span className="text-white text-sm">
                    Balance: <span className="text-blue-500">{Number(nativeTokenbalance || 0).toFixed(3)} SOL</span>
                  </span>
                </div>

                <div className="mb-6 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8A8A8] text-sm">Buying</span>
                    <span className="text-white text-sm">
                      SOL Price: <span className="text-green-400">{solPrice.toFixed(2)}</span>
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
                        <Image src={Solana} alt="solana" height={24} width={24} className="rounded-full" />
                        <span className="text-white font-medium">SOL</span>
                      </div>
                    </div>
                    <div className="text-right text-[#A8A8A8] text-sm">
                      ≈ {(parseFloat(buyAmount) * solPrice || 0).toFixed(2)} USD
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-[#A8A8A8] text-sm">powered by </span>
                    <span className="text-blue-500 font-medium text-sm">wavepro</span>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-sm text-white transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    disabled
                  >
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
