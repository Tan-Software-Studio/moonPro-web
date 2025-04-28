"use client";
import { addWebSocketData } from "@/app/redux/newpair/NewPairData";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
const socket = io(BASE_URL, {
  transports: ["websocket"],
});
const NewPairSOLData = () => {
  const dispatch = useDispatch();
  const [checkSocetOn, setCheckSocetOn]=useState(false)
  async function startWebSocketConnection() {
    if (checkSocetOn) {
      console.log("WebSocket is already connected.");
      return;
    }

    await setCheckSocetOn(true) // Mark as connected

    socket.on("newData", async (data) => {
      // console.log("Received new data:", data);
      setTimeout(() => {
        dispatch(addWebSocketData(data));
      }, 10);
    });

    socket.on("disconnect", async() => {
      console.log("WebSocket disconnected.");
      await setCheckSocetOn(false) // Reset flag on disconnect
    });
  }
  // Automatically start the connection on mount and clean up on unmount
  useEffect(() => {
    startWebSocketConnection();

    return () => {
      socket.off("newData");
    };
  }, []);

  return () => {
    socket.off("newData");
  };
};

export default NewPairSOLData;
