import { addNewTransaction } from "@/app/redux/chartDataSlice/chartData.slice";
import store from "@/app/redux/store";
import { io } from "socket.io-client";
import { addFlagToChart } from "./chartFlagDraw";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
const socket = io(BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
let lastBar = {};
let isSocketOn = false;
let activeSubscriberUID = null;
let currentResolution = null;
function getResolutionInMilliseconds(resolution) {
  if (!resolution) return 60000;
  if (resolution === "1D") return 86400000;
  if (resolution.endsWith("D")) return parseInt(resolution) * 86400000;
  if (resolution.endsWith("H")) return parseInt(resolution) * 3600000;
  if (resolution.endsWith("S")) return parseInt(resolution) * 1000;
  return parseInt(resolution) * 60000;
}
export async function subscribeToWebSocket(
  onRealtimeCallback,
  token,
  resolution = "1",
  subscriberUID,
  usdActive,
  marketCapActive,
  supply,
  solPrice,
) {
  const tvWidget = window?.tvWidget;
  if (
    activeSubscriberUID !== subscriberUID ||
    currentResolution !== resolution
  ) {
    // Cleanup previous
    unsubscribeFromWebSocket();
    activeSubscriberUID = subscriberUID;
    currentResolution = resolution;
    lastBar[subscriberUID] = null;
  }
  if (!isSocketOn) {
    socket.connect();
    isSocketOn = true;
    socket.on("connect", () => {
      console.log("Trades websocket connected.");
    });
    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
    });
    socket.io.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });
    socket.on("disconnect", () => {
      console.log("Trades websocket disconnected.");
      isSocketOn = false;
    });
  }
  socket.off("new_trades");
  socket.on("new_trades", async (data) => {
    if (!Array.isArray(data)) return;
    const tokenData = data.filter(
      (item) =>
        item?.Trade?.Currency?.MintAddress === token && item?.Trade?.open
    );
    if (!tokenData.length) return;
    store.dispatch(addNewTransaction(...tokenData));
    const granularity = getResolutionInMilliseconds(resolution);
    const isSecondResolution = resolution.toString().endsWith("S");
    supply = supply ? Number(supply) === 0 ? 1_000_000_000 : Number(supply) : 1_000_000_000;
    solPrice = solPrice ? Number(solPrice) === 0 ? 1 : Number(solPrice) : 1; 
    tokenData.forEach((item) => {
      const signer = item?.Transaction?.Signer;
      const tradeTime = new Date(item?.Block?.Time).getTime();
      const volume = parseFloat(item?.volume || "0");

      const usdSolprice = usdActive ? parseFloat(item?.Trade?.open || "0") : parseFloat(item?.Trade?.open || "0") / solPrice;
      const price = marketCapActive ? usdSolprice * supply : usdSolprice;

      const usdSolHigh = usdActive ?  parseFloat(item?.high || price) :  parseFloat(item?.high || price) / solPrice;
      const high = marketCapActive ? usdSolHigh * supply : usdSolHigh;

      const usdSolLow = usdActive ?  parseFloat(item?.low || price) :  parseFloat(item?.low || price) / solPrice;
      const low = marketCapActive ? usdSolLow * supply : usdSolLow;

      const usdSolClose = usdActive ?  parseFloat(item?.Trade?.close || price) :  parseFloat(item?.Trade?.close || price) / solPrice;
      const close = marketCapActive ?  usdSolClose * supply : usdSolClose;
      
      const roundedTime = Math.floor(tradeTime / granularity) * granularity;
      if (
        !lastBar[subscriberUID] ||
        lastBar[subscriberUID].time !== roundedTime
      ) {
        // New bar
        if (lastBar[subscriberUID]) {
          onRealtimeCallback(lastBar[subscriberUID]);
        }
        let newOpen = price;
        let newClose = close;
        if (isSecondResolution && lastBar[subscriberUID]) {
          const prevClose = lastBar[subscriberUID].close;
          newOpen = prevClose;
          if (prevClose > close) {
            // bearish
            newClose = Math.min(close, prevClose);
          } else if (prevClose < close) {
            // bullish
            newClose = Math.max(close, prevClose);
          }
        }
        lastBar[subscriberUID] = {
          time: roundedTime,
          open: newOpen,
          high: Math.max(newOpen, newClose, high),
          low: Math.min(newOpen, newClose, low),
          close: newClose,
          volume: volume,
        };
      } else {
        // Update existing bar
        let bar = lastBar[subscriberUID];
        bar.high = Math.max(bar.high, high);
        bar.low = Math.min(bar.low, low);
        bar.close = close;
        bar.volume += volume;
      }
      if (signer === "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa") {
        console.log("🚀 ~ tokenData.forEach ~ signer:", signer);
        if (tvWidget) {
          const chart = tvWidget.activeChart();
          addFlagToChart(chart, tradeTime, price);
        }
      }
      onRealtimeCallback(lastBar[subscriberUID]);
    });
  });
}
export function unsubscribeFromWebSocket() {
  try {
    // socket.off("new_trades");
    // socket.disconnect();
    // isSocketOn = false;
    lastBar = {};
    activeSubscriberUID = null;
    currentResolution = null;
    console.log("WebSocket unsubscribed and disconnected.");
  } catch (error) {
    console.error("unsubscribeFromWebSocket error:", error?.message);
  }
}
