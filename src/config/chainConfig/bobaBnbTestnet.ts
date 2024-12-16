import { defineChain } from "viem";

export const BobaBNBTestnet_Chain = defineChain({
  name: "Boba BNB Testnet",
  rpcUrls: {
    default: {
      http: [
        "https://testnet.bnb.boba.network",
        "https://replica.testnet.bnb.boba.network",
        "https://boba-bnb-testnet.gateway.tenderly.co",
      ],
      webSocket: [
        "wss://wss.testnet.bnb.boba.network",
        "wss://replica-wss.testnet.bnb.boba.network",
        "wss://boba-bnb-testnet.gateway.tenderly.co"
      ]
    }
  },
  nativeCurrency: {
    name: "Boba Token",
    symbol: "BOBA",
    decimals: 18
  },
  id: 9728,
  blockExplorers: {
    default: {
      "name": "Boba BNB Testnet block explorer",
      "url": "https://testnet.bobascan.com"
    }
  },
  chainNamespace: "eip155",
  caipNetworkId: "eip155:28882"
})