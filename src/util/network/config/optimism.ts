import { NetworkDetail } from './network-details.types'

export const optimismConfig: NetworkDetail = {
  Testnet: {
    MM_Label: `optimismTestnet`,
    addressManager: `0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148`,
    L1: {
      name: 'Sepolia',
      chainId: 11155111,
      chainIdHex: '0x11155111',
      rpcUrl: [`https://sepolia.gateway.tenderly.co/3SOVnngE1EdDjNfxX8LC4V`],
      transaction: `https://sepolia.etherscan.io/tx/`,
      blockExplorerUrl: `https://sepolia.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: 'Optimism Sepolia',
      chainId: 11155420,
      chainIdHex: '0xaa37dc',
      rpcUrl: [
        `https://optimism-sepolia.gateway.tenderly.co/3SOVnngE1EdDjNfxX8LC4V`,
      ],
      blockExplorer: `https://sepolia-optimism.etherscan.io/`,
      transaction: `https://sepolia-optimism.etherscan.io/tx/`,
      blockExplorerUrl: `https://sepolia-optimism.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
  },
  Mainnet: {
    addressManager: `0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089`,
    MM_Label: `optimismMainnet`,
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
      name: 'Optimism Mainnet',
      chainId: 10,
      chainIdHex: '0xA',
      rpcUrl: [`https://mainnet.optimism.io`],
      blockExplorer: `https://explorer.optimism.io/`,
      transaction: `https://explorer.optimism.io/tx/`,
      blockExplorerUrl: `https://explorer.optimism.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
  },
}
