import React, { useEffect, useRef } from "react";
import { widget } from "../../public/charting_library";
import Datafeed from "../../utils/tradingViewChartServices/customDatafeed";
import { intervalTV } from "../../utils/tradingViewChartServices/constant";
import { unsubscribeFromWebSocket } from "@/utils/tradingViewChartServices/websocketOHLC";

const TVChartContainer = ({ tokenSymbol, tokenaddress }) => {
  const chartContainerRef = useRef(null);
  // console.log("TVChartContainer called.");
  useEffect(() => {
    // console.log("TVChartContainer useEffect called.");
    // console.log("widgetOptions:", widgetOptions);
    const tvWidget = new widget({
      symbol: tokenSymbol,
      datafeed: Datafeed,
      tokenAddress: tokenaddress,
      interval: "1",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      locale: "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "time_scale_controls",
      ],
      enabled_features: ["study_templates", "seconds_resolution"],
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
      pricescale: 1000000000,
      theme: "dark",
      overrides: {
        "paneProperties.backgroundGradientStartColor": "#08080e",
        "paneProperties.backgroundGradientEndColor": "#08080e",
        "paneProperties.vertGridProperties.color": "#1f1f1f",
        "paneProperties.horzGridProperties.color": "#1f1f1f",
        "scalesProperties.textColor": "#FFFFFF",
        "mainSeriesProperties.candleStyle.wickUpColor": "#FFFFFF",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FFFFFF",
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
      },
    });
    // console.log("TradingView widget initialized.", tvWidget);
    tvWidget.onChartReady(() => {
      // console.log("Chart has loaded!");
      const priceScale = tvWidget
        .activeChart()
        .getPanes()[0]
        .getMainSourcePriceScale();
      priceScale.setAutoScale(true);
    });
    return () => {
      if (tvWidget) {
        console.log("Removing TradingView widget.");
        tvWidget.remove();
      }
      // Unsubscribe from WebSocket when component unmounts
      unsubscribeFromWebSocket();
    };
  }, [tokenSymbol, tokenaddress]);

  return <div ref={chartContainerRef} className="h-full w-full bg-[#08080E]" />;
};

export default TVChartContainer;

// dummy chart

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const TradingChart = () => {
//   const searchParams = useSearchParams();
//   const tokenSymbol = searchParams.get("symbol");

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://s3.tradingview.com/tv.js";
//     script.async = true;
//     script.onload = () => {
//       new window.TradingView.widget({
//         width: "100%",
//         height: "100%",
//         symbol: tokenSymbol || "USDT",
//         interval: "D",
//         withdateranges: true,
//         locale: "en",
//         timezone: "Etc/UTC",
//         theme: "dark",
//         range: "YTD",
//         details: false,
//         hotlist: false,
//         calendar: false,
//         hide_side_toolbar: false,
//         style: "1",
//         locale: "en",
//         toolbar_bg: "#f1f3f6",
//         enable_publishing: false,
//         allow_symbol_change: true,
//         container_id: "tradingview_chart",
//       });
//     };
//     document.getElementById("tradingview_chart").appendChild(script);
//   }, [tokenSymbol]);

//   const tokenPopup = useSelector(
//     (state) => state?.AllthemeColorData?.tokenPopup
//   );

//   return (
//     <>
//       <div
//         id="tradingview_chart"
//         className={`w-full ${tokenPopup && "-z-50"} !h-[65vh] overflow-y-auto`}
//       ></div>
//     </>
//   );
// };

// export default TradingChart;
