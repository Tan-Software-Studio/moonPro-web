"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaCog } from "react-icons/fa";
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
import { solana, solanaBlackLogo } from "@/app/Images";
import RightModalOpenSetting from "@/components/Settings/RightModalOpenSetting";
import {
  openCloseLoginRegPopup,
  setOpenOrderSetting,
  setPresetActive,
  setPreSetOrderSetting,
} from "@/app/redux/states";
const TradingPopup = ({
  tragindViewPage,
  activeTab,
  setActiveTab,
  token,
  walletAddress,
  setTokenBalance,
  tokenBalance,
  tokenName,
  tokenSymbol,
  tokenImage,
  nativeTokenbalance,
  decimal,
  price,
  progranAddress,
  bondingProgress,
  dispatch,
  solanaLivePrice,
  tredingPage,
  currentSupply
}) => {
  const [loaderSwap, setLoaderSwap] = useState(false);
  const [isAdvancedSetting, setIsAdvancedSetting] = useState(false);
  const [quantity, setQuantity] = useState(0.1);
  const [recQty, setRrcQty] = useState(0);
  const [slippage, setSlippage] = useState(20);
  const [priorityFee, setPriorityFee] = useState(0.0001);
  const [isMev, setIsMev] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [customInput, setCustomInput] = useState("");
  // const [presist, setPresist] = useState("P1");
  const [buyValues, setBuyValues] = useState(() => {
    const saved = localStorage.getItem("buyValues");
    return saved ? JSON.parse(saved) : [0.1, 0.2, 1, 2];
  });
  const [sellValues, setSellValues] = useState(() => {
    const saved = localStorage.getItem("sellValues");
    return saved ? JSON.parse(saved) : [20, 50, 80, 100];
  });
  // preset value
  const presist = useSelector((state) => state?.AllStatesData?.presetActive);
  // order settings flag
  const orderSettingFlag = useSelector(
    (state) => state?.AllStatesData?.openOrderSetting
  );
  const preSetData = useSelector(
    (state) => state?.AllStatesData?.preSetOrderSettings
  );
  const saveEditedValue = () => {
    const value = parseFloat(customInput);
    // if (value > 0) {
    if (activeTab === "buy") {
      const newValues = [...buyValues];
      newValues[editIndex] = value;
      setBuyValues(newValues);
      localStorage.setItem("buyValues", JSON.stringify(newValues));
    } else {
      const newValues = [...sellValues];
      newValues[editIndex] = value;
      setSellValues(newValues);
      localStorage.setItem("sellValues", JSON.stringify(newValues));
    }
    setIsEditing(false);
    setEditIndex(null);
    setCustomInput("");
    // }
  };
  // function to calculate rec. amount
  function calculateRecAmountSolToAnytoken(
    amountToken1,
    priceToken1,
    priceToken2
  ) {
    if (priceToken2 === 0) {
      throw new Error("Price of token 2 cannot be zero");
    }
    const usdValue = amountToken1 * priceToken1;
    const amountToken2 = usdValue / priceToken2;
    if (amountToken2 > 1) {
      setRrcQty(amountToken2.toFixed(2));
    } else {
      setRrcQty(amountToken2.toFixed(6));
    }
  }

  async function getChartUsdSolToggleActive() {
    const isUsdActive = await localStorage.getItem("chartUsdSolToggleActive");
    let usdActive = true;
    if (isUsdActive !== null) {
      usdActive = isUsdActive === "true";
    }
    return usdActive;
  }

  async function getChartMarketCapPriceToggleActive() {
    const isMarketCapActive = await localStorage.getItem("chartMarketCapPriceToggleActive");
    let marketCapActive = true;
    if (isMarketCapActive !== null) {
      marketCapActive = isMarketCapActive === "true";
    }
    return marketCapActive;
  }

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
  // update order settings
  function updateOrderSetting() {
    setSlippage(preSetData?.[presist]?.[activeTab]?.slippage);
    setPriorityFee(preSetData?.[presist]?.[activeTab]?.priorityFee);
    setIsMev(preSetData?.[presist]?.[activeTab]?.mev);
  }

  async function convertToUsdtoSolAndMC(price, isUsdActive, isMarketCapActive) {
    const supply = currentSupply ? currentSupply : 1_000_000_000;
    const solPrice = solanaLivePrice ? solanaLivePrice : 1;

    const atPrice = isUsdActive ? price : price / solPrice;
    const finalAtPrice = isMarketCapActive ? atPrice * supply : atPrice;

    return finalAtPrice;
  }
  // buy handler
  async function buyHandler() {
    if (walletAddress) {
      if (quantity < nativeTokenbalance) {
        const usdActive = await getChartUsdSolToggleActive();
        const marketCapActive = await getChartMarketCapPriceToggleActive();
        const convertedPrice = await convertToUsdtoSolAndMC(price, usdActive, marketCapActive);
        buySolanaTokens(
          token,
          quantity,
          slippage,
          priorityFee,
          walletAddress,
          setLoaderSwap,
          setTokenBalance,
          bondingProgress >= 100 ? "djasodnasuodhasoduashd" : progranAddress,
          solanaLivePrice,
          dispatch,
          price,
          convertedPrice,
          usdActive,
          marketCapActive,
          {
            name: tokenSymbol,
            symbol: tokenName,
            img: tokenImage || null
          }
        );
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      return dispatch(openCloseLoginRegPopup(true));
    }
  }
  // sell handler
  async function sellHandler() {
    if (walletAddress) {
      if (quantity <= tokenBalance) {
        const usdActive = await getChartUsdSolToggleActive();
        const marketCapActive = await getChartMarketCapPriceToggleActive();
        const convertedPrice = await convertToUsdtoSolAndMC(price, usdActive, marketCapActive);
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
          dispatch,
          recQty,
          convertedPrice,
          usdActive,
          marketCapActive,
          {
            name: tokenSymbol,
            symbol: tokenName,
            img: tokenImage || null
          }
        );
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      return dispatch(openCloseLoginRegPopup(true));
    }
  }
  useEffect(() => {
    if (activeTab == "sell") {
      setQuantity(tokenBalance);
    }
  }, [tokenBalance, activeTab]);
  useEffect(() => {
    if (price && solanaLivePrice) {
      if (activeTab == "sell") {
        calculateRecAmountSolToAnytoken(quantity || 0, price, solanaLivePrice);
      } else {
        calculateRecAmountSolToAnytoken(
          quantity || 0.1,
          solanaLivePrice,
          price
        );
      }
    }
  }, [quantity, activeTab, price, solanaLivePrice]);

  // all about order setting
  useEffect(() => {
    const preSetFromLocalStorage = JSON.parse(
      localStorage.getItem("preSetAllData")
    );
    const orderActiveChart = localStorage.getItem("preSetSettingActive");
    if (preSetFromLocalStorage) {
      dispatch(setPreSetOrderSetting(preSetFromLocalStorage));
    }
    if (orderActiveChart) {
      dispatch(setPresetActive(orderActiveChart));
    }
  }, []);
  useEffect(() => {
    updateOrderSetting();
  }, [presist, activeTab, preSetData]);
  return (
    <div className="bg-[#08080E] flex flex-col h-fit w-full text-white xl:p-4 md:p-3">
      {/* Buy/Sell Toggle */}
      <div className="flex h-[42px] items-center bg-[#1f1f1f] md:rounded-[8px] mb-[16px] ">
        <button
          className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-500 outline-none ${activeTab === "buy"
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
          className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-300 ${activeTab === "sell"
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
      {/* preset settings  */}
      <div className={`flex items-center justify-between mb-[16px]`}>
        <div className="flex items-center gap-[8px]">
          <FaCog className="text-[16px]" />
          <h1 className="text-[#F6F6F6] text-[12px] font-[400]">
            {tragindViewPage?.right?.buysell?.orderSettings}
          </h1>
        </div>
        <button
          className="p-2 rounded-md"
          onClick={() => dispatch(setOpenOrderSetting(true))}
        >
          <PiPencilLineBold />
        </button>
      </div>
      <div className="mb-[16px] flex items-center border-[0.5px] border-[#404040] rounded-[4px]">
        {["P1", "P2", "P3", "P4", "P5"].map((item, index) => (
          <button
            key={index + 1}
            onClick={() => {
              dispatch(setPresetActive(item));
              localStorage.setItem("preSetSettingActiveChart", item);
            }}
            className={`w-full py-[7px] text-[#F6F6F6] font-[700] text-[12px] border-r-[0.5px] border-r-[#404040] duration-300 ease-in-out ${presist == item
              ? activeTab == "buy"
                ? "bg-[#1F73FC]"
                : "bg-[#ED1B24]"
              : "bg-transparent"
              }`}
          >
            {item}
          </button>
        ))}
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
              src={tokenImage || solana}
              alt="Token Image"
              className="w-[35px] h-[20px]"
            />
          )}
        </div>
      </div>
      {/* Preset Quantity Buttons */}
      <div className="flex gap-2 mb-[16px]">
        {activeTab == "buy"
          ? buyValues.map((val, index) =>
            editIndex === index ? (
              <input
                key={index}
                type="number"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-[62px] h-[34px] flex items-center justify-center text-center   text-[14px] rounded bg-[#1F1F1F] outline-none   text-[#278BFE] border-t-[1px] border-t-[#278BFE] "
                autoFocus
              />
            ) : (
              <button
                key={index}
                className={`w-[62px] h-[34px] flex text-[14px] items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 ${quantity === val
                  ? "text-[#278BFE] border-t-[1px] border-t-[#278BFE]"
                  : "text-[#FFFFFF] border-t-[0.5px] border-t-[#4D4D4D]"
                  }`}
                onClick={() => {
                  if (isEditing) {
                    setEditIndex(index);
                    setCustomInput(val.toString());
                  } else {
                    setQuantity(val);
                  }
                }}
              >
                {val}
              </button>
            )
          )
          : sellValues.map((val, index) =>
            editIndex === index ? (
              <input
                key={index}
                type="number"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-[62px] h-[34px] flex items-center justify-center text-center text-[14px] rounded bg-[#1F1F1F] outline-none text-[#ed1819] border-t-[1px] border-t-[#ed1819]"
                autoFocus
              />
            ) : (
              <button
                key={index}
                className={`w-[62px] h-[34px] flex text-[14px] items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 
                  ${Number(quantity).toFixed(5) ===
                    Number((tokenBalance * val) / 100).toFixed(5) &&
                    quantity > 0
                    ? "text-[#ed1819] border-t-[1px] border-t-[#ed1819]"
                    : "text-[#FFFFFF] border-t-[0.5px] border-t-[#4D4D4D]"
                  }`}
                onClick={() => {
                  if (isEditing) {
                    setEditIndex(index);
                    setCustomInput(val.toString());
                  } else {
                    if (val == 100) {
                      setQuantity(tokenBalance);
                    } else {
                      setQuantity(
                        Number((tokenBalance * val) / 100).toFixed(5)
                      );
                    }
                  }
                }}
              >
                {val}%
              </button>
            )
          )}
        {!isEditing ? (
          <button
            className="p-2 rounded-md"
            onClick={() => {
              setIsEditing(true);
              setEditIndex(null);
            }}
          >
            <PiPencilLineBold />
          </button>
        ) : (
          <button
            onClick={saveEditedValue}
            className="px-2"
          // disabled={editIndex === null}
          >
            <FaCheck />
          </button>
        )}
      </div>
      {/* Advanced Settings */}
      <div className="mb-[16px]">
        <div
          onClick={() => setIsAdvancedSetting(!isAdvancedSetting)}
          className={`flex cursor-pointer items-center justify-between ${isAdvancedSetting && "mb-[16px]"
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
              className={`ease-in-out duration-300 text-[19px] ${isAdvancedSetting && "rotate-90"
                }`}
            />
          </h1>
        </div>
        <div
          className={`transform transition-all duration-300 ease-in-out origin-top overflow-hidden ${isAdvancedSetting
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-[#F6F6F6] text-[14px] font-[400]">
                MEV Protection
              </h1>
            </div>
            {/* Auto approve */}
            {/* <div className="flex items-center gap-[8px]">
              <div
                onClick={() => setisAutoApprove(!isAutoApprove)}
                className={`flex ${isAutoApprove
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
            </div> */}
          </div>
          <div className="bg-transparent rounded-[8px] flex items-center justify-between border-t-[0.5px] border-t-[#4D4D4D] mb-[16px]">
            <h1 className="text-[#A8A8A8] select-none rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center whitespace-nowrap">
              {tragindViewPage?.right?.buysell?.advancedsettings?.priority}
            </h1>
            <input
              type="number"
              className="bg-transparent px-11 w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
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
                className={`w-[96px] h-[34px] text-[14px] flex items-center justify-center rounded-md bg-[#1F1F1F] ease-in-out duration-300 ${priorityFee == val?.value
                  ? `border-t-[1px] border-t-[#278BFE] ${activeTab == "buy"
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
            className={`flex items-center justify-center gap-[2px] bg-[#2A7FF0] hover:bg-[#3f8cf1] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
          >
            <h1>
              {`${tragindViewPage?.right?.buysell?.btnbuy} ${tokenName} ${quantity}`}
            </h1>
            <Image
              src={solanaBlackLogo}
              alt="solana"
              className="w-[20px] !h-[13px] rounded-full bg-cover"
            />
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
          className={`flex items-center justify-center gap-[2px] bg-[#ED1B24] hover:bg-[#ff323d] select-none text-[#F6F6F6] text-[14px] font-[500] w-full h-[40px] ease-in-out duration-200  rounded-md`}
        >
          <h1>
            {`${tragindViewPage?.right?.buysell?.btnsell} ${tokenName} ${recQty > 0 ? recQty : 0
              }`}
          </h1>
          <Image
            src={solanaBlackLogo}
            alt="solana"
            className="w-[20px] !h-[13px] rounded-full bg-cover"
          />
        </button>
      )}
      <RightModalOpenSetting
        ordersettingLang={tredingPage?.mainHeader?.ordersetting}
        isOpen={orderSettingFlag}
        onClose={() => dispatch(setOpenOrderSetting(false))}
        tredingPage={tredingPage}
      />
    </div>
  );
};
export default TradingPopup;
