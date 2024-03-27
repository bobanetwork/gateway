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
  isDefault: boolean
  reduxName?: string
}

export enum BridgeType {
  Classic = 'Classic',
  Fast = 'Fast',
  Light = 'Light',
}
