import { NetworkDetail } from './network-details.types'

export const optimismConfig: NetworkDetail = {
  Testnet: {
    MM_Label: `optimismTestnet`,
    addressManager: `0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148`,
    L1: {
      name: 'Goerli',
      chainId: 5,
      chainIdHex: '0x5',
      rpcUrl: [
        `https://goerli.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI`,
        `https://rpc.ankr.com/eth_goerli`,
      ],
      transaction: `https://goerli.etherscan.io/tx/`,
      blockExplorerUrl: `https://goerli.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: 'Optimism Goerli',
      chainId: 420,
      chainIdHex: '0x1A4',
      rpcUrl: [`https://goerli.optimism.io`],
      blockExplorer: `https://goerli-explorer.optimism.io/`,
      transaction: `https://goerli-explorer.optimism.io/tx/`,
      blockExplorerUrl: `https://goerli-explorer.optimism.io/`,
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
