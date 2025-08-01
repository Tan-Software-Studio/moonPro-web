"use client";
import React, { useEffect, useRef, memo } from "react";
import { widget } from "@/public/charting_library";
import customDataFeed from "@/utils/tradingViewChartServices/AsterdexDatafeed";
function Chart({ selectedSymbol }) {
  const chartContainerRef = useRef(null);
  const tvWidgetRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (tvWidgetRef.current) {
      tvWidgetRef.current.remove();
      tvWidgetRef.current = null;
    }

    const Datafeed = customDataFeed(selectedSymbol)

    const widgetOptions = {
      symbol: selectedSymbol,
      interval: "1",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      datafeed: Datafeed,
      locale: "en",
      fullscreen: false,
      autosize: true,
      timezone: "Asia/Kolkata",
      studies_overrides: {},
      theme: "dark",
      // toolbar_bg: "#1a1a1a",
      overrides: {
        "paneProperties.backgroundType": "#1a1a1a",
        "paneProperties.background": "#1a1a1a",
        "paneProperties.backgroundType": "solid", 
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

    };

    const tvWidget = new widget(widgetOptions);
    window.tvWidget = tvWidget;
    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
      console.log("Chart is ready");
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, [selectedSymbol]);


  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%", }} />;
};

export default memo(Chart);;


