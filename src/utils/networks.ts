// has details about the network configuration and corresponding contract addresses.
import { mainnet, sepolia } from "viem/chains"


// update the structure to support the multiple networks.

export const SUPPORTED_NETWORKS = {
  mainnet: {
    ...mainnet,
    name: 'Ethereum Mainnet',
  },
  sepolia: {
    ...sepolia,
    name: 'Sepolia Testnet',
  }
}

export const CONTRACT_ADDRESSES = {
  mainnet: '0x...', // Mainnet contract address
  sepolia: '0x...', // Testnet contract address
}
