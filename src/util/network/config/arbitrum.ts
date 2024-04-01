import { NetworkDetail } from './network-details.types'

export const arbitrumConfig: NetworkDetail = {
  Testnet: {
    addressManager: `0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148`,
    MM_Label: `Sepolia`,
    L1: {
      name: 'Sepolia',
      chainId: 11155111,
      chainIdHex: '0x11155111',
      rpcUrl: ['https://sepolia.gateway.tenderly.co/3SOVnngE1EdDjNfxX8LC4V'],
      transaction: `https://sepolia.etherscan.io/tx/`,
      blockExplorerUrl: `https://sepolia.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: 'Arbitrum Sepolia',
      chainId: 421614,
      chainIdHex: '0x66EED',
      rpcUrl: [
        `https://arbitrum-sepolia.gateway.tenderly.co/3SOVnngE1EdDjNfxX8LC4V`,
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
