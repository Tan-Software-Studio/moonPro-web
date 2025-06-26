"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { setselectToken, setselectTokenLogo } from "@/app/redux/CommonUiData";
import Table from "@/components/TradingChart/Table";
import { solana } from "@/app/Images";
import {
  calculatePercentageDifference,
  convertAnyPriceToSol,
  numberFormated,
  formatDecimal,
  capitalizeFirstLetter,
  formatNumber,
} from "@/utils/basicFunctions";
import TVChartContainer from "@/components/TradingChart/TradingChart";
import TokenDetails from "@/components/common/tradingview/TokenDetails";
import UserPnL from "@/components/common/tradingview/UserPnL";
import TradingStats from "@/components/common/tradingview/TradingStats";
import TradingPopup from "@/components/common/tradingview/TradingPopup";
import TokenInfo from "@/components/common/tradingview/TokenInfo";
import DataSecurity from "@/components/common/tradingview/DataSecurity";
import { useTranslation } from "react-i18next";
import { humanReadableFormat } from "@/utils/calculation";
import { fetchChartAllData } from "@/app/redux/chartDataSlice/chartData.slice";
import SharePnLModal from "@/components/common/tradingview/SharePnLModal";
import axios from "axios";
import { resetResolutionOffsets } from "@/utils/tradingViewChartServices/getBars";
import { clearMarks } from "@/utils/tradingViewChartServices/mark";
import ResizableChartContainer from "@/components/common/tradingview/ResizableChartContainer";
import AutoRefreshOnInactivity from "@/utils/AutoRefreshOnInactivity";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

