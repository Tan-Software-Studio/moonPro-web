import { addNewTransactionForWalletTracking } from "@/app/redux/chartDataSlice/chartData.slice";
import store from "@/app/redux/store";
import axios from "axios";
import { io } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
const socket = io(BASE_URL, {
  transports: ["websocket"],
});
let isSocketOn = false;
export async function subscribeToWalletTracker(user) {
  try {
    const wallets = await axios({
      method: "get",
      url: `${BASE_URL}wavePro/users/walletTracking`,
      headers: {
        user,
      },
    });
    let walletsToTrack = [];
    await wallets?.data?.data?.map((item) => {
      if (item?.alert == true) {
        walletsToTrack.push(item?.walletAddress?.toLowerCase());
      }
    });
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
      // console.log("🚀 ~ socket.on ~ data:", data[0]);
      // await store.dispatch(addNewTransactionForWalletTracking(data[0]));
      const filteredData = await data?.filter((item) =>
        walletsToTrack.includes(item?.Transaction?.Signer?.toLowerCase())
      );
      if (filteredData?.length > 0) {
        // console.log("🚀 ~ socket.on ~ filteredData:", filteredData);
        let finalFilteredData = [];
        for (const item of filteredData) {
          const walletName = await wallets?.data?.data?.find(
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
