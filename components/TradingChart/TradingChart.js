'use client'

import React, { useEffect, useRef, useState } from "react";
import { widget } from "../../public/charting_library";
import Datafeed from "../../utils/tradingViewChartServices/customDatafeed";
import { intervalTV } from "../../utils/tradingViewChartServices/constant";
import { unsubscribeFromWebSocket } from "@/utils/tradingViewChartServices/websocketOHLC";
import { clearMarks } from "@/utils/tradingViewChartServices/mark";
import { humanReadableFormatWithNoDollar, formatDecimal } from "@/utils/basicFunctions";
import { clearLatestHistoricalBar } from "@/utils/tradingViewChartServices/latestHistoricalBar";
import { clearSellItems, subscribeSellItems } from "@/utils/tradingViewChartServices/sellItems";
import { clearChunk } from "@/utils/tradingViewChartServices/historicalChunk";

const TVChartContainer = ({ tokenSymbol, tokenaddress, currentTokenPnLData, solanaLivePrice, supply }) => {
  const chartContainerRef = useRef(null);
  const [isUsdSolToggled, setIsUsdSolToggled] = useState(true); // Track USD/SOL toggle state
  const [isMcPriceToggled, setIsMcPriceToggled] = useState(true); // Track MarketCap/Price toggle state
  const [chartResolution, setChartResolution] = useState("15S"); // Track USD/SOL toggle state
  const [chart, setChart] = useState(null);
  const [chartReady, setChartReady] = useState(false);
  const [averageSell, setAverageSell] = useState(0);

  const buyPositionLineRef = useRef(null);
  const sellPositionLineRef = useRef(null);

  const convertPrice = (price) => {
    let convertedPrice = price;
    convertedPrice = isUsdSolToggled ? convertedPrice : convertedPrice / solanaLivePrice;
    convertedPrice = isMcPriceToggled ? convertedPrice * supply : convertedPrice;
    return convertedPrice;
  }

  const resetLines = () => {
    if (buyPositionLineRef.current !== null) {
      buyPositionLineRef.current.remove();
    }
    if (sellPositionLineRef.current !== null) {
      sellPositionLineRef.current.remove();
    }
    buyPositionLineRef.current = null;
    sellPositionLineRef.current = null;
  }

  useEffect(() => {
    const fetchToggle = async () => {
      const usdSolToggle = await localStorage.getItem("chartUsdSolToggleActive");
      if (usdSolToggle !== null) {
        setIsUsdSolToggled(usdSolToggle === "true");
      }

      const mcPriceToggle = await localStorage.getItem("chartMarketCapPriceToggleActive");
      if (mcPriceToggle !== null) {
        setIsMcPriceToggled(mcPriceToggle === "true");
      }
    };

    const getChartResolution = async () => {
      let chartResolution = await localStorage.getItem("chartResolution");
      chartResolution = chartResolution === null ? "15S" : chartResolution;
      setChartResolution(chartResolution);
    }

    getChartResolution();

    fetchToggle();

  }, []);

  // Subscribe to array changes
  useEffect(() => {
    clearSellItems();
    // Update state when array changes
    const unsubscribe = subscribeSellItems((avgSell) => {
      setAverageSell(avgSell); // Create a new array to trigger re-render
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!chart) return;
    if (!chartReady) return;
    if (!currentTokenPnLData) return;
    const createChartLines = async () => {
      // Average Buy Sell
      if (currentTokenPnLData?.averageBuyPrice && buyPositionLineRef.current === null) {
        buyPositionLineRef.current = await chart.activeChart().createPositionLine();
      }
      if (buyPositionLineRef.current) {
        buyPositionLineRef.current
                  .setText("Current Average Cost Basis")
                  .setQuantity("")
                  .setPrice(convertPrice(Number(currentTokenPnLData?.averageBuyPrice)))
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
      if (averageSell > 0 && sellPositionLineRef.current === null) {
        sellPositionLineRef.current = await chart.activeChart().createPositionLine();
      }
      if (sellPositionLineRef.current) {
        sellPositionLineRef.current
                .setText("Current Average Exit Price")
                .setQuantity("")
                .setPrice(averageSell)
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
  }, [currentTokenPnLData, chartReady, currentTokenPnLData?.averageBuyPrice, isUsdSolToggled, isMcPriceToggled, averageSell])

  // console.log("TVChartContainer called.");
  useEffect(() => {
    clearMarks();
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
                  if (typeof price !== 'number' || isNaN(price)) return '';
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
      ],
      toolbar_bg: "#08080E",
      enabled_features: ["study_templates", "seconds_resolution", "show_marks_on_series", "cropped_tick_marks", "end_of_period_timescale_marks", "two_character_bar_marks_labels"],
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
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
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
      tvWidget.activeChart().onIntervalChanged().subscribe(null, async (interval, timeframeObj) => {
        setChartResolution(interval);
        localStorage.setItem("chartResolution", interval);
        clearMarks();
        clearSellItems();
        resetLines();
        clearChunk();
      });
    });
    // Add custom toggle buttons
    tvWidget.headerReady().then(() => {
      // USD/SOL Toggle Button
      const usdSolButton = tvWidget.createButton();
      usdSolButton.setAttribute("title", "Toggle between USD/SOL");
      usdSolButton.innerHTML = isUsdSolToggled ? 
        '<span style="color: #1E90FF">USD</span>/<span style="color: #808080">SOL</span>'
        : 
        '<span style="color: #808080">USD</span>/<span style="color: #1E90FF">SOL</span>';    
      usdSolButton.addEventListener("click", () => {
        resetLines();
        clearChunk();
        clearSellItems();
        setIsUsdSolToggled((prev) => {
          const newState = !prev;
          usdSolButton.innerHTML = newState ? 
            '<span style="color: #1E90FF">USD</span>/<span style="color: #808080">SOL</span>'
            : 
            '<span style="color: #808080">USD</span>/<span style="color: #1E90FF">SOL</span>';
          localStorage.setItem("chartUsdSolToggleActive", newState);
          return newState;
        });
      });

      const mcUsdButton = tvWidget.createButton();
      mcUsdButton.setAttribute("title", "Toggle between MarketCap and Price");
      mcUsdButton.innerHTML = isMcPriceToggled ? 
      '<span style="color: #1E90FF">MarketCap</span>/<span style="color: #808080">Price</span>'
      : 
      '<span style="color: #808080">MarketCap</span>/<span style="color: #1E90FF">Price</span>';     
      mcUsdButton.addEventListener("click", () => {
        resetLines();
        clearChunk();
        clearSellItems();
        setIsMcPriceToggled((prev) => {
          const newState = !prev;
          mcUsdButton.innerHTML = newState ? 
          '<span style="color: #1E90FF">MarketCap</span>/<span style="color: #808080">Price</span>'
          : 
          '<span style="color: #808080">MarketCap</span>/<span style="color: #1E90FF">Price</span>';
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
  }, [tokenSymbol, tokenaddress, isUsdSolToggled, isMcPriceToggled]);

  return <div ref={chartContainerRef} className="h-full w-full bg-[#08080E]" />;
};
export default TVChartContainer;
