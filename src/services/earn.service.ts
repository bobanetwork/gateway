/* eslint-disable */

import { LiquidityPoolLayer } from 'types/earn.types'

/*Earn program is deprecated but we need to support indefinetly to withdraw tokens from LP*/
import { L1LPBalance, L2LPBalance } from 'services/balances'
import {
  WithdrawReward,
  L1LPInfo,
  L2LPInfo,
  WithdrawLiquidity,
} from 'services/earn'
class EarnService {
  getL2LPInfo = async () => L2LPInfo()
  getL1LPInfo = async () => L1LPInfo()
  withdrawReward = async (
    currencyAddress,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) => WithdrawReward(currencyAddress, value_Wei_String, L1orL2Pool)
  getL1LPBalance = async (tokenAddress: string) => L1LPBalance(tokenAddress)
  getL2LPBalance = async (tokenAddress: string) => L2LPBalance(tokenAddress)
  withdrawLiquidity = async (
    currency,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) => WithdrawLiquidity(currency, value_Wei_String, L1orL2Pool)
}

const earnService = new EarnService()

export default earnService
