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
    <div className="flex justify-between items-center bg-[#1c1d24] p-3 rounded-md border border-gray-700">
      <div key={tx.id}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">
              {getRandomEmoji()} {tx?.tag}
            </span>
            <span className="text-gray-500 text-sm">{relativeTime}</span>
          </div>
        </div>
        <div className="text-sm mt-2 flex gap-1 items-center">
          <span className="text-white">
            {tx?.Trade?.Side?.Type?.toUpperCase()}
          </span>
          <span
            className={`${
              tx?.Trade?.Side?.Type === "buy"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            ${Number(tx?.Trade?.AmountInUSD).toFixed(2)}
          </span>
          <span className="relative inline-flex items-center justify-center h-6 w-6 rounded-full bg-black border border-gray-500 text-white font-bold text-xs uppercase">
            {tx?.Trade?.Currency?.Name?.charAt(0)}
          </span>
          <span className="font-bold">{tx?.Trade?.Currency?.Name}</span>
        </div>
        <div className="text-white text-xs">
          Price:{" "}
          <span className="text-yellow-400">
            {Number(tx?.Trade?.PriceInUSD).toFixed(5)}
          </span>
        </div>
      </div>
      <div>
        {tx?.Trade?.Side?.Type === "buy" ? (
          <BuyBtn toToken={tx?.Trade?.Currency?.MintAddress} />
        ) : (
          <SellBtn fromToken={tx?.Trade?.Currency?.MintAddress} />
        )}
      </div>
    </div>
  );
};

export default MainWalletTrackingNotificationPopUp;