const Tradingview = () => {
  const { t } = useTranslation();
  const tragindViewPage = t("tragindViewPage");
  const tredingPage = t("tredingPage");
  const [activeTab, setActiveTab] = useState("buy");
  const [isSharePnLModalActive, setIsSharePnLModalActive] = useState(false);
  const [dataLoaderForChart, setDataLoaderForChart] = useState(false);
  const latestTradesData = useSelector((state) => state?.allCharTokenData);
  const decimalFindInArray = latestTradesData?.latestTrades?.find(
    (item) => item?.Trade?.Currency?.Decimals
  )?.Trade?.Currency?.Decimals;
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tokenaddress = searchParams.get("tokenaddress");
  const tokenSymbol = searchParams.get("symbol");
  let pairAddress = searchParams?.get("pair") || null;
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollableDivRef4 = useRef(null);
  const [currentTokenPnLData, setCurrentTokenPnLData] = useState({});
  const [currentTokenAddress, setCurrentTokenAddress] = useState(null);
  const [hasFetchedFromApi, setHasFetchedFromApi] = useState(false);
  const [isPnlUsdSolActive, setIsPnlUsdSolActive] = useState(() => {
    const saved = localStorage.getItem("PnlUsdActive");
    return saved === null ? true : saved === "true";
  });

  const [isInstantTradeActive, setIsInstantTradeActive] = useState(() => {
    const saved = localStorage.getItem("InstantTradeActive");
    return saved === null ? false : saved === "true";
  });

  const handleClickPnlUsdActive = () => {
    const newValue = !isPnlUsdSolActive;
    setIsPnlUsdSolActive(newValue);
    localStorage.setItem("PnlUsdActive", newValue.toString());
  };

  const handleInstantTradeClick = () => {
    const newValue = !isInstantTradeActive;
    setIsInstantTradeActive(newValue);
    localStorage.setItem("InstantTradeActive", newValue.toString());
  };
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );

  // token image
  const tokenImage = useSelector(
    (state) => state?.AllStatesData?.chartSymbolImage
  );

  // chart data from redux
  const chartTokenData = useSelector(
    (state) => state?.allCharTokenData?.chartData
  );

  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlData || []
  );

  // solana live price
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  const [smallScreenTab, setIsSmallScreenTab] = useState("Trades");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();

    window?.addEventListener("resize", checkScreenSize);

    return () => window?.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (tokenaddress !== currentTokenAddress) {
      clearMarks();
      resetResolutionOffsets();
      setCurrentTokenPnLData({});
      setHasFetchedFromApi(false);
      setCurrentTokenAddress(tokenaddress);
    }
    const runEffect = async () => {
      const fetchPastPnLData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            // console.error("No auth token found in localStorage.");
            return;
          }

          const response = await axios({
            url: `${BASE_URL}transactions/getSingleTokenlastAction/${tokenaddress}/${activeSolWalletAddress?.wallet
              }`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const pastTokenData = response?.data?.data?.lastAction;

          if (pastTokenData != null) {
            const pastTokenProperties = {
              pastAverageBuySolPrice: pastTokenData?.solAvgPriceBuy || null,
              pastAverageBuyPrice: pastTokenData?.buyPrice || null,
              pastAverageBuy:
                pastTokenData?.qty * pastTokenData.buyPrice || null,
              pastAverageSellSolPrice: pastTokenData?.solAvgPriceSell || null,
              pastAverageSellPrice: pastTokenData?.sellPrice || null,
              pastAverageSell:
                pastTokenData?.qty * pastTokenData?.sellPrice || null,
              pastQty: pastTokenData?.qty || null,
              pastPnlPrice: pastTokenData?.realizedProfit || null,
              pastPnlPercentage: pastTokenData?.pnlPercentage || null,
            };

            setCurrentTokenPnLData({ ...pastTokenProperties });
          }
        } catch (error) {
          // console.error("Error fetching past PnL data:", error);
        }
      };

      const currentPnlData = currentTabData.find(
        (pnls) => pnls?.token === tokenaddress
      );
      if (
        currentPnlData == null &&
        Object.keys(currentTokenPnLData || {}).length === 0 &&
        hasFetchedFromApi === false &&
        tokenaddress &&
        activeSolWalletAddress?.wallet
      ) {
        setHasFetchedFromApi(true);
        await fetchPastPnLData();
      } else {
        if (currentPnlData?.chainBalance > 0) {
          setHasFetchedFromApi(false);
          const buyAmount =
            currentPnlData?.activeQtyHeld * currentPnlData?.averageBuyPrice ||
            0;
          const solBuyAmount =
            currentPnlData?.activeQtyHeld *
            currentPnlData?.averageSolBuyPrice || 0;
          const soldAmount =
            currentPnlData?.quantitySold *
            currentPnlData?.averageHistoricalSellPrice || 0;
          const solSellAmount =
            currentPnlData?.quantitySold *
            currentPnlData?.averageSolSellPrice || 0;
          const activeQtyHeld = currentPnlData?.activeQtyHeld || 0;
          const quantitySold = currentPnlData?.quantitySold || 0;
          const averageBuyPrice = currentPnlData?.averageBuyPrice || 0;

          const holdingRawAmount = activeQtyHeld - quantitySold;
          const availableQtyInUSDWhenBought =
            holdingRawAmount * averageBuyPrice;
          const holdingsUsdInCurrentPrice =
            holdingRawAmount *
            (latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD || 0);
          const holdingSolInCurrentPrice =
            holdingsUsdInCurrentPrice / solanaLivePrice;

          const pnlAmount =
            holdingsUsdInCurrentPrice - availableQtyInUSDWhenBought;
          const isPositivePnL = pnlAmount >= 0;
          const absolutePnL = Math.abs(pnlAmount);
          const absoluteSolPnL = absolutePnL / solanaLivePrice;

          const pnlPercent =
            availableQtyInUSDWhenBought !== 0
              ? (pnlAmount / availableQtyInUSDWhenBought) * 100
              : 0;

          const safePnLPercent = isNaN(pnlPercent) ? 0 : pnlPercent;

          const currentPnlProperties = {
            buyAmount,
            solBuyAmount,
            averageBuyPrice,
            averageSolBuyPrice: currentPnlData?.averageSolBuyPrice || 0,
            soldAmount,
            solSellAmount,
            averageSellPrice: currentPnlData?.averageHistoricalSellPrice || 0,
            averageSolSellPrice: currentPnlData?.averageSolSellPrice || 0,
            holdingRawAmount,
            holdingsUsdInCurrentPrice,
            holdingSolInCurrentPrice,
            isPositivePnL,
            absolutePnL,
            absoluteSolPnL,
            safePnLPercent,
          };

          setCurrentTokenPnLData({ ...currentPnlProperties });
        }
      }
    };

    runEffect(); // 👈 Call the async function
  }, [currentTabData, tokenaddress]);

  useEffect(() => {
    dispatch(setselectToken("Solana"));
    dispatch(setselectTokenLogo(solana));
  }, []);

  useEffect(() => {
    localStorage.setItem("chartTokenAddress", tokenaddress);
    const handleScroll = () => {
      if (containerRef?.current) {
        const scrollAmount = containerRef?.current.scrollTop;
        setScrollPosition(scrollAmount);
      }
    };

    const currentRef = containerRef?.current;
    if (currentRef) {
      currentRef?.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef?.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleCopy = (mintAddress) => {
    setCopied(true);
    // toast.success("TokenAddress copied to clipboard!", {
    //   position: "top-center",
    // });
    if (mintAddress) {
      const formattedAddress = mintAddress;
      navigator?.clipboard
        ?.writeText(formattedAddress)
        .then(() => { })
        .catch((err) => {
          console.error("Failed to copy: ", err?.message);
        });
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const tokenDetailsMarketCap = humanReadableFormat(
    chartTokenData?.currentSupply *
    latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD
  );

  const TokenDetailsNumberData = [
    {
      label: capitalizeFirstLetter(
        `${tragindViewPage?.right?.tokeninfo?.price}`
      ),
      price: `$${formatDecimal(
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD || 0,
        1
      )}`,
    },
    {
      label: capitalizeFirstLetter(tragindViewPage?.right?.tokeninfo?.liq),
      price: chartTokenData?.Liqudity || 0,
    },
    {
      label: capitalizeFirstLetter(tragindViewPage?.right?.tokeninfo?.supply),
      price: humanReadableFormat(chartTokenData?.currentSupply, false),
    },
  ];

  const bondingCurveValue = chartTokenData?.bondingCurveProgress || 0;
  if (chartTokenData?.bondingCurveProgress && bondingCurveValue < 100) {
    TokenDetailsNumberData.push({
      label: "B.Curve",
      price: `${bondingCurveValue.toFixed(2)}%`,
    });
  }

  const tradeData = {
    "5M": {
      txns: chartTokenData?.buys_5min + chartTokenData?.sells_5min,
      buys: chartTokenData?.buys_5min,
      sells: chartTokenData?.sells_5min,
      vol: chartTokenData?.buy_volume_5min + chartTokenData?.sell_volume_5min,
      buyVol: chartTokenData?.buy_volume_5min,
      sellVol: chartTokenData?.sell_volume_5min,
      makers: chartTokenData?.buyers_5min + chartTokenData?.sellers_5min,
      buyers: chartTokenData?.buyers_5min,
      sellers: chartTokenData?.sellers_5min,
    },
    "1H": {
      txns: chartTokenData?.buys_1h + chartTokenData?.sells_1h,
      buys: chartTokenData?.buys_1h,
      sells: chartTokenData?.sells_1h,
      vol: chartTokenData?.buy_volume_1h + chartTokenData?.sell_volume_1h,
      buyVol: chartTokenData?.buy_volume_1h,
      sellVol: chartTokenData?.sell_volume_1h,
      makers: chartTokenData?.buyers_1h + chartTokenData?.sellers_1h,
      buyers: chartTokenData?.buyers_1h,
      sellers: chartTokenData?.sellers_1h,
    },
    "6H": {
      txns: chartTokenData?.buys_6h + chartTokenData?.sells_6h,
      buys: chartTokenData?.buys_6h,
      sells: chartTokenData?.sells_6h,
      vol: chartTokenData?.buy_volume_6h + chartTokenData?.sell_volume_6h,
      buyVol: chartTokenData?.buy_volume_6h,
      sellVol: chartTokenData?.sell_volume_6h,
      makers: chartTokenData?.buyers_6h + chartTokenData?.sellers_6h,
      buyers: chartTokenData?.buyers_6h,
      sellers: chartTokenData?.sellers_6h,
    },
    "24H": {
      txns: chartTokenData?.buys_24h + chartTokenData?.sells_24h,
      buys: chartTokenData?.buys_24h,
      sells: chartTokenData?.sells_24h,
      vol: chartTokenData?.buy_volume_24h + chartTokenData?.sell_volume_24h,
      buyVol: chartTokenData?.buy_volume_24h,
      sellVol: chartTokenData?.sell_volume_24h,
      makers: chartTokenData?.buyers_24h + chartTokenData?.sellers_24h,
      buyers: chartTokenData?.buyers_24h,
      sellers: chartTokenData?.sellers_24h,
    },
  };

  const timeframesTrade = [
    {
      label: "5M",
      value:
        chartTokenData?.perfomancePertnage_5min == "NaN"
          ? 0
          : `${calculatePercentageDifference(
            latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
            chartTokenData?.perfomancePertnage_5min
          ).toFixed(2)}` || "N/A",
    },
    {
      label: "1H",
      value:
        chartTokenData?.perfomancePertnage_1h == "NaN"
          ? 0
          : `${calculatePercentageDifference(
            latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
            chartTokenData?.perfomancePertnage_1h
          ).toFixed(2)}` || "N/A",
    },
    {
      label: "6H",
      value:
        chartTokenData?.perfomancePertnage_6h == "NaN"
          ? 0
          : `${calculatePercentageDifference(
            latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
            chartTokenData?.perfomancePertnage_6h
          ).toFixed(2)}` || "N/A",
    },
    {
      label: "24H",
      value:
        chartTokenData?.perfomancePertnage_24h == "NaN"
          ? 0
          : `${calculatePercentageDifference(
            latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
            chartTokenData?.perfomancePertnage_24h
          ).toFixed(2)}` || "N/A",
    },
  ];

  const tokenInfo = [
    {
      label: `${tragindViewPage?.right?.tokeninfo?.price} USD`,
      price: `$${formatDecimal(
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD || 0,
        1
      )}`,
    },
    {
      label: `${tragindViewPage?.right?.tokeninfo?.price} SOL`,
      price: `${formatDecimal(
        convertAnyPriceToSol(
          latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
          solanaLivePrice
        ) || 0,
        1
      )}`,
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.supply,
      price: humanReadableFormat(chartTokenData?.currentSupply, false),
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.liq,
      price: chartTokenData?.Liqudity || 0,
    },
    {
      label: "FDV",
      price: humanReadableFormat(
        chartTokenData?.currentSupply *
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD
      ),
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.mc,
      price: humanReadableFormat(
        chartTokenData?.currentSupply *
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD
      ),
    },
  ];

  const dataAndSecurity = [
    {
      label: "Mint Authority",
      value: chartTokenData?.mint_authority ? "Available" : "Disabled",
    },
    {
      label: "Freeze Authority",
      value: chartTokenData?.freeze_authority ? "Available" : "Disabled",
    },
    {
      label: "LP Burned",
      value: `${Number(chartTokenData?.lp).toFixed(2) || 100}%`,
    },
    {
      label: "Top 10 Holders",
      value: Number(chartTokenData?.TopHolders),
    },
    {
      label: `Pooled ${tokenSymbol}`,
      value: `${numberFormated(
        chartTokenData?.Pooled_Base || 0
      )} | ${humanReadableFormat(
        chartTokenData?.Pooled_Base *
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD
      )}`,
    },
    {
      label: "Pooled SOL",
      value: `${numberFormated(
        chartTokenData?.Pooled_Quote_Native || 0
      )} | ${humanReadableFormat(
        chartTokenData?.Pooled_Quote_Native * solanaLivePrice
      )}`,
    },
  ];
  // Token Chart Data (Right Side)
  useEffect(() => {
    if (tokenaddress) {
      setDataLoaderForChart(true);
      dispatch(
        fetchChartAllData({ tokenaddress, pairAddress, setDataLoaderForChart })
      );
    }
  }, [tokenaddress]);

  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );

  useEffect(() => {
    document.title = `${tokenSymbol} | Nexa`;
  }, [tokenSymbol]);

  const currentTokenDevHoldingData = {
    tokenImage: tokenImage,
    tokenMintAddress: tokenaddress,
    tokenSymbol: tokenSymbol,
    tokenMarketCap: tokenDetailsMarketCap || 0,
    tokenLiquidity: chartTokenData?.Liqudity || 0,
    oneHourVolume: formatNumber(chartTokenData?.buy_volume_1h + chartTokenData?.sell_volume_1h, false, true) || 0,
    migrated: chartTokenData?.bondingCurveProgress >= 100
  }

  return (
    <div
      className={`lg:flex relative overflow-y-auto h-svh max-h-svh ${isSidebarOpen ? "ml-0 mr-0" : " md:ml-2.5"
        }`}
    >
      <AutoRefreshOnInactivity minutes={10} />
      {isSmallScreen && (
        <div className="lg:hidden flex  items-center justify-start bg-[#1F1F1F] rounded-md mt-2 text-white mx-2  text-[12px] font-semibold px-2 py-1">
          {["Trades", "Transaction"].map((item, index) => (
            <div
              onClick={() => setIsSmallScreenTab(item)}
              className={`${smallScreenTab === item
                ? "bg-[#11265B] border-2 border-[#0E43BD]"
                : "border-[1px] border-[#1F1F1F]"
                } cursor-pointer  min-w-fit w-20 text-sm font-light flex justify-center tracking-wider px-2 py-1 rounded-md`}
              key={index}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {/* left side */}
      <div className="lg:!h-svh mb-2 lg:w-[80%] grid place-items-center text-[#8d93b752] overflow-y-auto w-full">
        {/* original live chart */}
        <div
          ref={containerRef}
          className="lg:h-screen h-fit w-full overflow-y-auto"
        >
          {(!isSmallScreen || smallScreenTab === "Trades") && (
            <>
              <div className="md:mx-0 mx-2">
                <TokenDetails
                  tokenSymbol={tokenSymbol}
                  tokenaddress={tokenaddress}
                  copied={copied}
                  handleCopy={handleCopy}
                  TokenDetailsNumberData={TokenDetailsNumberData}
                  tokenDetailsMarketCap={tokenDetailsMarketCap}
                  chartTokenData={chartTokenData}
                  walletAddress={
                    activeSolWalletAddress?.wallet
                  }
                  pairAddress={latestTradesData?.chartData?.pairaddress}
                  tokenImage={tokenImage}
                  setIsSharePnLModalActive={setIsSharePnLModalActive}
                  currentTokenPnLData={currentTokenPnLData}
                />
              </div>

              <ResizableChartContainer 
                isSmallScreen={isSmallScreen}
                tokenSymbol={tokenSymbol}
                tokenaddress={tokenaddress}
                currentTokenPnLData={currentTokenPnLData}
                solanaLivePrice={solanaLivePrice}
                supply={chartTokenData?.currentSupply}
              />
            </>
          )}
          {(!isSmallScreen || smallScreenTab === "Transaction") && (
            <div className="overflow-y-auto border-t border-t-[#4D4D4D]">
              <Table
                tokenCA={tokenaddress}
                address={activeSolWalletAddress?.wallet}
                scrollPosition={scrollPosition}
                solWalletAddress={
                  activeSolWalletAddress?.wallet
                }
                tokenSupply={chartTokenData?.currentSupply}
                currentUsdPrice={
                  latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD
                }
                currentTabData={currentTabData}
                currentTokenDevHoldingData={currentTokenDevHoldingData}
                isInstantTradeActive={isInstantTradeActive}
                handleInstantTradeClick={handleInstantTradeClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* right side */}
      {(!isSmallScreen || smallScreenTab === "Trades") && (
        <div
          ref={scrollableDivRef4}
          className="lg:h-[91.5vh] min-h-svh sm:mt-0 mt-2 sm:px-0 px-2 overflow-y-auto w-full lg:w-[25%] border-b border-b-[#404040] md:border-l md:border-l-[#404040] space-y-2 md:space-y-0"
        >
          <div className="flex lg:flex-col flex-col-reverse gap-2">
            <div className="p-1 w-full border border-[#4D4D4D] md:border-l-0 md:border-r-0 lg:border-t-0">
              <TradingStats
                tragindViewPage={tragindViewPage}
                data={tradeData}
                timeframes={timeframesTrade}
              />
            </div>

            <div className="p-1 w-full border border-[#4D4D4D] lg:border-t-0 md:border-l-0 md:border-r-0 md:border-b-0">
              <TradingPopup
                tragindViewPage={tragindViewPage}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                token={tokenaddress}
                walletAddress={
                  activeSolWalletAddress?.wallet
                }
                tokenName={tokenSymbol}
                tokenSymbol={chartTokenData?.name}
                tokenImage={tokenImage}
                nativeTokenbalance={activeSolWalletAddress?.balance || 0}
                decimal={chartTokenData?.decimal || decimalFindInArray}
                progranAddress={chartTokenData?.programAddress}
                bondingProgress={chartTokenData?.bondingCurveProgress || 0}
                price={latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD}
                dispatch={dispatch}
                solanaLivePrice={solanaLivePrice}
                tredingPage={tredingPage}
                currentSupply={chartTokenData?.currentSupply}
                isInstantTradeActive={isInstantTradeActive}
                handleInstantTradeClick={handleInstantTradeClick}
                currentTokenPnLData={currentTokenPnLData}
                isPnlUsdSolActive={isPnlUsdSolActive}
                onClickPnlUsdActiveToggle={handleClickPnlUsdActive}
              />
            </div>
          </div>

          <SharePnLModal
            isOpen={isSharePnLModalActive}
            onClose={() => {
              setIsSharePnLModalActive(false);
            }}
            tokenSymbol={tokenSymbol}
            currentTokenPnLData={currentTokenPnLData}
            solanaLivePrice={solanaLivePrice}
          />

          <div className="w-full border-[#4D4D4D] lg:border-t-0 md:border-l-0 md:border-r-0 md:border-b-0">
            <UserPnL
              currentTokenPnLData={currentTokenPnLData}
              isPnlUsdSolActive={isPnlUsdSolActive}
              onClickToggle={handleClickPnlUsdActive}
              tokenSymbol={tokenSymbol}
            />
          </div>

          <div className="w-full border border-[#4D4D4D] md:border-l-0 md:border-r-0 md:border-b-0">
            <TokenInfo
              tragindViewPage={tragindViewPage?.right?.tokeninfo}
              tokenInfo={tokenInfo}
              dataLoaderForChart={dataLoaderForChart}
            />
          </div>

          <div className="w-full border border-[#4D4D4D] md:border-l-0 mb-3 md:border-r-0">
            <DataSecurity
              tokenCA={tokenaddress}
              tokenSymbol={tokenSymbol}
              tragindViewPage={tragindViewPage?.right?.datasecurity}
              activeTab={activeTab}
              dataAndSecurity={dataAndSecurity}
              dataLoaderForChart={dataLoaderForChart}
              tokenSupply={chartTokenData?.currentSupply}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tradingview;
