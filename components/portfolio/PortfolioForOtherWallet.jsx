"use client";
import {
  fetchPerformanceHistoryForAnotherWallet,
  fetchPNLDataForAnotherWallet,
  fetchPNLDataHistoryForAnotherWallet,
  updatePnlTableData,
} from "@/app/redux/holdingDataSlice/holdingData.slice";
import UserProfileControl from "@/components/portfolio/UserProfileControl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../../components/common/NoData/noData";
import { useTranslation } from "react-i18next";
import SharePnLModal from "../common/tradingview/SharePnLModal";
import { useRouter } from "next/navigation";
import axios from "axios";
const metaDataMainName = process.env.NEXT_PUBLIC_METADATA_MAIN_NAME || "Nexa";
const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
const PortfolioForOtherWallet = ({ wallet }) => {
  const [currentPnlDataToShow, setCurrentPnlDataToShow] = useState({});
  const [currentPnlOverride, setCurrentPnlOverride] = useState(null);
  const [isSharePnLModalActive, setIsSharePnLModalActive] = useState(false);
  const [currentPnlDataToShowSymbol, setCurrentPnlDataToShowSymbol] =
    useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const activeTab = useSelector((state) => state?.setPnlData?.pnlTableData);
  // history data from redux
  const historyData = useSelector(
    (state) => state?.setPnlData?.PnlDataHistoryAnotherWallet
  );
  // all data related to pnl
  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlDataForAnotherWallet || []
  );
  const initialLoading = useSelector(
    (state) => state?.setPnlData?.initialLoadingForAnotherWallet
  );
  const isDataLoaded = useSelector(
    (state) => state?.setPnlData?.isDataLoadedForAnotherWallet
  );
  const hasAttemptedLoad = useSelector(
    (state) => state?.setPnlData?.hasAttemptedLoadForAnotherWallet
  );
  // performance state
  const performance = useSelector(
    (state) => state?.setPnlData?.performanceForAnotherWallet
  );
  const loading = useSelector(
    (state) => state?.setPnlData?.loadingForAnotherWallet
  );
  useEffect(() => {
    const solWalletFromLocalStorage = localStorage.getItem("walletAddress");
    if (wallet == solWalletFromLocalStorage) {
      router.replace("/portfolio");
      return;
    }
    if (wallet) {
      axios
        .get(`${baseUrl}user/checkWallet/${wallet}`)
        .then((res) => {
          dispatch(fetchPNLDataForAnotherWallet(wallet));
          dispatch(fetchPNLDataHistoryForAnotherWallet(wallet));
          dispatch(fetchPerformanceHistoryForAnotherWallet(wallet));
        })
        .catch((err) => {
          router.replace("/portfolio");
        });
    }
  }, []);
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

  const handleShowPnlCard = (newPnlData) => {
    setCurrentPnlOverride(null);
    setCurrentPnlDataToShow(convertPnlDataToSharePnl(newPnlData));
    setCurrentPnlDataToShowSymbol(newPnlData.symbol);
    setIsSharePnLModalActive(true);
  };

  const convertHistoricalPnlDataToSharePnl = (pnlData) => {
    const pnlAmount = (pnlData.sellPrice - pnlData?.buyPrice) * pnlData.qty;
    const pnlSolAmount =
      (pnlData.sellPrice / pnlData?.solAvgPriceSell -
        pnlData?.buyPrice / pnlData?.solAvgPriceBuy) *
      pnlData.qty;
    const boughtAmount = pnlData?.qty * pnlData?.buyPrice;
    const boughtSolAmount =
      (pnlData?.qty * pnlData?.buyPrice) / pnlData?.solAvgPriceBuy;
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
      holdings: 0,
    };
  };

  const handleShowPnlHistoricalCard = (newHistoricalData) => {
    setCurrentPnlOverride(
      convertHistoricalPnlDataToSharePnl(newHistoricalData)
    );
    setCurrentPnlDataToShowSymbol(newHistoricalData.symbol);
    setIsSharePnLModalActive(true);
  };

  return (
    <>
      {wallet ? (
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
            </div>
            <UserProfileControl
              handleShowPnlCard={handleShowPnlCard}
              handleShowPnlHistoricalCard={handleShowPnlHistoricalCard}
              quicksell={false}
              solBalanceShow={false}
              activeSolWalletAddress={{ wallet: wallet }}
              historyData={historyData}
              currentTabData={currentTabData}
              initialLoading={initialLoading}
              isDataLoaded={isDataLoaded}
              hasAttemptedLoad={hasAttemptedLoad}
              loading={loading}
              performance={performance}
            />
          </div>
          <SharePnLModal
            currentTokenPnLData={currentPnlDataToShow}
            isOpen={isSharePnLModalActive}
            onClose={() => {
              setIsSharePnLModalActive(false);
            }}
            tokenSymbol={currentPnlDataToShowSymbol}
            walletAddress={wallet || null}
            overridePnlData={currentPnlOverride}
          />
        </>
      ) : (
        <div className="flex flex-col h-[70vh] w-full items-center justify-center mt-5">
          <NoData
            title={portfolio?.loginRequired}
            description={portfolio?.pleaseLogin}
          />
        </div>
      )}
    </>
  );
};

export default PortfolioForOtherWallet;
