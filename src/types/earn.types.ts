export interface IPoolItem {
  symbol: string
  name: string
  decimals: number
  l1TokenAddress: string
  l2TokenAddress: string
  accUserReward: string
  accUserRewardPerShare: string
  userDepositAmount: string
  startTime: string
  APR: number
  tokenBalance: string
}

export interface IPoolInfo {
  L1LP: Record<string, IPoolItem>
  L2LP: Record<string, IPoolItem>
}

export interface IUserInfoItem {
  l1TokenAddress: string
  l2TokenAddress: string
  amount: number
  pendingReward: number
  rewardDebt: number
}

export interface IUserInfo {
  L1LP: Record<string, Omit<IUserInfoItem, 'l2TokenAddress'>>
  L2LP: Record<string, Omit<IUserInfoItem, 'l1TokenAddress'>>
}

export enum LiquidityPoolLayer {
  L1LP = 'L1LP',
  L2LP = 'L2LP',
}

export interface EarnListItemProps {
  userInfo:
    | Omit<IUserInfoItem, 'l2TokenAddress'>
    | Omit<IUserInfoItem, 'l1TokenAddress'>
  poolInfo: IPoolItem
  chainId?: string | number
  tokenAddress: string
  lpChoice: LiquidityPoolLayer
  showMyStakeOnly: boolean
}

export interface EarnListProps {
  lpChoice: LiquidityPoolLayer
  showMyStakeOnly: boolean
}
