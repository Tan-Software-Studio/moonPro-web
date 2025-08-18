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

        const Datafeed = hyperliquidDatafeed(selectedSymbol)
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
            theme: "dark",
            toolbar_bg: "#08080E", 
            loading_screen: { backgroundColor: "#08080E", foregroundColor: "#ffffff" },  

            overrides: {
                 "paneProperties.background": "#08080E",
                "paneProperties.backgroundType": "solid",
                "paneProperties.vertGridProperties.color": "#1f1f1f",
                "paneProperties.horzGridProperties.color": "#1f1f1f",

                // Price scale and time scale
                "scalesProperties.textColor": "#CCCCCC",
                "scalesProperties.lineColor": "#1f1f1f",

                // Candles
                "mainSeriesProperties.candleStyle.upColor": "#0a9980",
                "mainSeriesProperties.candleStyle.downColor": "#f33547",
                "mainSeriesProperties.candleStyle.borderUpColor": "#0a9980",
                "mainSeriesProperties.candleStyle.borderDownColor": "#f33547",
                "mainSeriesProperties.candleStyle.wickUpColor": "#0a9980",
                "mainSeriesProperties.candleStyle.wickDownColor": "#f33547",

                // Crosshair
                "crossHairProperties.color": "#888",
            },

            studies_overrides: {
                // Volume indicator color
                "volume.volume.color.0": "#f33547",
                "volume.volume.color.1": "#0a9980",
                "volume.volume.transparency": 80,
                "volume.ma.linewidth": 1,
                "volume.ma.color": "#888888",
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


    return <div ref={chartContainerRef} className="bg-[#08080E]" style={{ backgroundColor: "#08080E", height: "100%", width: "100%", }} />;
};

export default memo(Chart);;


