export enum LiquidityPoolLayer {
  L1LP = 'L1LP',
  L2LP = 'L2LP',
}

export interface EarnListItemProps {
  userInfo: any
  poolInfo: any
  chainId?: any
  tokenAddress: string
  lpChoice: LiquidityPoolLayer
  showMyStakeOnly: boolean
}

export interface EarnListProps {
  lpChoice: LiquidityPoolLayer
  showMyStakeOnly: boolean
}
