import { http, createConfig } from "wagmi";
import { boba, bobaSepolia, bsc, bscTestnet, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { BOBABNB_CHAIN } from "./config/chainConfig/bobaBnb";
import { BobaBNBTestnet_Chain } from "./config/chainConfig/bobaBnbTestnet";

export const config = createConfig({
  chains: [mainnet, sepolia, boba, bobaSepolia, BOBABNB_CHAIN, bsc, bscTestnet, BobaBNBTestnet_Chain],
  connectors: [injected(), coinbaseWallet(), walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [boba.id]: http(),
    [bobaSepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [BOBABNB_CHAIN.id]: http(),
    [BobaBNBTestnet_Chain.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
