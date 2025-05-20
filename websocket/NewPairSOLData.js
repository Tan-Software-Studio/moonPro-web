"use client";
import {
  setMemeScopeGraduateData,
  setMemeScopeGraduatedData,
} from "@/app/redux/memescopeData/Memescope";
import { addWebSocketData } from "@/app/redux/newpair/NewPairData";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "./walletTracker";
const NewPairSOLData = () => {
  if (!socket) {
    console.log("socket is not active");
    return;
  }
  const dispatch = useDispatch();
  const [checkSocetOn, setCheckSocetOn] = useState(false);
  async function startWebSocketConnection() {
    if (checkSocetOn) {
      console.log("WebSocket is already connected.");
      return;
    }

    await setCheckSocetOn(true); // Mark as connected
    socket.on("newData", async (data) => {
      // console.log("Received new data:", data);
      setTimeout(() => {
        dispatch(addWebSocketData(data));
      }, 10);
    });

    // for updated memsoce data
    socket.on("memescoptokens", async (data) => {
      if (data?.type == "graduate") {
        dispatch(setMemeScopeGraduateData(data?.tokens));
      } else if (data?.type == "graduated") {
        dispatch(setMemeScopeGraduatedData(data?.tokens));
      }
    });
    socket.on("disconnect", async () => {
      console.log("WebSocket disconnected.");
      await setCheckSocetOn(false); // Reset flag on disconnect
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
