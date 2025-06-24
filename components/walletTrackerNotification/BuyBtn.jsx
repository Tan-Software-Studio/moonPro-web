"use client";
import React, { useEffect } from "react";
import { buySolanaTokensQuickBuyHandlerCopyTrading } from "@/utils/solanaBuySell/solanaBuySell";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolanaNativeBalance } from "@/app/redux/states";
export default function BuyBtn({ toToken, price, name, symbol }) {
  const dispatch = useDispatch();
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );
  // solana live price
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  useEffect(() => {
    if (activeSolWalletAddress?.wallet) {
      dispatch(fetchSolanaNativeBalance(activeSolWalletAddress?.wallet));
    }
  }, [activeSolWalletAddress]);
  return (
    <button
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          solanaLivePrice,
          toToken,
          activeSolWalletAddress?.wallet,
          activeSolWalletAddress?.balance || 0,
          e,
          toToken,
          dispatch,
          price,
          {
            name: symbol,
            symbol: name,
            img: null,
          }
        )
      }
      className="border-[#21CB6B] border-[1px] hover:text-white transition-all ease-in-out cursor-pointer text-[#21CB6B] duration-300 hover:bg-[#21CB6B] rounded-md py-2 px-6 text-sm"
    >
      Buy
    </button>
  );
}
