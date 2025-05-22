"use client";
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { GrCaretUp, GrCaretDown } from "react-icons/gr";
import { PiPencilLineBold } from "react-icons/pi";
import {
  buySolanaTokens,
  sellSolanaTokens,
} from "@/utils/solanaBuySell/solanaBuySell";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Solana, solana } from "@/app/Images";

const TradingPopup = ({
  tragindViewPage,
  activeTab,
  setActiveTab,
  token,
  walletAddress,
  setTokenBalance,
  tokenBalance,
  tokenName,
  nativeTokenbalance,
  decimal,
  price,
  progranAddress,
  bondingProgress,
  dispatch,
}) => {
  const [loaderSwap, setLoaderSwap] = useState(false);
  const [isAdvancedSetting, setIsAdvancedSetting] = useState(false);
  const [quantity, setQuantity] = useState(0.1);
  const [slippage, setSlippage] = useState(20);
  const [priorityFee, setPriorityFee] = useState(0.0001);
  const [isMev, setIsMev] = useState(true);
  const [isAutoApprove, setisAutoApprove] = useState(false);

  useEffect(() => {
    if (activeTab == "sell") {
      setQuantity(tokenBalance);
    }
  }, [tokenBalance, activeTab]);
  const tokenImage = useSelector(
    (state) => state?.AllStatesData?.chartSymbolImage
  );
  // handle priority fee
  const handlepriorityFeeChange = (value) => {
    if (!value) {
      setPriorityFee("");
      return;
    }

    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setPriorityFee(numericValue);
    }
  };
  // handle quantity fee
  const handleQuantityChange = (value) => {
    if (!value) {
      setQuantity("");
      return;
    }
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setQuantity(numericValue);
    }
  };
  // handle slippage fee
  const handleSlippage = (value) => {
    if (!value) {
      setSlippage("");
      return;
    }
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setSlippage(Math.min(numericValue, 100));
    }
  };
  async function buyHandler() {
    if (walletAddress) {
      if (quantity < nativeTokenbalance) {
        buySolanaTokens(
          token,
          quantity,
          slippage,
          priorityFee,
          walletAddress,
          setLoaderSwap,
          setTokenBalance,
          bondingProgress >= 100 ? "djasodnasuodhasoduashd" : progranAddress,
          dispatch
        );
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      toast.error("Please login.");
    }
    // toast(
    //   (t) => (
    //     <div className="flex items-center gap-5">
    //       <div class="loaderPopup"></div>
    //       <div className="text-white text-sm">Attempting transaction</div>
    //     </div>
    //   ),
    //   {
    //     duration: Infinity,
    //     position: "top-center",
    //     style: {
    //       border: "1px solid #4D4D4D",
    //       color: "#FFFFFF",
    //       fontSize: "14px",
    //       letterSpacing: "1px",
    //       backgroundColor: "#1F1F1F",
    //     },
    //   }
    // );
  }
  async function sellHandler() {
    if (walletAddress) {
      if (quantity <= tokenBalance) {
        sellSolanaTokens(
          token,
          quantity,
          slippage,
          priorityFee,
          walletAddress,
          decimal,
          price,
          setLoaderSwap,
          setTokenBalance,
          bondingProgress >= 100 ? "djasodnasuodhasoduashd" : progranAddress,
          dispatch
        );
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      toast.error("Please login.");
    }

    // toast.dismiss();
  }

  return (
    <div className="bg-[#08080E] flex flex-col h-fit w-full text-white xl:p-4 md:p-3">
      {/* Buy/Sell Toggle */}
      <div className="flex h-[42px] items-center bg-[#1f1f1f] md:rounded-[8px] mb-[16px] ">
        <button
          className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-500 outline-none ${
            activeTab === "buy"
              ? "bg-[#1F73FC] text-[#F6F6F6]"
              : "bg-transparent text-[#6E6E6E]"
          }`}
          onClick={() => {
            setActiveTab("buy");
            setQuantity(0.1);
          }}
        >
          {tragindViewPage?.right?.buysell?.buy}
        </button>
        <button
          className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-300 ${
            activeTab === "sell"
              ? "bg-[#ED1B24] text-[#F6F6F6]"
              : "bg-transparent text-[#6E6E6E]"
          }`}
          onClick={() => {
            setActiveTab("sell");
          }}
        >
          {tragindViewPage?.right?.buysell?.sell}
        </button>
      </div>
      {/* Quantity Input */}
      <div className="bg-transparent rounded-[8px] flex items-center justify-between border-t-[0.5px] border-t-[#4D4D4D] mb-[8px]">
        <h1 className="text-[#A8A8A8] rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center whitespace-nowrap">
          {tragindViewPage?.right?.buysell?.qty}
        </h1>
        <input
          type="number"
          className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
        />
        <div className="px-4">
          {activeTab === "buy" ? (
            <Image
              src={solana}
              width={20}
              height={20}
              alt="solana"
              className="w-[35px] h-[20px] rounded-full bg-cover"
            />
          ) : (
            <img
              src={tokenImage || Solana}
              alt="Token Image"
              className="w-[35px] h-[20px]"
            />
          )}
        </div>
      </div>

      {/* Preset Quantity Buttons */}
      <div className="flex gap-2 mb-[16px]">
        {activeTab == "buy"
          ? [0.1, 0.2, 1, 2].map((val) => (
              <button
                key={val}
                className={`w-[62px] h-[34px] flex text-[14px] items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 ${
                  quantity === val
                    ? "text-[#278BFE] border-t-[1px] border-t-[#278BFE]"
                    : "text-[#FFFFFF] border-t-[0.5px] border-t-[#4D4D4D]"
                }`}
                onClick={() => setQuantity(val)}
              >
                {val}
              </button>
            ))
          : [20, 50, 80, 100].map((val) => (
              <button
                key={val}
                className={`w-[62px] h-[34px] flex text-[14px] items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 ${
                  Number(quantity).toFixed(5) ==
                    Number((tokenBalance * val) / 100).toFixed(5) &&
                  quantity > 0
                    ? "text-[#ed1819] border-t-[1px] border-t-[#ed1819]"
                    : "text-[#FFFFFF] border-t-[0.5px] border-t-[#4D4D4D]"
                }`}
                onClick={() => {
                  if (val == 100) {
                    setQuantity(tokenBalance);
                  } else {
                    setQuantity(Number((tokenBalance * val) / 100).toFixed(5));
                  }
                }}
              >
                {val}%
              </button>
            ))}
        <button className="p-2 rounded-md">
          <PiPencilLineBold />
        </button>
      </div>

      {/* Advanced Settings */}
      <div className="mb-[16px]">
        <div
          onClick={() => setIsAdvancedSetting(!isAdvancedSetting)}
          className={`flex cursor-pointer items-center justify-between ${
            isAdvancedSetting && "mb-[16px]"
          }`}
        >
          <div className={`flex items-center gap-[8px] $`}>
            <FaCog className="text-[16px]" />
            <h1 className="text-[#F6F6F6] text-[12px] font-[400]">
              {
                tragindViewPage?.right?.buysell?.advancedsettings
                  ?.advancedsettings
              }
            </h1>
          </div>
          <h1 className="ease-in-out duration-300">
            <MdOutlineKeyboardArrowRight
              className={`ease-in-out duration-300 text-[19px] ${
                isAdvancedSetting && "rotate-90"
              }`}
            />
          </h1>
        </div>
        <div
          className={`transform transition-all duration-300 ease-in-out origin-top overflow-hidden ${
            isAdvancedSetting
              ? "max-h-[1000px] opacity-100 scale-y-100"
              : "max-h-0 opacity-0 scale-y-0"
          }`}
        >
          <div className="bg-transparent rounded-[8px] flex items-center justify-between border-t-[0.5px] border-t-[#4D4D4D] mb-[16px]">
            <h1 className="text-[#A8A8A8] select-none rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center">
              {tragindViewPage?.right?.buysell?.advancedsettings?.slippage}
            </h1>
            <input
              type="number"
              className="bg-transparent p-[11px] text-start w-full text-white outline-none text-[14px] h-[40px] 
             [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
              value={slippage}
              onChange={(e) => handleSlippage(e?.target?.value)}
            />
            <div className="flex flex-col px-3">
              <GrCaretUp
                className="text-[11px] cursor-pointer"
                onClick={() => setSlippage(slippage + 1)}
              />
              <GrCaretDown
                className="text-[11px] cursor-pointer"
                onClick={() => setSlippage(slippage - 1)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-[16px]">
            {/* MEV */}
            <div className="flex items-center gap-[8px]">
              <div
                onClick={() => setIsMev(!isMev)}
                className={`flex ${
                  isMev
                    ? `${activeTab == "buy" ? "bg-[#278BFE]" : "bg-[#ed1819]"}`
                    : "bg-[#4D4D4D]"
                } w-[36px] h-[20px] items-center cursor-pointer pl-[3px] rounded-[1000px] transition-all duration-300`}
              >
                <div
                  className={`w-[12px] h-[12px] bg-white rounded-full shadow-md transform transition-all duration-300 
      ${isMev ? "translate-x-[18px]" : "translate-x-0 "}`}
                />
              </div>
              <h1 className="text-[#F6F6F6] text-[14px] font-[400]">
                Mev Prot.
              </h1>
            </div>
            {/* Auto approve */}
            <div className="flex items-center gap-[8px]">
              <div
                onClick={() => setisAutoApprove(!isAutoApprove)}
                className={`flex ${
                  isAutoApprove
                    ? `${activeTab == "buy" ? "bg-[#278BFE]" : "bg-[#ed1819]"}`
                    : "bg-[#4D4D4D]"
                } w-[36px] h-[20px] items-center cursor-pointer pl-[3px] rounded-[1000px] transition-all duration-300`}
              >
                <div
                  className={`w-[12px] h-[12px] bg-white rounded-full shadow-md transform transition-all duration-300 
      ${isAutoApprove ? "translate-x-[18px]" : "translate-x-0 "}`}
                />
              </div>
              <h1 className="text-[#F6F6F6] text-[14px] font-[400]">
                {tragindViewPage?.right?.buysell?.advancedsettings?.autoapprove}
              </h1>
            </div>
          </div>

          <div className="bg-transparent rounded-[8px] flex items-center justify-between border-t-[0.5px] border-t-[#4D4D4D] mb-[16px]">
            <h1 className="text-[#A8A8A8] select-none rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center whitespace-nowrap">
              {tragindViewPage?.right?.buysell?.advancedsettings?.priority}
            </h1>

            <input
              type="number"
              className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
              value={priorityFee}
              onChange={(e) => handlepriorityFeeChange(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            {[
              {
                type: tragindViewPage?.right?.buysell?.advancedsettings
                  ?.deafult,
                value: 0.001,
              },
              { type: "2x", value: 0.001 * 2 },
              { type: "3x", value: 0.001 * 3 },
            ].map((val) => (
              <button
                key={val?.type}
                className={`w-[96px] h-[34px] text-[14px] flex items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 ${
                  priorityFee == val?.value
                    ? `border-t-[1px] border-t-[#278BFE] ${
                        activeTab == "buy"
                          ? "text-[#278BFE] border-t-[#278BFE]"
                          : "text-[#ed1819] border-t-[#ed1819]"
                      }`
                    : "text-[#FFFFFF] border-t-[0.5px] border-t-[#4D4D4D]"
                }`}
                onClick={() => setPriorityFee(val?.value)}
              >
                {val?.type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Buy/Sell Button */}
      {activeTab === "buy" ? (
        loaderSwap ? (
          <button
            className={`bg-[#2A7FF0] hover:bg-[#3f8cf1] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
          >
            {`Buying ${tokenName}...`}
          </button>
        ) : (
          <button
            onClick={() => buyHandler()}
            className={`bg-[#2A7FF0] hover:bg-[#3f8cf1] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
          >
            {`${tragindViewPage?.right?.buysell?.btnbuy} ${tokenName}`}
          </button>
        )
      ) : loaderSwap ? (
        <button
          className={`bg-[#ED1B24] hover:bg-[#ff323d] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
        >
          {`Selling ${tokenName}...`}
        </button>
      ) : (
        <button
          onClick={() => sellHandler()}
          className={`bg-[#ED1B24] hover:bg-[#ff323d] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
        >
          {`${tragindViewPage?.right?.buysell?.btnsell} ${tokenName}`}
        </button>
      )}
    </div>
  );
};

export default TradingPopup;
