"use client";
// const { wagmiAdapter, projectId } = require('@/config');
const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
const { createAppKit } = require("@reown/appkit/react");
const { mainnet, base, solana } = require("@reown/appkit/networks");
const { cookieToInitialState, WagmiProvider } = require("wagmi");
const { useEffect, useState } = require("react");
const { solanaWeb3JsAdapter, wagmiAdapter, projectId } = require("@/config");

function ContextProvider({ children, cookies }) {
  const [chainFromLocal, setChainFromLocal] = useState(() => {
    return Number(localStorage.getItem("chain")) || 19999;
  });

  const queryClient = new QueryClient();

  if (!projectId) {
    throw new Error("Project ID is not defined");
  }
  // Set up metadata for EVM
  const metadata = {
    name: "AppKit",
    description: "AppKit Example",
    url:"https://pro.wavebot.app/",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };
  if (chainFromLocal != 19999) {
    createAppKit({
      adapters: [wagmiAdapter],
      projectId:
        process.env.NEXT_PUBLIC_PROJECT_ID ||
        "633e617bf25491a0e2f96b9fb78fc657",
      networks: [mainnet, base],
      defaultNetwork: chainFromLocal == 1 ? mainnet : base,
      metadata: metadata,
      features: {
        analytics: true,
      },
    });
  } else {
    createAppKit({
      adapters: [solanaWeb3JsAdapter],
      projectId: "633e617bf25491a0e2f96b9fb78fc657",
      networks: [solana],
      defaultNetwork: solana,
      metadata: metadata,
      features: {
        analytics: true,
      },
    });
  }
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

module.exports = ContextProvider;
