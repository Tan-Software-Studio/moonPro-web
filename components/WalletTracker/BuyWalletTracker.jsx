"use client";
import React, { useEffect } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolanaNativeBalance } from "@/app/redux/states";
export default function BuyWalletTracker({ solWalletAddress, toToken, price, name, symbol }) {
  const dispatch = useDispatch();
  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance);
  // solana live price 
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(fetchSolanaNativeBalance(solWalletAddress));
    }
  }, [solWalletAddress]);
  return (
    <div
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          solanaLivePrice,
          toToken,
          solWalletAddress,
          nativeTokenbalance,
          e,
          toToken,
          dispatch,
          price,
          {
            name: name,
            symbol: symbol,
            img: null
          }
        )
      }
      className="text-[#278BFE] text-[12px] cursor-pointer"
    >
      Quick buy
    </div>
  );
}
