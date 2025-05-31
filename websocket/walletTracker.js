import { setAiSignalData } from "@/app/redux/AiSignalDataSlice/AiSignal.slice";
import { addNewTransactionForWalletTracking } from "@/app/redux/chartDataSlice/chartData.slice";
import { updatePnlDataPriceOnly } from "@/app/redux/holdingDataSlice/holdingData.slice";
import {
  setMemeScopeGraduateData,
  setMemeScopeGraduatedData,
  setNewLaunchData,
  updateAllDataByNode,
} from "@/app/redux/memescopeData/Memescope";
import { setSolanaLivePrice, setUsdcLivePrice } from "@/app/redux/states";
import store from "@/app/redux/store";
import {
  updateTrendingData,
  updateTrendingLiveData,
} from "@/app/redux/trending/solTrending.slice";
import axios from "axios";
import { io } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
const BASE_URL_MOON = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL_SOCKET;
const BASE_URL_AI_SIGNAL = process.env.NEXT_PUBLIC_AI_SIGNAL_BASE_URL;
// connection with wavecore 
export const socket = io(BASE_URL, {
  transports: ["websocket"],
});
// connection with mooncore
export const socketMoonCore = io(BASE_URL_MOON, {
  transports: ["websocket"]
})
// connect with ai-signal-backend
export const socketAiSignalBackend = io(BASE_URL_AI_SIGNAL, {
  transports: ["websocket"]
})

let isSocketOn = false;
let isSocketOnMoon = false;
let isSocketOnAISignalCore = false;
let isTrendingSocketOn = false;
export async function subscribeToWalletTracker() {
  try {
    // const token = localStorage.getItem("token");
    // let wallets = null;
    try {
      // if (token) {
      //   wallets = await axios({
      //     method: "get",
      //     url: `${BASE_URL_MOON}wallettracker/walletTracking`,
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // }
    } catch (error) { }
    // let walletsToTrack = [];
    // if (wallets?.data?.data?.wallets?.length > 0) {
    //   await wallets?.data?.data?.wallets?.map((item) => {
    //     if (item?.alert == true) {
    //       walletsToTrack.push(item?.walletAddress?.toLowerCase());
    //     }
    //   });
    // }
    if (isSocketOn) {
      console.log("Trades websocket is already connected.");
      return;
    }
    await socket.connect();
    isSocketOn = true;
    await socket.on("connect", () => {
      console.log("Trades websocket connected.");
    });
    // solana wallet address
    let solanaWalletAddress = 0;
    store.subscribe(() => {
      solanaWalletAddress = store?.getState()?.AllStatesData?.solWalletAddress;
    });
    // watch all solana trades
    await socket.on("new_trades", async (data) => {
      // console.log("🚀 ~ socket.on ~ data:", data?.length);
      // send data to update pnl
      if (solanaWalletAddress) {
        store.dispatch(updatePnlDataPriceOnly(data));
      }
      const solPrice = await data?.find(
        (item) =>
          item?.Trade?.Currency?.MintAddress ==
          "So11111111111111111111111111111111111111112"
      );
      const usdcLivePrice = await data?.find(
        (item) =>
          item?.Trade?.Currency?.MintAddress ==
          "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      if (solPrice?.Trade?.PriceInUSD) {
        store.dispatch(setSolanaLivePrice(solPrice?.Trade?.PriceInUSD));
      }
      if (usdcLivePrice?.Trade?.PriceInUSD) {
        store.dispatch(setUsdcLivePrice(solPrice?.Trade?.PriceInUSD));
      }
      // if (walletsToTrack?.length > 0) {
      //   const filteredData = await data?.filter((item) =>
      //     walletsToTrack.includes(item?.Transaction?.Signer?.toLowerCase())
      //   );
      //   if (filteredData?.length > 0) {
      //     // console.log("🚀 ~ socket.on ~ filteredData:", filteredData);
      //     let finalFilteredData = [];
      //     for (const item of filteredData) {
      //       const walletName = await wallets?.data?.data?.wallets?.find(
      //         (item1) => item?.Transaction?.Signer === item1?.walletAddress
      //       );
      //       finalFilteredData.push({
      //         ...item,
      //         tag: walletName?.walletName,
      //       });
      //     }
      //     store.dispatch(addNewTransactionForWalletTracking(finalFilteredData));
      //   }
      // }
    });
    socket.on("disconnect", async () => {
      console.log("Trades webSocket disconnected.");
      isSocketOn = false;
    });
  } catch (error) {
    console.log("🚀 ~ subscribeToWalletTracker ~ error:", error?.message);
  }
}
export async function subscribeToTrendingTokens() {
  try {
    if (isTrendingSocketOn) {
      console.log("Trades websocket is already connected.");
      return;
    }
    await socket.connect();
    isTrendingSocketOn = true;
    await socket.on("connect", () => {
      console.log("Trades websocket connected.");
    });

    // new launch pumpfun data
    socket.on("newData", async (data) => {
      store.dispatch(setNewLaunchData(data));
    });

    // trending tokens live data
    await socket.on("trendingtokens", async (data) => {
      switch (data?.time) {
        case "1+m":
          store.dispatch(
            updateTrendingData({ time: "1m", data: data?.tokens })
          );
          break;
        case "5+m":
          store.dispatch(
            updateTrendingData({ time: "15m", data: data?.tokens })
          );
          break;
        case "30+m":
          store.dispatch(
            updateTrendingData({ time: "30m", data: data?.tokens })
          );
          break;
        case "1+h":
          store.dispatch(
            updateTrendingData({ time: "1h", data: data?.tokens })
          );
          break;
        default:
          break;
      }
    });

    // for updated memsoce data
    socket.on("memescoptokens", async (data) => {
      // console.log("🚀 ~ socket.on ~ data:", data?.type)
      if (data?.type == "graduate") {
        store.dispatch(setMemeScopeGraduateData(data?.tokens));
      } else if (data?.type == "graduated") {
        store.dispatch(setMemeScopeGraduatedData(data?.tokens));
      }
    });

    // live solana price
    let liveSolanaPrice = 0;
    // solana wallet address
    store.subscribe(() => {
      liveSolanaPrice = store?.getState()?.AllStatesData?.solanaLivePrice;
    });

    // gRPC node data
    socket.on("gRPC_node_tx", async (data) => {
      if (data?.action == "buy") {
        if (
          data?.bought?.mint != "So11111111111111111111111111111111111111112"
        ) {
          const solAmountInUsd = data?.priceInSolOfToken * liveSolanaPrice;
          store.dispatch(
            updateAllDataByNode({
              type: "buy",
              price: solAmountInUsd,
              mint: data?.bought?.mint,
              amount: data?.bought?.uiTokenAmount?.amount,
              holderAction: data?.holder,
            })
          );
          store.dispatch(
            updateTrendingLiveData({
              type: "buy",
              price: solAmountInUsd,
              mint: data?.bought?.mint,
              amount: data?.bought?.uiTokenAmount?.amount,
              holderAction: data?.holder,
            })
          );
        }
      } else if (data?.action == "sell") {
        if (data?.sold?.mint != "So11111111111111111111111111111111111111112") {
          const solAmountInUsd = data?.priceInSolOfToken * liveSolanaPrice;
          store.dispatch(
            updateAllDataByNode({
              type: "sell",
              price: solAmountInUsd,
              mint: data?.sold?.mint,
              amount: data?.sold?.uiTokenAmount?.amount,
              holderAction: data?.holder,
            })
          );
          store.dispatch(
            updateTrendingLiveData({
              type: "sell",
              price: solAmountInUsd,
              mint: data?.sold?.mint,
              amount: data?.sold?.uiTokenAmount?.amount,
              holderAction: data?.holder,
            })
          );
        }
      }
    });
  } catch (error) {
    console.log("🚀 ~ subscribeToTrendingTokens ~ error:", error?.message);
  }
}

