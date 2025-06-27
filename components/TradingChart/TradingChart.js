"use client";

import React, { useEffect, useRef, useState } from "react";
import { widget } from "../../public/charting_library";
import Datafeed from "../../utils/tradingViewChartServices/customDatafeed";
import { intervalTV } from "../../utils/tradingViewChartServices/constant";
import { unsubscribeFromWebSocket } from "@/utils/tradingViewChartServices/websocketOHLC";
import { addMark, clearMarks } from "@/utils/tradingViewChartServices/mark";
import {
  humanReadableFormatWithNoDollar,
  formatDecimal,
} from "@/utils/basicFunctions";
import { clearLatestHistoricalBar } from "@/utils/tradingViewChartServices/latestHistoricalBar";
import { clearSellItems } from "@/utils/tradingViewChartServices/sellItems";
import { clearChunk } from "@/utils/tradingViewChartServices/historicalChunk";
import axios from "axios";
import {
  clear100SellLine,
  subscribe100SellLine,
} from "@/utils/tradingViewChartServices/firstSell100Percent";
import { resetResolutionOffsets } from "@/utils/tradingViewChartServices/getBars";

const TVChartContainer = ({
  chartTokenDataState,
  searchParams,
  tokenSymbol,
  tokenaddress,
  currentTokenPnLData,
  solanaLivePrice,
  supply,
}) => {
  const chartContainerRef = useRef(null);
  const [isUsdSolToggled, setIsUsdSolToggled] = useState(true); // Track USD/SOL toggle state
  const [isMcPriceToggled, setIsMcPriceToggled] = useState(true); // Track MarketCap/Price toggle state
  const [chart, setChart] = useState(null);
  const [chartReady, setChartReady] = useState(false);
  const [value100SellLine, setValue100SellLine] = useState(0);
  const [currentTokenAddress, setCurrentTokenAddress] = useState(null);
  const [hasGottenMarks, setHasGottenMarks] = useState(false);
  const [chartResolution, setChartResolution] = useState(() => {
    const saved = localStorage.getItem("chartResolution");
    return saved === null ? "15S" : saved;
  });

  const buyPositionLineRef = useRef(null);
  const sellPositionLineRef = useRef(null);

  const convertPrice = (price) => {
    let convertedPrice = price;
    convertedPrice = isMcPriceToggled
      ? convertedPrice * supply
      : convertedPrice;
    return convertedPrice;
  };

  const resetLines = () => {
    resetBuyLine();
    resetSellLine();
  };

  useEffect(() => {
    if (chartReady && solanaLivePrice > 0 && tokenaddress && !hasGottenMarks) {
      getBuySellMarks();
    }
  }, [chartReady, solanaLivePrice, tokenaddress]);

  const resetBuyLine = () => {
    if (buyPositionLineRef.current !== null) {
      buyPositionLineRef.current.remove();
    }
    buyPositionLineRef.current = null;
  };

  const resetSellLine = () => {
    if (sellPositionLineRef.current !== null) {
      sellPositionLineRef.current.remove();
    }
    sellPositionLineRef.current = null;
  };

  useEffect(() => {
    const fetchToggle = async () => {
      const usdSolToggle = await localStorage.getItem(
        "chartUsdSolToggleActive"
      );
      if (usdSolToggle !== null) {
        setIsUsdSolToggled(usdSolToggle === "true");
      }

      const mcPriceToggle = await localStorage.getItem(
        "chartMarketCapPriceToggleActive"
      );
      if (mcPriceToggle !== null) {
        setIsMcPriceToggled(mcPriceToggle === "true");
      }
    };

    fetchToggle();
  }, []);

  const getBuySellMarks = async () => {
    setHasGottenMarks(true);
    const walletsToMark = [];
    const tokenCreator = localStorage.getItem("chartTokenCreator");
    const userWallet = localStorage.getItem("walletAddress");
    if (tokenCreator !== "0") {
      walletsToMark.push(tokenCreator);
    }
    if (userWallet != null) {
      walletsToMark.push(userWallet);
    }
    // console.log("chart address", tokenaddress);
    // console.log("walletsToMark", walletsToMark);
    if (walletsToMark.length === 0) {
      return;
    }
    try {
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query TradingView($token: String, $walletsToMark: [String!] = []) {
  Solana {
    creatorTransactions: DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 1000}
      where: {
        Trade: {
          Currency: {MintAddress: {is: $token}}, 
        }, 
        Transaction: {
          Result: {Success: true}, 
          Signer: {in: $walletsToMark}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signer
      }
      Trade {
        Amount
        PriceInUSD
        Side {
          Type
          AmountInUSD
        }
      }
    }

  }
}
`,
          variables: {
            token: tokenaddress,
            walletsToMark,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      const creatorTransactions =
        response?.data?.data?.Solana?.creatorTransactions;
      if (creatorTransactions?.length > 0) {
        for (let i = 0; i < creatorTransactions.length; i++) {
          const creatorTransaction = creatorTransactions[i];
          const blockTime =
            new Date(creatorTransaction?.Block?.Time).getTime() / 1000;
          const isBuy = creatorTransaction?.Trade?.Side?.Type === "buy";
          const tokenAmount = Number(creatorTransaction?.Trade?.Amount);

          const usdTraded = Number(
            creatorTransaction?.Trade?.Side?.AmountInUSD
          );

          const usdPrice = Number(creatorTransaction?.Trade?.PriceInUSD);
          const usdSolPrice = isUsdSolToggled
            ? usdPrice
            : usdPrice / (solanaLivePrice != 0 ? solanaLivePrice : 1);
          const atPrice = isMcPriceToggled ? usdSolPrice * supply : usdSolPrice;

          if (creatorTransaction?.Transaction?.Signer === tokenCreator) {
            await addMark(
              blockTime,
              isBuy,
              usdTraded,
              atPrice,
              tokenAmount,
              isUsdSolToggled,
              isMcPriceToggled,
              "dev"
            );
          } else if (creatorTransaction?.Transaction?.Signer === userWallet) {
            await addMark(
              blockTime,
              isBuy,
              usdTraded,
              atPrice,
              tokenAmount,
              isUsdSolToggled,
              isMcPriceToggled,
              "user"
            );
          }
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message || error);
    }
  };

  // Subscribe to array changes
  useEffect(() => {
    clearSellItems();
    // Update state when array changes
    const unsubscribe = subscribe100SellLine((avgSell) => {
      setValue100SellLine(avgSell); // Create a new array to trigger re-render
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (tokenaddress !== currentTokenAddress) {
      resetLines();
      clear100SellLine();
      clearMarks();
      setHasGottenMarks(false);
      setCurrentTokenAddress(tokenaddress);
    }
  }, [tokenaddress]);

  useEffect(() => {
    if (!chart) return;
    if (!chartReady) return;
    if (!currentTokenPnLData) {
      resetLines();
      return;
    }
    const nonPastBuyAverage = isUsdSolToggled
      ? currentTokenPnLData?.averageBuyPrice || null
      : currentTokenPnLData?.averageBuyPrice /
          currentTokenPnLData?.averageSolBuyPrice || null;
    const pastBuyAverage = isUsdSolToggled
      ? currentTokenPnLData?.pastAverageBuyPrice || 0
      : currentTokenPnLData?.pastAverageBuyPricecurrentTokenPnLData
          ?.pastAverageBuyPrice / currentTokenPnLData?.pastAverageBuySolPrice ||
        0;
    const buyLineAmount =
      nonPastBuyAverage != null ? nonPastBuyAverage : pastBuyAverage;

    const nonPastSellAverage = isUsdSolToggled
      ? currentTokenPnLData?.averageSellPrice || null
      : currentTokenPnLData?.averageSellPrice /
          currentTokenPnLData?.averageSolSellPrice || null;
    const pastSellAverage = isUsdSolToggled
      ? currentTokenPnLData?.pastAverageSellPrice || 0
      : currentTokenPnLData?.pastAverageSellPrice /
          currentTokenPnLData?.pastAverageSellSolPrice || 0;
    const sellLineAmount =
      nonPastSellAverage != null ? nonPastSellAverage : pastSellAverage || value100SellLine || 0;

    if (buyLineAmount <= 0) {
      resetBuyLine();
    }
    if (sellLineAmount <= 0) {
      resetSellLine();
    }
    const createChartLines = async () => {
      // Average Buy Sell
      if (buyLineAmount > 0 && buyPositionLineRef.current === null) {
        // console.log("creating buy line")
        buyPositionLineRef.current = await chart
          .activeChart()
          .createPositionLine();
      }
      if (buyPositionLineRef.current) {
        // console.log("modyfing buy line")
        buyPositionLineRef.current
          .setText("Current Average Cost Basis")
          .setQuantity("")
          .setPrice(convertPrice(Number(buyLineAmount)))
          .setQuantityBackgroundColor("#427A2C")
          .setQuantityBorderColor("#427A2C")
          .setBodyBorderColor("#FFFFFF00")
          .setBodyTextColor("#427A2C")
          .setBodyBackgroundColor("#FFFFFF00")
          .setExtendLeft(true)
          .setLineStyle(2)
          .setLineLength(0)
          .setLineColor("#427A2C");
      }
      if (sellLineAmount > 0 && sellPositionLineRef.current === null) {
        sellPositionLineRef.current = await chart
          .activeChart()
          .createPositionLine();
      }
      if (sellPositionLineRef.current) {
        sellPositionLineRef.current
          .setText("Current Average Exit Price")
          .setQuantity("")
          .setPrice(convertPrice(Number(sellLineAmount)))
          .setQuantityBackgroundColor("#AB5039")
          .setQuantityBorderColor("#AB5039")
          .setBodyBorderColor("#FFFFFF00")
          .setBodyTextColor("#AB5039")
          .setBodyBackgroundColor("#FFFFFF00")
          .setExtendLeft(true)
          .setLineStyle(2)
          .setLineLength(0)
          .setLineColor("#AB5039");
      }
    };
    createChartLines();
  }, [
    currentTokenPnLData,
    chartReady,
    isUsdSolToggled,
    isMcPriceToggled,
    value100SellLine,
    currentTokenAddress,
  ]);

  // console.log("TVChartContainer called.");
  useEffect(() => {
    clearLatestHistoricalBar();
    clearChunk();
    setChart(null);
    setChartReady(false);
    window.chartReady = false;
    const tvWidget = new widget({
      symbol: tokenSymbol,
      datafeed: Datafeed,
      custom_formatters: {
        priceFormatterFactory: (symbolInfo, minTick) => {
          return {
            format: (price, signPositive) => {
              if (typeof price !== "number" || isNaN(price)) return "";
              return price >= 1 || price <= -1
                ? humanReadableFormatWithNoDollar(price, 2)
                : formatDecimal(price);
            },
          };
        },
      },
      tokenAddress: tokenaddress,
      interval: chartResolution,
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      locale: "en",
      disabled_features: [
        "header_saveload",
        "use_localstorage_for_settings",
        "time_scale_controls",
        "popup_hints",
      ],
      toolbar_bg: "#08080E",
      enabled_features: [
        "study_templates",
        "seconds_resolution",
        "show_marks_on_series",
        "cropped_tick_marks",
        "end_of_period_timescale_marks",
        "two_character_bar_marks_labels",
      ],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      chartType: 1,
      supports_marks: true,
      supports_timescale_marks: true,
      supported_resolutions: intervalTV,
      supported_intervals: intervalTV,
      pricescale: isMcPriceToggled ? 1 : 1000000000,
      theme: "dark",
      overrides: {
        "paneProperties.backgroundGradientStartColor": "#08080e",
        "paneProperties.backgroundGradientEndColor": "#08080e",
        "paneProperties.vertGridProperties.color": "#1f1f1f",
        "paneProperties.horzGridProperties.color": "#1f1f1f",
        "scalesProperties.textColor": "#FFFFFF",
        "mainSeriesProperties.candleStyle.wickUpColor": "#0a9980",
        "mainSeriesProperties.candleStyle.wickDownColor": "#f33547",
        "mainSeriesProperties.candleStyle.upColor": "#0a9980",
        "mainSeriesProperties.candleStyle.downColor": "#f33547",
        "mainSeriesProperties.candleStyle.borderUpColor": "#0a9980",
        "mainSeriesProperties.candleStyle.borderDownColor": "#f33547",
      },
    });
    setChart(tvWidget);
    // console.log("TradingView widget initialized.", tvWidget);
    tvWidget.onChartReady(async () => {
      setChartReady(true);
      window.chartReady = true;
      // console.log("Chart has loaded!");
      const priceScale = tvWidget
        .activeChart()
        .getPanes()[0]
        .getMainSourcePriceScale();
      priceScale.setAutoScale(true);
      tvWidget
        .activeChart()
        .onIntervalChanged()
        .subscribe(null, async (interval, timeframeObj) => {
          setChartResolution(interval);
          localStorage.setItem("chartResolution", interval);
          clearSellItems();
          clearChunk();
        });
    });
    // Add custom toggle buttons
    tvWidget.headerReady().then(() => {
      // USD/SOL Toggle Button
      const usdSolButton = tvWidget.createButton();
      usdSolButton.setAttribute("title", "Toggle between USD/SOL");
      usdSolButton.innerHTML = isUsdSolToggled
        ? '<span style="color: #1E90FF">USD</span>/<span style="color: #808080">SOL</span>'
        : '<span style="color: #808080">USD</span>/<span style="color: #1E90FF">SOL</span>';
      usdSolButton.addEventListener("click", () => {
        resetLines();
        clearChunk();
        clearSellItems();
        resetResolutionOffsets();
        setIsUsdSolToggled((prev) => {
          const newState = !prev;
          usdSolButton.innerHTML = newState
            ? '<span style="color: #1E90FF">USD</span>/<span style="color: #808080">SOL</span>'
            : '<span style="color: #808080">USD</span>/<span style="color: #1E90FF">SOL</span>';
          localStorage.setItem("chartUsdSolToggleActive", newState);
          return newState;
        });
      });

      const mcUsdButton = tvWidget.createButton();
      mcUsdButton.setAttribute("title", "Toggle between MarketCap and Price");
      mcUsdButton.innerHTML = isMcPriceToggled
        ? '<span style="color: #1E90FF">MarketCap</span>/<span style="color: #808080">Price</span>'
        : '<span style="color: #808080">MarketCap</span>/<span style="color: #1E90FF">Price</span>';
      mcUsdButton.addEventListener("click", () => {
        resetLines();
        clearChunk();
        resetResolutionOffsets();
        clearSellItems();
        setIsMcPriceToggled((prev) => {
          const newState = !prev;
          mcUsdButton.innerHTML = newState
            ? '<span style="color: #1E90FF">MarketCap</span>/<span style="color: #808080">Price</span>'
            : '<span style="color: #808080">MarketCap</span>/<span style="color: #1E90FF">Price</span>';
          localStorage.setItem("chartMarketCapPriceToggleActive", newState);
          return newState;
        });
      });
    });
    window.tvWidget = tvWidget;
    return () => {
      if (tvWidget) {
        // console.log("Removing TradingView widget.");
        tvWidget.remove();
      }
      // Unsubscribe from WebSocket when component unmounts
      unsubscribeFromWebSocket();
    };
  }, [tokenaddress, isUsdSolToggled, isMcPriceToggled]);

  return <div ref={chartContainerRef} className="h-full w-full bg-[#08080E]" />;
};
export default TVChartContainer;
