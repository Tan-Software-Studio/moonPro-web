"use client";
import React, { useEffect } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolanaNativeBalance } from "@/app/redux/states";
export default function BuyBtn({ toToken,price }) {
  const dispatch = useDispatch();
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
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
    <button
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          solanaLivePrice,
          toToken,
          solWalletAddress,
          nativeTokenbalance,
          e,
          toToken,
          dispatch,
          price
        )
      }
      className="border-[#21CB6B] border-[1px] hover:text-white transition-all ease-in-out cursor-pointer text-[#21CB6B] duration-300 hover:bg-[#21CB6B] rounded-md py-2 px-6 text-sm"
    >
      Buy
    </button>
  );
}
