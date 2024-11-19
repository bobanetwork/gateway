import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi.ts";

import { Toaster, TooltipProvider } from "@/components/ui";
import "./index.css";

import router from "@/layout/routes/index.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={0} >
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
