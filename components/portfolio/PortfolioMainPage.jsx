"use client";

import { updatePnlTableData } from "@/app/redux/holdingDataSlice/holdingData.slice";
import UserProfileControl from "@/components/portfolio/UserProfileControl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletManagement from "./WalletManagement";
import { useTranslation } from "react-i18next";
import { notFound } from "next/navigation"
import axios from "axios";
import SharePnLModal from "../common/tradingview/SharePnLModal";
const metaDataMainName = process.env.NEXT_PUBLIC_METADATA_MAIN_NAME || "Nexa";
const PortfolioMainPage = ({ walletAddress }) => {
  const [currentPnlDataToShow, setCurrentPnlDataToShow] = useState({});
  const [currentPnlOverride, setCurrentPnlOverride] = useState(null);
  const [isSharePnLModalActive, setIsSharePnLModalActive] = useState(false);
  const [currentPnlDataToShowSymbol, setCurrentPnlDataToShowSymbol] = useState(null);
  const [foundWallet, setFoundWallet] = useState(false);
  const [isFetchingWallet, setIsFetchingWallet] = useState(true);
  const [pnlData, setPnlData] = useState([]);
  const [hasFetchedPnlData, setHasFetchedPnlData] = useState(false);
  const [pnlDataHistory, setPnlDataHistory] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState({});
  const [userOwnsPortfolio, setUserOwnsPortfolio] = useState(false);
  const dispatch = useDispatch();
  const userWallets = useSelector(
    (state) => state?.userData?.userDetails?.walletAddressSOL
  );
  const activeTab = useSelector((state) => state?.setPnlData?.pnlTableData);
  useEffect(() => {
    document.title = `${metaDataMainName} | Portfolio`;
  }, []);
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );

  const { t } = useTranslation();
  const portfolio = t("portfolio");

  const convertPnlDataToSharePnl = (pnlData) => {
    const buyAmount = pnlData?.activeQtyHeld * pnlData?.averageBuyPrice || 0;
    const solBuyAmount =
      pnlData?.activeQtyHeld * pnlData?.averageSolBuyPrice || 0;
    const soldAmount =
      pnlData?.quantitySold * pnlData?.averageHistoricalSellPrice || 0;
    const solSellAmount =
      pnlData?.quantitySold * pnlData?.averageSolSellPrice || 0;
    const activeQtyHeld = pnlData?.activeQtyHeld || 0;
    const quantitySold = pnlData?.quantitySold || 0;
    const averageBuyPrice = pnlData?.averageBuyPrice || 0;

    const holdingRawAmount = activeQtyHeld - quantitySold;
    const availableQtyInUSDWhenBought = holdingRawAmount * averageBuyPrice;
    const holdingsUsdInCurrentPrice =
      holdingRawAmount * (pnlData?.current_price || 0);
    const holdingSolInCurrentPrice =
      holdingsUsdInCurrentPrice / solanaLivePrice;

    const pnlAmount = holdingsUsdInCurrentPrice - availableQtyInUSDWhenBought;
    const isPositivePnL = pnlAmount >= 0;
    const absolutePnL = Math.abs(pnlAmount);
    const absoluteSolPnL = absolutePnL / solanaLivePrice;

    const pnlPercent =
      availableQtyInUSDWhenBought !== 0
        ? (pnlAmount / availableQtyInUSDWhenBought) * 100
        : 0;

    const safePnLPercent = isNaN(pnlPercent) ? 0 : pnlPercent;

    return {
      buyAmount,
      solBuyAmount,
      averageBuyPrice,
      averageSolBuyPrice: pnlData?.averageSolBuyPrice || 0,
      soldAmount,
      solSellAmount,
      averageSellPrice: pnlData?.averageHistoricalSellPrice || 0,
      averageSolSellPrice: pnlData?.averageSolSellPrice || 0,
      holdingRawAmount,
      holdingsUsdInCurrentPrice,
      holdingSolInCurrentPrice,
      isPositivePnL,
      absolutePnL,
      absoluteSolPnL,
      safePnLPercent,
    };
  };

  useEffect(() => {
    const fetchWalletExistsInDB = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/checkWallet/${walletAddress}`,
        );
        const result = res?.data?.data?.wallet;
        setIsFetchingWallet(false);
        setFoundWallet(result);
        return;
      } catch (err) {
        setIsFetchingWallet(false);
        setFoundWallet(true);
        return;
      }
    }
    fetchWalletExistsInDB();
  }, [])

  useEffect(() => {
    if (userWallets?.length > 0) {
      const found = userWallets.some(userWallet => userWallet.wallet === walletAddress);
      setUserOwnsPortfolio(found);
    }
  },[userWallets, walletAddress])
  

  useEffect(() => {
    if (foundWallet) {
      const fetchUserPnl = async () => {
        const [pnlDataRes, pnlDataHistoryRes, performanceHistoryRes] = await Promise.allSettled([
          axios.get(`${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}transactions/PNLSolana/${walletAddress}`),
          axios.get(`${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}transactions/PNLHistory/${walletAddress}`),
          axios.get(`${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}transactions/PNLPerformance/${walletAddress}`)
        ]);

        if (pnlDataRes.status === "fulfilled") {
          setPnlData(pnlDataRes.value?.data?.data?.pnl);
          setHasFetchedPnlData(true);
        } else {
          // console.log("Pnl Data Fetch Error - Portfolio Page", pnlDataRes.reason.message);
          setHasFetchedPnlData(true);
        }

        if (pnlDataHistoryRes.status === "fulfilled") {
          setPnlDataHistory(pnlDataHistoryRes.value?.data?.data?.pnlHistory);
        } else {
          // console.log("Pnl Data History Fetch Error - Portfolio Page", pnlDataHistoryRes.reason.message);
        }

        if (performanceHistoryRes.status === "fulfilled") {
          setPerformanceHistory(performanceHistoryRes.value?.data?.data?.performance);
        } else {
          // console.log("Performance History Fetch Error - Portfolio Page", performanceHistoryRes.reason.message);
        }
      };

      fetchUserPnl();
    }
  }, [foundWallet]);


  const handleShowPnlCard = (newPnlData) => {
    setCurrentPnlOverride(null);
    setCurrentPnlDataToShow(convertPnlDataToSharePnl(newPnlData));
    setCurrentPnlDataToShowSymbol(newPnlData.symbol);
    setIsSharePnLModalActive(true);
  }

  const convertHistoricalPnlDataToSharePnl = (pnlData) => {
    const pnlAmount = (pnlData.sellPrice - pnlData?.buyPrice) * pnlData.qty;
    const pnlSolAmount = ((pnlData.sellPrice / pnlData?.solAvgPriceSell) - (pnlData?.buyPrice / pnlData?.solAvgPriceBuy)) * pnlData.qty;
    const boughtAmount = pnlData?.qty * pnlData?.buyPrice;
    const boughtSolAmount = (pnlData?.qty * pnlData?.buyPrice) / pnlData?.solAvgPriceBuy;
    const absPnl = Math.abs(pnlAmount);
    const absSolPnl = Math.abs(pnlSolAmount);
    return {
        pnlAmount: absPnl,
        pnlSolAmount: absSolPnl,
        isPositivePnL: pnlAmount >= 0,
        pnlPercent: pnlData?.pnlPercentage,
        invested: boughtAmount,
        investedSol: boughtSolAmount,
        position: boughtAmount + pnlAmount,
        positionSol: boughtSolAmount + pnlSolAmount,
        holdings: 0
      };
  };

  const handleShowPnlHistoricalCard = (newHistoricalData) => {
    setCurrentPnlOverride(convertHistoricalPnlDataToSharePnl(newHistoricalData));
    setCurrentPnlDataToShowSymbol(newHistoricalData.symbol);
    setIsSharePnLModalActive(true);
  }

  return (
    <>
    {isFetchingWallet ? 
      <>
      </>
      : 
      <>
        {foundWallet ? (
          <>
            <div className="overflow-y-scroll h-[95vh]">
              <div className="flex items-center gap-5 p-5">
                <div
                  className={`text-xl font-bold cursor-pointer ${
                    activeTab == "profile" ? "text-white" : "text-gray-400"
                  }`}
                  onClick={() => dispatch(updatePnlTableData("profile"))}
                >
                  {portfolio?.spots}
                </div>
                {userOwnsPortfolio &&
                  <div
                    className={`text-xl font-bold cursor-pointer ${
                      activeTab == "portfolio" ? "text-white" : "text-gray-400"
                    }`}
                    onClick={() => dispatch(updatePnlTableData("portfolio"))}
                  >
                    {portfolio?.wallets}
                  </div>
                }
              </div>

              {activeTab == "profile" && 
                <UserProfileControl 
                  walletAddress={walletAddress} 
                  handleShowPnlCard={handleShowPnlCard} 
                  handleShowPnlHistoricalCard={handleShowPnlHistoricalCard} 
                  pnlData={pnlData} 
                  pnlDataHistory={pnlDataHistory} 
                  performance={performanceHistory}
                  userOwnsPortfolio={userOwnsPortfolio}
                  hasFetchedPnlData={hasFetchedPnlData}
                />
              }
              {userOwnsPortfolio && activeTab == "portfolio" && <WalletManagement />}
            </div>
            <SharePnLModal
              currentTokenPnLData={currentPnlDataToShow}
              isOpen={isSharePnLModalActive}
              onClose={() => {
                setIsSharePnLModalActive(false);
              }}
              tokenSymbol={currentPnlDataToShowSymbol}
              walletAddress={walletAddress || null}
              overridePnlData={currentPnlOverride}
            />
          </>
        ) : (
          notFound()
        )}
      </>
    }
    </>
  );
};

export default PortfolioMainPage;
