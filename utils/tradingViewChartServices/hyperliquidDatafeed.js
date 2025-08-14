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
                // "BTCUSDT",
                const params = {
                    symbol: `${symbolInfo?.name}USDT`,
                    interval,
                    startTime: from * 1000,
                    endTime: to * 1000,
                    limit: 1000,
                };

                const { data } = await axios.get("https://fapi.asterdex.com/fapi/v1/klines", {
                    params,
                    headers: {
                        apiKey: "4c266fd53bf07ed37834538e6d4ab33961a4efc736d88d688252c77b39eb28c3",
                        secretKey: "51412dd92f82b54be5c70dd2e02145a826af31caeb1803520b34998879bcb72ds",
                    },
                });

                if (!Array.isArray(data) || data.length === 0) {
                    onHistoryCallback([], { noData: true });
                    return;
                }

                const bars = data.map(d => ({
                    time: d[0],
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                    volume: parseFloat(d[5]),
                }));

                bars.sort((a, b) => a.time - b.time);
                latestBar = bars[bars.length - 1];
                onHistoryCallback(bars, { noData: false });

            } catch (err) {
                console.error("getBars error", err);
                onErrorCallback(err);
            }
        },

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
