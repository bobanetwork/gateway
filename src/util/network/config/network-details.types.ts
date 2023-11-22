import { BigNumberish } from 'ethers'

export type TxPayload = {
  from: string
  to: string
  value: BigNumberish
  data: string
}

export type NetworkDetailChainConfig = {
  OMGX_WATCHER_URL: string
  VERIFIER_WATCHER_URL?: string
  META_TRANSACTION: string
  MM_Label: string
  addressManager: string
  L1: {
    name: string
    chainId: number
    chainIdHex: string
    rpcUrl: string[]
    transaction: string
    blockExplorerUrl: string
    symbol: string
    tokenName: string
  }
  L2: {
    name: string
    chainId: number
    chainIdHex: string
    rpcUrl: string[]
    blockExplorer: string
    transaction: string
    blockExplorerUrl: string
    symbol: string
    tokenName: string
  }
  payloadForL1SecurityFee?: TxPayload
  payloadForFastDepositBatchCost?: TxPayload
  gasEstimateAccount?: string
  twitterFaucetPromotionText?: string
}

export type NetworkDetail = {
  Testnet: NetworkDetailChainConfig
  Mainnet: NetworkDetailChainConfig
}
