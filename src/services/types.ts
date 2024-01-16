/****************************/
/********** Earn Types*******/
/****************************/

export interface IUserPoolToken {
  l1TokenAddress?: string
  l2TokenAddress?: string
  amount: string
  pendingReward: string
  rewardDebt: string
}

export interface IPoolToken {
  symbol: string
  name: string
  decimals: number
  l1TokenAddress?: string
  l2TokenAddress?: string
  accUserReward: string
  accUserRewardPerShare: string
  userDepositAmount: string
  startTime: string
  APR: number
  tokenBalance: string
}

export interface IlpInfoResponse {
  poolInfo: Record<string, IPoolToken>
  userInfo: Record<string, IUserPoolToken>
}
