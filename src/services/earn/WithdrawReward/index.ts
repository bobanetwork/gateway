import networkService from 'services/networkService'
import { LiquidityPoolLayer } from 'types/earn.types'

export const WithdrawReward = async (
  currencyAddress,
  value_Wei_String,
  L1orL2Pool: LiquidityPoolLayer
) => {
  try {
    const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
      ? networkService.L1LPContract!
      : networkService.L2LPContract!
    )
      .connect(networkService.provider!.getSigner())
      .withdrawReward(value_Wei_String, currencyAddress, networkService.account)
    await TX.wait()
    return TX
  } catch (error) {
    console.log('NS: withdrawReward error:', error)
    return error
  }
}
