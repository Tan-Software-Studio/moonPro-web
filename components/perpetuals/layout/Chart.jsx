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
      theme: "Dark",
      // toolbar_bg: "#08080E",
      overrides: {
        "paneProperties.background": "#08080E",
        "paneProperties.backgroundGradientStartColor": "#08080E",
        "paneProperties.backgroundGradientEndColor": "#08080E",
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


  return <div ref={chartContainerRef} className="bg-[#08080E]" style={{ height: "100%", width: "100%", background : "#08080E"}} />;
};

export default memo(Chart);;


