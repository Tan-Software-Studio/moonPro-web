import { addNewTransaction } from "@/app/redux/chartDataSlice/chartData.slice";
import store from "@/app/redux/store";
import { io } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
let lastBar = null;
const socket = io(BASE_URL, {
  transports: ["websocket"],
});
let isSocketOn = false;
export async function subscribeToWebSocket(onRealtimeCallback, token) {
  // const tokenAddress = await token?.toString()?.toLowerCase();
  if (isSocketOn) {
    console.log("Trades websocket is already connected.");
    return;
  }
  socket.connect();
  isSocketOn = true;
  socket.on("connect", () => {
    console.log("Trades websocket connected.");
  });
  socket.on("new_trades", async (data) => {
    // const tokenFromChain =
    //   await data?.Trade?.Currency?.MintAddress?.toString()?.toLowerCase();
    const tokenData = await data?.filter(
      (item) => item?.Trade?.Currency?.MintAddress == token
    );
    if (Array.isArray(tokenData) && tokenData?.length > 0) {
      store.dispatch(addNewTransaction(...tokenData));
      const tradeTime = new Date(tokenData[0]?.Block?.Time).getTime();
      const price = parseFloat(tokenData[0]?.Trade?.open);
      console.log("🚀 ~ onNext ~ price:", price);
      // Round the time to the nearest minute
      const roundedTime = Math.floor(tradeTime / 60000) * 60000;
      if (!lastBar || lastBar.time !== roundedTime) {
        if (lastBar) {
          onRealtimeCallback(lastBar); // Send the finalized bar to the chart
        }

        // Start a new bar
        lastBar = {
          time: roundedTime,
          open: tokenData[0]?.Trade?.open,
          high: tokenData[0]?.high,
          low: tokenData[0]?.low,
          close: tokenData[0]?.Trade?.close,
          volume: tokenData[0]?.volume, // Can modify to include volume data if available
        };
      } else {
        // Update the OHLC data for the current minute
        lastBar.high = tokenData[0]?.high;
        lastBar.low = tokenData[0]?.low;
        lastBar.close = tokenData[0]?.Trade?.close;
        lastBar.volume = tokenData[0]?.volume; // Increment trade count (or add volume if applicable)

        // Call the callback for real-time updates
        onRealtimeCallback(lastBar);
      }
      //   tokenData?.forEach((token) => {
      //     // send bars to the chart
      //     const tradeTime = new Date(token?.Block?.Time).getTime();
      //     const price = parseFloat(token?.Trade?.open);
      //     console.log("🚀 ~ onNext ~ price:", price);
      //     // Round the time to the nearest minute
      //     const roundedTime = Math.floor(tradeTime / 60000) * 60000;
      //     if (!lastBar || lastBar.time !== roundedTime) {
      //       if (lastBar) {
      //         onRealtimeCallback(lastBar); // Send the finalized bar to the chart
      //       }

      //       // Start a new bar
      //       lastBar = {
      //         time: roundedTime,
      //         open: token?.Trade?.open,
      //         high: token?.high,
      //         low: token?.low,
      //         close: token?.Trade?.close,
      //         volume: token?.volume, // Can modify to include volume data if available
      //       };
      //     } else {
      //       // Update the OHLC data for the current minute
      //       lastBar.high = token?.high;
      //       lastBar.low = token?.low;
      //       lastBar.close = token?.Trade?.close;
      //       lastBar.volume = token?.volume; // Increment trade count (or add volume if applicable)

      //       // Call the callback for real-time updates
      //       onRealtimeCallback(lastBar);
      //     }
      //   });
    }
  });

  socket.on("disconnect", async () => {
    console.log("Trades webSocket disconnected.");
    isSocketOn = false;
  });
}
export function unsubscribeFromWebSocket() {
  try {
    if (socket) {
      socket.off("new_trades");
      socket.disconnect();
      isSocketOn = false;
    }
  } catch (error) {
    console.log("🚀 ~ unsubscribeFromWebSocket ~ error:", error)?.message;
  }
}
