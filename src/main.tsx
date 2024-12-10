import { Toaster, TooltipProvider } from "@/components/ui";
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork, boba, bobaSepolia, bsc, bscTestnet, mainnet, sepolia } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import "./index.css";

import router from "@/layout/routes/index.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_WC_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: 'Boba Gateway',
  url: 'https://gateway.boba.network',
  description:
    'Boba Gateway - Boba Network Gateway, facilitating effortless token bridging between Layer 1 (L1) and Layer 2 (L2) networks, featuring Staking, DAO, and Earn functionalities.',
  icons: ['https://gateway.boba.network/favicon.png'],
}

// 3. Set the networks
const networks: AppKitNetwork[] = [mainnet, sepolia, boba, bobaSepolia, bsc, bscTestnet]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia, boba, bobaSepolia, bsc, bscTestnet],
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={0} >
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
