import { addNewTransaction } from "@/app/redux/chartDataSlice/chartData.slice";
import store from "@/app/redux/store";
import { io } from "socket.io-client";

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
  subscriberUID
) {
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

    tokenData.forEach((item) => {
      const tradeTime = new Date(item?.Block?.Time).getTime();
      const price = parseFloat(item?.Trade?.open || "0");
      const volume = parseFloat(item?.volume || "0");
      const high = parseFloat(item?.high || price);
      const low = parseFloat(item?.low || price);
      const close = parseFloat(item?.Trade?.close || price);

      const roundedTime = Math.floor(tradeTime / granularity) * granularity;

      if (
        !lastBar[subscriberUID] ||
        lastBar[subscriberUID].time !== roundedTime
      ) {
        if (lastBar[subscriberUID]) {
          onRealtimeCallback(lastBar[subscriberUID]);
        }

        lastBar[subscriberUID] = {
          time: roundedTime,
          open: price,
          high: high,
          low: low,
          close: close,
          volume: volume,
        };
      } else {
        let bar = lastBar[subscriberUID];
        bar.high = Math.max(bar.high, high);
        bar.low = Math.min(bar.low, low);
        bar.close = close;
        bar.volume += volume;
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
