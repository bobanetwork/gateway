import { MetamaskNetwork } from './types'

export const Binance: MetamaskNetwork = {
  networkName: 'Binance Mainnet',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  chainId: '56',
  symbol: 'BNB',
  blockExplorer: 'https://bscscan.com',
  isTestnet: false,
}

export const Avalanche: MetamaskNetwork = {
  networkName: 'Avalanche Mainnet',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  chainId: '43114',
  symbol: 'AVAX',
  blockExplorer: 'https://snowtrace.io/',
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

export const AvalancheTestnet: MetamaskNetwork = {
  networkName: 'Avalanche Testnet',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  chainId: '43113',
  symbol: 'AVAX',
  blockExplorer: 'https://testnet.snowtrace.io/',
  isTestnet: true,
}

export const mainnetL1NetworkNames = [
  'Ethereum',
  'Binance Smart Chain',
  'Avalanche Mainnet C-Chain',
]

export const mainnetL2NetworkNames = ['Boba ETH', 'Boba BNB', 'Boba Avalanche']

export const testnetL1NetworkNames = [
  'Ethereum (Goerli)',
  'BNB Testnet',
  'Fuji Testnet',
]
export const testnetL2NetworkNames = [
  'Boba (Goerli)',
  'Boba BNB Testnet',
  'Boba Fuji Testnet',
]

// Update the configs for boba networks TESTNET / MAINNET
