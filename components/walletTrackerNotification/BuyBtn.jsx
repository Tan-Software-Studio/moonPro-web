"use client";
import React, { useEffect, useState } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { useDispatch, useSelector } from "react-redux";
import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";
export default function BuyBtn({ toToken }) {
  const [nativeTokenbalance, setNativeTokenbalance] = useState(0);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
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
    <button
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
      className="bg-green-500 hover:bg-green-600 rounded-md py-2 px-6 text-sm"
    >
      Buy
    </button>
  );
}
