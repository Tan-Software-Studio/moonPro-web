import { buySolanaTokensQuickBuyHandlerCopyTrading } from '@/utils/solanaBuySell/solanaBuySell';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import React from 'react';
import { useDispatch } from 'react-redux';
export default function BuyBtn({ toToken }) {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("solana");
  const dispatch = useDispatch();
  return (
    <button
      onClick={(e) =>
        buySolanaTokensQuickBuyHandlerCopyTrading(
          toToken,
          walletProvider,
          address,
          isConnected,
          e,  
          dispatch
        )
      }
      className="bg-green-500 hover:bg-green-600 rounded-md py-2 px-6 text-sm"
    >
      Buy
    </button>
  );
}
