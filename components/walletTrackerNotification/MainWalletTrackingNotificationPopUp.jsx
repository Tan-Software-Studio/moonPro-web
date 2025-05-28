"use client";
import React, { useState, useEffect } from "react";
import BuyBtn from "./BuyBtn";
import SellBtn from "./SellBtn";

const getRelativeTime = (timestamp) => {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);
  const diffInSeconds = Math.floor((currentTime - pastTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s `;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  } else {
    return `${Math.floor(diffInSeconds / 3600)}h `;
  }
};

const MainWalletTrackingNotificationPopUp = ({ tx }) => {
  const emojis = [
    "😀",
    "🤑",
    "😱",
    "🤗",
    "😎",
    "😉",
    "🤔",
    "😏",
    "😪",
    "🥱",
    "😥",
    "😒",
    "😜",
  ];
  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  };
  const [relativeTime, setRelativeTime] = useState(() =>
    getRelativeTime(tx?.Block?.Time)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(tx?.Block?.Time));
    }, 1000);

    return () => clearInterval(interval);
  }, [tx?.Block?.Time]);

  return (
    <div className="flex justify-between items-center sm:p-3 py-1  border-b-[1px] border-[#404040]">
      <div key={tx.id}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-[#FFFFFF] text-base font-light">
              {tx?.tag}
            </span>
          </div>
        </div>
        <div className="text-sm mt-2 flex gap-1 items-center">
          <div className="text-white">
            Just {tx?.Trade?.Side?.Type?.toUpperCase()}
          </div>
          <div
            className={`${
              tx?.Trade?.Side?.Type === "buy"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            ${Number(tx?.Trade?.AmountInUSD).toFixed(2)}
          </div>
          <div className="relative inline-flex items-center justify-center h-6 w-6 rounded-full bg-black border border-gray-500 text-white font-bold text-xs uppercase">
            {tx?.Trade?.Currency?.Name?.charAt(0)}
          </div>
          <div className="font-bold">{tx?.Trade?.Currency?.Name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {tx?.Trade?.Side?.Type === "buy" ? (
          <BuyBtn
            toToken={tx?.Trade?.Currency?.MintAddress}
            price={tx?.Trade?.PriceInUSD}
          />
        ) : (
          <SellBtn
            fromToken={tx?.Trade?.Currency?.MintAddress}
            price={tx?.Trade?.PriceInUSD}
          />
        )}
        <div className="text-[#6E6E6E] text-sm">{relativeTime}</div>
      </div>
    </div>
  );
};

export default MainWalletTrackingNotificationPopUp;
