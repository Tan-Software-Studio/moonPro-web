"use client";
import React, { useEffect, useState } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";
export default function BuyWalletTracker({ solWalletAddress, toToken }) {
  const [nativeTokenbalance, setNativeTokenbalance] = useState(0);
  async function getSolanaBalance() {
    const solBalance = await getSolanaBalanceAndPrice(solWalletAddress);
    setNativeTokenbalance(solBalance);
  }
  useEffect(() => {
    if (solWalletAddress) {
      getSolanaBalance();
    }
  }, [solWalletAddress]);
  return (
    <div
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          toToken,
          solWalletAddress,
          nativeTokenbalance,
          setNativeTokenbalance,
          e,
          toToken
        )
      }
      className="text-[#278BFE] text-[12px] cursor-pointer"
    >
      Quick buy
    </div>
  );
}
