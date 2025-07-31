
import axios from "axios";
export default function customDataFeed(selectedSymbol) {
  let socket = null;
  let latestBar = null;

  const configurationData = {
    supports_group_request: false,
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true,
    interval: "1",
    supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W"]
  }

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
            description: `${selectedSymbol}/USDT`,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: 'Nexa',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            visible_plots_set: 'ohlcv',
            has_weekly_and_monthly: true,
            supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W"],
            volume_precision: 2,
            data_status: 'streaming',
          });
        } else {
          onResolveErrorCallback('unknown_symbol');
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

        const params = {
          symbol: symbolInfo.ticker,
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
      // console.log("📡 subscribeBars", resolution);

      if (resolution !== "1") {
        // console.warn(`⚠️ Real-time only supported for resolution: 1`);
        return;
      }

      const symbol = selectedSymbol?.toLowerCase()
      socket = new WebSocket(`wss://fstream.asterdex.com/ws/${symbol}@kline_1m`);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message?.k) {
          const kline = message.k;
          const bar = {
            time: kline.t < 1e12 ? kline.t * 1000 : kline.t,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v),
          };
          if (bar.time > (latestBar?.time || 0)) {
            latestBar = bar;
            onRealtimeCallback(bar);
          }
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },

    unsubscribeBars: (subscriberUID) => {
      console.log("Unsubscribing from stream...");
      if (socket) {
        socket.close();
        socket = null;
      }
    },
  };
}
