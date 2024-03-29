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
  networkAbbreviation: 'ETHEREUM',
  isTestnet: false,
}

export const BinanceInfo: NetworkTestInfo = {
  networkName: 'BNB Smart Chain Mainnet',
  networkAbbreviation: 'BNB',
  isTestnet: false,
}

export const BobaEthInfo: NetworkTestInfo = {
  networkName: 'Boba ETH',
  networkAbbreviation: 'ETHEREUM',
  isTestnet: false,
}

export const BobaBNBInfo: NetworkTestInfo = {
  networkName: 'Boba BNB',
  networkAbbreviation: 'BNB',
  isTestnet: false,
}

export const EthereumGoerliInfo: NetworkTestInfo = {
  networkName: 'Ethereum (Goerli)',
  networkAbbreviation: 'ETHEREUM',
  isTestnet: true,
}

export const BinanceTestnetInfo: NetworkTestInfo = {
  networkName: 'BNB Testnet',
  networkAbbreviation: 'BNB',
  isTestnet: true,
}

export const BobaGoerliInfo: NetworkTestInfo = {
  networkName: 'Boba (Goerli)',
  networkAbbreviation: 'ETHEREUM',
  isTestnet: true,
}

export const BobaBNBTestnetInfo: NetworkTestInfo = {
  networkName: 'Boba BNB Testnet',
  networkAbbreviation: 'BNB',
  isTestnet: true,
}

export const OptimismSepoliaInfo: NetworkTestInfo = {
  networkName: 'Optimism (Sepolia)',
  networkAbbreviation: 'OPTIMISM',
  isTestnet: true,
}
export const ArbitrumSepoliaInfo: NetworkTestInfo = {
  networkName: 'Arbitrum (Sepolia)',
  networkAbbreviation: 'ARBITRUM',
  isTestnet: true,
}

export const MainnetL1Networks: NetworkTestInfo[] = [EthereumInfo, BinanceInfo]

export const MainnetL2Networks: NetworkTestInfo[] = [BobaEthInfo, BobaBNBInfo]

export const TestnetL1Networks: NetworkTestInfo[] = [
  EthereumGoerliInfo,
  BinanceTestnetInfo,
]

export const TestnetL2Networks: NetworkTestInfo[] = [
  BobaGoerliInfo,
  BobaBNBTestnetInfo,
]

export const TestnetLightBridgeNetworks: NetworkTestInfo[] = [
  BobaGoerliInfo,
  BobaBNBTestnetInfo,
  OptimismSepoliaInfo,
  ArbitrumSepoliaInfo,
]
