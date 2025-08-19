"use client";
import React, { useEffect, useRef, memo } from "react";
import { widget } from "@/public/charting_library";
import hyperliquidDatafeed from "@/utils/tradingViewChartServices/hyperliquidDatafeed";
function Chart({ selectedSymbol }) {
  const chartContainerRef = useRef(null);
  const tvWidgetRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (tvWidgetRef.current) {
      tvWidgetRef.current.remove();
      tvWidgetRef.current = null;
    }

    const Datafeed = hyperliquidDatafeed(selectedSymbol);
    const widgetOptions = {
      symbol: selectedSymbol,
      interval: "1",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      datafeed: Datafeed,
      locale: "en",
      disabled_features: [
        "header_saveload",
        "use_localstorage_for_settings",
        "time_scale_controls",
        "popup_hints",
      ],
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
      fullscreen: false,
      autosize: true,
      timezone: "Asia/Kolkata",
      theme: "dark",
      toolbar_bg: "#08080E",
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

  return (
    <div
      ref={chartContainerRef}
      className="bg-[#08080E]"
      style={{ backgroundColor: "#08080E", height: "100%", width: "100%" }}
    />
  );
}

export default memo(Chart);
