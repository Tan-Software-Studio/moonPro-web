import { addNewTransactionForWalletTracking } from "@/app/redux/chartDataSlice/chartData.slice";
import {
  setMemeScopeGraduateData,
  setMemeScopeGraduatedData,
} from "@/app/redux/memescopeData/Memescope";
import store from "@/app/redux/store";
import { updateTrendingData } from "@/app/redux/trending/solTrending.slice";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
const BASE_URL_MOON = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
export const socket = io(BASE_URL, {
  transports: ["websocket"],
});
let isSocketOn = false;
let isTrendingSocketOn = false;
export async function subscribeToWalletTracker() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login");
    const wallets = await axios({
      method: "get",
      url: `${BASE_URL_MOON}wallettracker/walletTracking`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let walletsToTrack = [];
    await wallets?.data?.data?.wallets?.map((item) => {
      if (item?.alert == true) {
        walletsToTrack.push(item?.walletAddress?.toLowerCase());
      }
    });
    if (isSocketOn) {
      console.log("Trades websocket is already connected.");
      return;
    }
    await socket.connect();
    isSocketOn = true;
    await socket.on("connect", () => {
      console.log("Trades websocket connected.");
    });
    // watch all solana trades
    await socket.on("new_trades", async (data) => {
      // console.log("🚀 ~ socket.on ~ data:", data?.length);
      // await store.dispatch(addNewTransactionForWalletTracking(data[0]));
      const filteredData = await data?.filter((item) =>
        walletsToTrack.includes(item?.Transaction?.Signer?.toLowerCase())
      );
      if (filteredData?.length > 0) {
        // console.log("🚀 ~ socket.on ~ filteredData:", filteredData);
        let finalFilteredData = [];
        for (const item of filteredData) {
          const walletName = await wallets?.data?.data?.wallets?.find(
            (item1) => item?.Transaction?.Signer === item1?.walletAddress
          );
          finalFilteredData.push({
            ...item,
            tag: walletName?.walletName,
          });
        }
        await store.dispatch(
          addNewTransactionForWalletTracking(finalFilteredData)
        );
      }
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
    // trending tokens live data
    await socket.on("trendingtokens", async (data) => {
      switch (data?.time) {
        case "1+min":
          store.dispatch(
            updateTrendingData({ time: "1m", data: data?.tokens })
          );
          break;
        case "5+min":
          store.dispatch(
            updateTrendingData({ time: "5m", data: data?.tokens })
          );
          break;
        case "30+min":
          store.dispatch(
            updateTrendingData({ time: "30m", data: data?.tokens })
          );
          break;
        case "1+hr":
          store.dispatch(
            updateTrendingData({ time: "1h", data: data?.tokens })
          );
          break;
        case "6+hr":
          store.dispatch(
            updateTrendingData({ time: "6h", data: data?.tokens })
          );
          break;
        case "24+hr":
          store.dispatch(
            updateTrendingData({ time: "24h", data: data?.tokens })
          );
          break;
        default:
          break;
      }
    });
    // for updated memsoce data
    socket.on("memescoptokens", async (data) => {
      if (data?.type == "graduate") {
        store.dispatch(setMemeScopeGraduateData(data?.tokens));
      } else if (data?.type == "graduated") {
        store.dispatch(setMemeScopeGraduatedData(data?.tokens));
      }
    });
  } catch (error) {
    console.log("🚀 ~ subscribeToTrendingTokens ~ error:", error?.message);
  }
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
