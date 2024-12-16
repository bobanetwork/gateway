// import { defineChain } from "@reown/appkit/networks";

import { defineChain } from "viem";

export const BOBABNB_CHAIN = defineChain({
  id: 56288,
  name: 'Boba BNB Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Boba token',
    symbol: 'BOBA',
  },
  rpcUrls: {
    default: {
      http: [`https://bnb.boba.network`, `https://replica.bnb.boba.network`],
      webSocket: [`wss://boba-bnb.gateway.tenderly.co`, `https://gateway.tenderly.co/public/boba-bnb`]
    },
  },
  blockExplorers: {
    default: {
      name: 'BOBA Scan',
      url: 'https://bnb.bobascan.com/',
    },
  },
  contracts: {},
  chainNamespace: "eip155",
  caipNetworkId: "eip155:56288"
})
