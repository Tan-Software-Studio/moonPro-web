import { sellSolanaTokensQuickSellHandler } from '@/utils/solanaBuySell/solanaBuySell';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import React from 'react';
import { useDispatch } from 'react-redux';
export default function SellBtn({ fromToken }) {
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider("solana");
    const dispatch = useDispatch();
    return (
        <button
            onClick={(e) => sellSolanaTokensQuickSellHandler(
                fromToken,
                address,
                isConnected,
                walletProvider,
                e,
                dispatch

            )}
            className="bg-red-500 hover:bg-red-600 rounded-md py-2 px-6 text-sm"
        >
            Sell
        </button>
    );
}
