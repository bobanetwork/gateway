import { MetamaskNetwork, NetworkTestInfo } from './types'

export const Binance: MetamaskNetwork = {
  networkName: 'Binance Mainnet',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  chainId: '56',
  symbol: 'BNB',
  blockExplorer: 'https://bscscan.com',
  isTestnet: false,
}

export const BinanceTestnet: MetamaskNetwork = {
  networkName: 'BNB Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  chainId: '97',
  symbol: 'BNB',
  blockExplorer: 'https://testnet.bscscan.com',
  isTestnet: true,
}

export const EthereumInfo: NetworkTestInfo = {
  networkName: 'Ethereum',
  networkAbbreviation: 'ETHEREUM',
  isTestnet: false,
}
export const BinanceInfo: NetworkTestInfo = {
  networkName: 'Binance Smart Chain',
  networkAbbreviation: 'BNB',
  isTestnet: false,
}

export const MainnetL1Networks: NetworkTestInfo[] = [EthereumInfo, BinanceInfo]

export const MainnetL2Networks: NetworkTestInfo[] = [
  {
    networkName: 'Boba ETH',
    networkAbbreviation: 'Boba Eth',
    isTestnet: false,
  },
  {
    networkName: 'Boba BNB',
    networkAbbreviation: 'Boba BNB',
    isTestnet: false,
  },
]

export const EthereumGoerliInfo: NetworkTestInfo = {
  networkName: 'Ethereum (Goerli)',
  networkAbbreviation: 'ETHEREUM',
  isTestnet: true,
}

export const TestnetL1Networks: NetworkTestInfo[] = [
  EthereumGoerliInfo,
  {
    networkName: 'BNB Testnet',
    networkAbbreviation: 'BNB',
    isTestnet: true,
  },
]

export const TestnetL2Networks: NetworkTestInfo[] = [
  {
    networkName: 'Boba (Goerli)',
    networkAbbreviation: 'Boba (Goerli)',
    isTestnet: true,
  },
  {
    networkName: 'Boba BNB Testnet',
    networkAbbreviation: 'Boba BNB',
    isTestnet: true,
  },
]