export async function subscribeToAiSignalTokens() {
  if (isSocketOnMoon) {
    console.log("Trades websocket is already connected.");
    return;
  }
  await socketMoonCore.connect();
  isSocketOnMoon = true;
  await socketMoonCore.on("connect", () => {
    console.log("Trades websocket connected.");
  });
  socketMoonCore.on("aiSignleLiveAllDataUpdate", async (data) => {
    store.dispatch(setAiSignalData(data));
  });
}

export async function subscribeToAiSignalTokensNewAddedToken() {
  if (isSocketOnAISignalCore) {
    console.log("Trades websocket is already connected.");
    return;
  }
  await socketAiSignalBackend.connect();
  isSocketOnAISignalCore = true;
  await socketAiSignalBackend.on("connect", () => {
    console.log("Trades websocket connected.");
  });
  let aiSignalDataFromStore = [];
  store.subscribe(() => {
    aiSignalDataFromStore = store?.getState().aiSignal.aiSignalData;
  });
  socketAiSignalBackend.on("aiSignleLiveData", async (data) => {
    console.log("🚀 ~ socketAiSignalBackend.on ~ data:", data)
    let newDataArr = []
    if (data?.length >= 100) {
      newDataArr = [...data,]
    } else {
      newDataArr = [...data, ...aiSignalDataFromStore?.slice(0, 100 - data?.length)]
    }
    store.dispatch(setAiSignalData(newDataArr));
  });
}

export function unsubscribeFromWalletTracker() {
  try {
    console.log("unscribed called!");
    if (socket) {
      socket.off("new_trades");
      socket.disconnect();
      isSocketOn = false;
    }
  } catch (error) {
    console.log("🚀 ~ unsubscribeFromWalletTracker ~ error:", error)?.message;
  }
}

export function unsubscribeFromMooncore() {
  try {
    console.log("unscribed called!");
    if (socketMoonCore) {
      socketMoonCore.disconnect();
      isSocketOnMoon = false;
    }
  } catch (error) {
    console.log("🚀 ~ unsubscribeFromWalletTracker ~ error:", error)?.message;
  }
}
export function unsubscribeFromAiSignal() {
  try {
    console.log("unscribed called!");
    if (socketAiSignalBackend) {
      socketAiSignalBackend.disconnect();
      isSocketOnAISignalCore = false;
    }
  } catch (error) {
    console.log("🚀 ~ unsubscribeFromWalletTracker ~ error:", error)?.message;
  }
}
