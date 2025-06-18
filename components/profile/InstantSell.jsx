import { solanasollogo } from "@/app/Images";
import { updateBalanceChangeInQuickSellPortfolio } from "@/app/redux/holdingDataSlice/holdingData.slice";
import { calculateRecAmountSolToAnytoken } from "@/utils/calculation";
import { sellSolanaTokensFromPortfolio } from "@/utils/solanaBuySell/solanaBuySell";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaPersonFalling } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoWarningSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const InstantSell = ({ tokenData, index, setIsOpen }) => {
  const [percentage, setPercentage] = useState(100);
  const [isTyping, setIsTyping] = useState(false);
  const [isMoreAmount, setIsMoreAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  const [priorityFees, setPriorityFees] = useState();
  const presist = useSelector((state) => state?.AllStatesData?.presetActive);

  const [amount, setAmount] = useState(() => {
    return tokenData?.chainBalance;
  });

  const handleSell = async (token) => {
    await sellSolanaTokensFromPortfolio(
      token?.token,
      +Number(amount).toFixed(token?.decimals),
      priorityFees?.slippage,
      priorityFees?.priorityFee,
      solWalletAddress,
      token?.decimals,
      Number(token?.current_price),
      setIsLoading,
      token?.programAddress,
      dispatch,
      calculateRecAmountSolToAnytoken(
        Number(amount),
        Number(token?.current_price),
        Number(solanaLivePrice)
      ),
      +Number(solanaLivePrice).toFixed(9),
      {
        name: token?.name,
        symbol: token?.symbol,
        img: token?.img,
      },
      percentage == 100
    )
      .then(() => {
        if (percentage != 100) {
          dispatch(
            updateBalanceChangeInQuickSellPortfolio({
              index,
              qty: +Number(Number(tokenData?.chainBalance) - Number(amount)).toFixed(token?.decimals),
            })
          );
        }
        setPercentage(100);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log("🚀 ~ ).then ~ err:", err?.message);
      });
  };

  useEffect(() => {
    if (tokenData && percentage > 0 && !isTyping) {
      const calculatedAmount =
        (Number(tokenData?.chainBalance) * percentage) / 100;
      setAmount(calculatedAmount);
    }
  }, [percentage, amount]);

  useEffect(() => {
    if (presist) {
      let preSetFromLocalStorage = JSON.parse(
        localStorage.getItem("preSetAllData")
      );
      setPriorityFees(preSetFromLocalStorage[presist].sell);
    }
  }, [presist]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(false);
          }}
          className="fixed inset-0 bg-[#1E1E1ECC] bg-opacity-80 flex items-center justify-center z-50 "
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black  border border-[#2A2A2A]  rounded-md w-[500px] relative"
          >
            {/* Header */}
            <div className="py-3 px-4 border-b border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-[#FFFFFF] text-lg font-semibold">
                    Sell
                  </div>
                </div>
                <IoMdClose
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                  className="text-[#6E6E6E] hover:text-white cursor-pointer transition duration-200"
                />
              </div>
            </div>

            <div className="py-4">
              <div className="p-4">
                <div>
                  <div className="text-[#FFFFFF] text-sm mb-2">
                    Amount to Sell
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A]  rounded-md px-3 py-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={+Number(amount).toFixed(5)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!/^\d*\.?\d*$/.test(val)) return;
                          setAmount(val);
                          setIsTyping(true);
                          const parsed = parseFloat(val);
                          const isTooMuch = parsed > amount;
                          setIsMoreAmount(isTooMuch);
                          if (!isNaN(parsed) && amount > 0) {
                            const calculatedPercentage = Math.min(
                              100,
                              (parsed / amount) * 100
                            );
                            setPercentage(Math.round(calculatedPercentage));
                          } else {
                            setPercentage(0);
                          }
                        }}
                        className="bg-transparent text-white text-sm flex-1 outline-none"
                        placeholder="0.0"
                      />
                      <Image
                        src={solanasollogo}
                        alt="Token Logo"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2">
                      <span className="text-white text-sm">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-red-500">
                    {isMoreAmount &&
                      "Amount entered is more than your available funds"}
                  </div>
                </div>

                {/* Percentage Slider */}
                <div className="py-3">
                  <div className="relative w-full">
                    {/* Track */}
                    <div className="w-full h-1 bg-[#2A2A2A] rounded-full">
                      {/* Filled Progress Bar */}
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-100"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    {/* Range Input (with custom thumb via Tailwind & WebKit styling) */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={percentage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setPercentage(value);
                        setIsTyping(false);
                        setIsMoreAmount(false);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Custom Dot (Thumb) */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded-full pointer-events-none transition-all duration-100"
                      style={{ left: `calc(${percentage}% - 8px)` }} // 8px = half of dot width
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#6E6E6E] pt-3">
                    <span
                      onClick={() => setPercentage(0)}
                      className={`${percentage == 0 && "text-white"
                        } hover:text-white`}
                    >
                      0%
                    </span>
                    <span
                      onClick={() => setPercentage(25)}
                      className={`${percentage == 25 && "text-white"
                        } hover:text-white`}
                    >
                      25%
                    </span>
                    <span
                      onClick={() => setPercentage(50)}
                      className={`${percentage == 50 && "text-white"
                        } hover:text-white`}
                    >
                      50%
                    </span>
                    <span
                      onClick={() => setPercentage(75)}
                      className={`${percentage == 75 && "text-white"
                        } hover:text-white`}
                    >
                      75%
                    </span>
                    <span
                      onClick={() => setPercentage(100)}
                      className={`${percentage == 100 && "text-white"
                        } hover:text-white`}
                    >
                      100%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FaPersonFalling />
                    <div className="text-sm text-[#ffffff]">{`${priorityFees?.slippage}`}</div>
                  </div>

                  <div className="flex items-center gap-2 text-yellow-400">
                    <div className="text-sm">{`${priorityFees?.priorityFee}`}</div>
                    <IoWarningSharp />
                  </div>
                </div>
              </div>

              <div className="border-t border-t-[#2A2A2A]"></div>
              <div className="py-2 px-4">
                {isLoading ? (
                  <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b]   mt-4 overflow-x-hidden   text-white font-semibold py-2 rounded-full transition-all duration-200 text-sm">
                    selling...
                  </button>
                ) : (
                  <button
                    onClick={() => handleSell(tokenData)}
                    disabled={
                      !amount || parseFloat(amount) <= 0 || isMoreAmount
                    }
                    className="w-full bg-[#b91c1c] hover:bg-[#991b1b] disabled:bg-[#4A4A4A] mt-4 overflow-x-hidden disabled:text-[#6E6E6E] text-white font-semibold py-2 rounded-full transition-all duration-200 text-sm"
                  >
                    Instantly sell $
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default InstantSell;
