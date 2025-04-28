// utils/createDynamicModal.js
import { wagmiAdapter, solanaWeb3JsAdapter, walletMapping } from "../config";
import { createAppKit } from "@reown/appkit/react";
import {
    mainnet,
    arbitrum,
    avalanche,
    base,
    binanceSmartChain,
    optimism,
    polygon,
    solana,
} from "@reown/appkit/networks";

export const createDynamicModal = (selectedToken) => {
    const selectedWallets = walletMapping[selectedToken] || [];
    const adapters = selectedToken === "Solana" ? [solanaWeb3JsAdapter] : [wagmiAdapter];

    return createAppKit({
        adapters,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        networks: [
            mainnet,
            arbitrum,
            avalanche,
            base,
            optimism,
            polygon,
            binanceSmartChain,
            solana,
        ],
        wallets: selectedWallets,
        themeVariables: {
            "--w3m-accent": "#6cc4f4",
        },
    });
};
