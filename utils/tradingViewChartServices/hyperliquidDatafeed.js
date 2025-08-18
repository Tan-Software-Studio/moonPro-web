import axios from "axios";

let socket = null;
let latestBar = null;


export default function hyperliquidDatafeed(selectedSymbol) {
    const configurationData = {
        supports_group_request: false,
        supports_marks: true,
        supports_timescale_marks: true,
        supports_time: true,
        supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W"],
    };

    return {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData), 0);
        },

        resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
            setTimeout(() => {
                if (symbolName === selectedSymbol) {
                    onSymbolResolvedCallback({
                        ticker: selectedSymbol,
                        name: selectedSymbol,
                        description: `${selectedSymbol}/USD`,
                        type: 'crypto',
                        session: '24x7',
                        timezone: 'Etc/UTC',
                        exchange: 'Hyperliquid',
                        minmov: 1,
                        pricescale: 100,
                        has_intraday: true,
                        visible_plots_set: 'ohlcv',
                        has_weekly_and_monthly: true,
                        has_empty_bars: false,
                        supported_resolutions: configurationData.supported_resolutions,
                        volume_precision: 2,
                        data_status: 'streaming',
                    });
                } else {
                    onResolveErrorCallback("Unknown symbol");
                }
            }, 50);
        },

        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
            try {
                const { from, to } = periodParams;
                const resolutionMap = {
                    "1": "1m",
                    "5": "5m",
                    "15": "15m",
                    "30": "30m",
                    "60": "1h",
                    "240": "4h",
                    "1D": "1d",
                    "1W": "1w",
                };
                const interval = resolutionMap[resolution] || "1m";

                const url = "https://api.hyperliquid.xyz/info";

                const payload = {
                    type: "candleSnapshot",
                    req: {
                        coin: symbolInfo?.name,
                        interval,
                        startTime: 0,          
                        endTime: Date.now()
                    }
                };

                const { data } = await axios.post(url, payload);

                if (data?.length) {
                    const bars = data.map(candle => ({
                        time: candle.t,                     // start time in ms
                        open: parseFloat(candle.o),
                        high: parseFloat(candle.h),
                        low: parseFloat(candle.l),
                        close: parseFloat(candle.c),
                        volume: parseFloat(candle.v)
                    }));

                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback([], { noData: true });
                }

            } catch (err) {
                console.error("getBars error", err);
                onErrorCallback(err);
            }
        }
        ,

        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {

            socket = new WebSocket("wss://api.hyperliquid.xyz/ws");

            const resolutionMap = {
                "1": "1m",
                "5": "5m",
                "15": "15m",
                "30": "30m",
                "60": "1h",
                "240": "4h",
                "1D": "1d",
                "1W": "1w",
            };
            const interval = resolutionMap[resolution] || "1m";

            socket.onopen = () => {
                const subMsg = {
                    method: "subscribe",
                    subscription: {
                        type: "candle",
                        coin: symbolInfo?.name,
                        interval,
                    },
                };
                socket.send(JSON.stringify(subMsg));
                // console.log("✅ WebSocket connected");
            };
            socket.onmessage = (event) => {
                try {
                    const kline = JSON.parse(event.data);
                    if (kline) {
                        const bar = {
                            time: kline?.data?.T,
                            open: parseFloat(kline?.data?.o),
                            high: parseFloat(kline?.data?.h),
                            low: parseFloat(kline?.data?.l),
                            close: parseFloat(kline?.data?.c),
                            volume: parseFloat(kline?.data?.v),
                        };
                        latestBar = bar;
                        onRealtimeCallback(bar);
                    }
                } catch (err) {
                    console.error("Chart WebSocket message parse error", err);
                }
            };

            socket.onerror = (err) => {
                console.error("Chart WebSocket error", err);
            };

            socket.onclose = () => {
                // console.log("📴 WebSocket connection closed.");
            };
        },

        unsubscribeBars: (subscriberUID) => {
            // console.log("❌ Unsubscribing...");
            if (socket) {
                socket.close();
                socket = null;
            }
        },
    };
}
