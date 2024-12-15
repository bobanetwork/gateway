import { defineChain } from "viem";

export const BOBABSC_CHAIN = defineChain({
  id: 56288,
  name: 'Boba BNB Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Boba token',
    symbol: 'BOBA',
  },
  rpcUrls: {
    default: { http: [`https://bnb.boba.network`, `https://replica.bnb.boba.network`] },
  },
  blockExplorers: {
    default: {
      name: 'BOBA Scan',
      url: 'https://bnb.bobascan.com/',
    },
  },
  contracts: {
  },
})
