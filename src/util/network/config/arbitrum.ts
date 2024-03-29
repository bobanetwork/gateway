import { NetworkDetail } from './network-details.types'
import { SepoliaTestnet } from './ethereumSepolia'

export const arbitrumConfig: NetworkDetail = {
  Testnet: {
    ...SepoliaTestnet,
    L2: {
      name: 'Arbitrum Sepolia',
      chainId: 421614,
      chainIdHex: '0x66eee',
      rpcUrl: [
        `https://arbitrum-sepolia.gateway.tenderly.co/3SOVnngE1EdDjNfxX8LC4V`,
        `https://arbitrum-sepolia.blockpi.network/v1/rpc/public`,
      ],
      blockExplorer: `https://sepolia.arbiscan.io/`,
      transaction: `https://sepolia.arbiscan.io/tx/`,
      blockExplorerUrl: `https://sepolia.arbiscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
  },
  Mainnet: {
    addressManager: `0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089`,
    MM_Label: `Mainnet`,
    L1: {
      name: 'Mainnet',
      chainId: 1,
      chainIdHex: '0x1',
      rpcUrl: [
        'https://mainnet.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI',
        `https://rpc.ankr.com/eth`,
        `https://cloudflare-eth.com`,
      ],
      transaction: ` https://etherscan.io/tx/`,
      blockExplorerUrl: `https://etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: 'Arbitrum Mainnet',
      chainId: 42161,
      chainIdHex: '0xA4B1',
      rpcUrl: [`https://arb1.arbitrum.io/rpc`],
      blockExplorer: `https://arbiscan.io/`,
      transaction: `https://arbiscan.io/tx/`,
      blockExplorerUrl: `https://arbiscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
  },
}
