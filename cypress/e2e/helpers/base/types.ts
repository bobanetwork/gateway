export type MetamaskNetwork = {
  networkName: string
  rpcUrl: string
  chainId: string
  symbol: string
  blockExplorer: string
  isTestnet: boolean
}

export type NetworkTestInfo = {
  networkName: string
  networkAbbreviation: string
  isTestnet: boolean
}

export enum BridgeType {
  Classic = 'Classic',
  Light = 'Light',
}
