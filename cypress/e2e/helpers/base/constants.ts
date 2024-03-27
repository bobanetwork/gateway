import { MetamaskNetwork, NetworkTestInfo } from './types'

export const Binance: MetamaskNetwork = {
  networkName: 'BNB Smart Chain Mainnet',
  rpcUrl: 'https://bsc-dataseed1.binance.org/',
  chainId: '56',
  symbol: 'BNB',
  blockExplorer: 'https://bscscan.com',
  isTestnet: false,
}

export const BinanceTestnet: MetamaskNetwork = {
  networkName: 'BNB Smart Chain Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  chainId: '97',
  symbol: 'BNB',
  blockExplorer: 'https://testnet.bscscan.com',
  isTestnet: true,
}

export const EthereumInfo: NetworkTestInfo = {
  networkName: 'Ethereum',
  networkAbbreviation: 'Ethereum',
  isTestnet: false,
  isDefault: true,
}

export const BinanceInfo: NetworkTestInfo = {
  networkName: 'Binance Smart Chain',
  networkAbbreviation: 'BNB',
  isTestnet: false,
  isDefault: false,
}

export const BobaEthInfo: NetworkTestInfo = {
  networkName: 'Boba ETH',
  networkAbbreviation: 'Ethereum',
  isTestnet: false,
  isDefault: false,
}

export const BobaBNBInfo: NetworkTestInfo = {
  networkName: 'Boba BNB',
  networkAbbreviation: 'BNB',
  isTestnet: false,
  isDefault: false,
}

export const EthereumGoerliInfo: NetworkTestInfo = {
  networkName: 'Ethereum (Goerli)',
  networkAbbreviation: 'Ethereum',
  isTestnet: true,
  isDefault: true,
}

export const EthereumSepoliaInfo: NetworkTestInfo = {
  networkName: 'Ethereum (Sepolia)',
  networkAbbreviation: 'Ethereum Sepolia',
  isTestnet: true,
  isDefault: true,
  reduxName: 'Ethereum_Sepolia',
}

export const BinanceTestnetInfo: NetworkTestInfo = {
  networkName: 'BNB Testnet',
  networkAbbreviation: 'BNB',
  isTestnet: true,
  isDefault: false,
}

export const BobaGoerliInfo: NetworkTestInfo = {
  networkName: 'Boba (Goerli)',
  networkAbbreviation: 'Ethereum',
  isTestnet: true,
  isDefault: false,
}
export const BobaSepoliaInfo: NetworkTestInfo = {
  networkName: 'Boba (Sepolia)',
  networkAbbreviation: 'Ethereum Sepolia',
  isTestnet: true,
  isDefault: false,
}

export const BobaBNBTestnetInfo: NetworkTestInfo = {
  networkName: 'Boba BNB Testnet',
  networkAbbreviation: 'BNB',
  isTestnet: true,
  isDefault: false,
}

export const OptimismGoerliInfo: NetworkTestInfo = {
  networkName: 'Optimism (Goerli)',
  networkAbbreviation: 'OPTIMISM',
  isTestnet: true,
  isDefault: false,
}
export const ArbitrumGoerliInfo: NetworkTestInfo = {
  networkName: 'Arbitrum (Goerli)',
  networkAbbreviation: 'ARBITRUM',
  isTestnet: true,
  isDefault: false,
}

export const MainnetL1Networks: NetworkTestInfo[] = [EthereumInfo, BinanceInfo]

export const MainnetL2Networks: NetworkTestInfo[] = [BobaEthInfo, BobaBNBInfo]

export const TestnetL1Networks: NetworkTestInfo[] = [
  EthereumGoerliInfo,
  BinanceTestnetInfo,
  EthereumSepoliaInfo,
]

export const TestnetL2Networks: NetworkTestInfo[] = [
  BobaGoerliInfo,
  BobaBNBTestnetInfo,
  BobaSepoliaInfo,
]

export const TestnetLightBridgeNetworks: NetworkTestInfo[] = [
  BobaGoerliInfo,
  BobaBNBTestnetInfo,
  OptimismGoerliInfo,
  ArbitrumGoerliInfo,
]
