"use client";
import React, { useEffect } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { useDispatch, useSelector } from "react-redux";
import { setSolanaNativeBalance } from "@/app/redux/states";
export default function BuyWalletTracker({ solWalletAddress, toToken }) {
  const dispatch = useDispatch()
  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance)
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(setSolanaNativeBalance())
    }
  }, [solWalletAddress]);
  return (
    <div
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          toToken,
          solWalletAddress,
          nativeTokenbalance,
          e,
          toToken,
          dispatch
        )
      }
      className="text-[#278BFE] text-[12px] cursor-pointer"
    >
      Quick buy
    </div>
  );
}
