import networkService from 'services/networkService'
import { LiquidityPoolLayer } from 'types/earn.types'

export const WithdrawLiquidity = async (
  currency,
  value_Wei_String,
  L1orL2Pool: LiquidityPoolLayer
) => {
  try {
    const estimateGas = await (L1orL2Pool === LiquidityPoolLayer.L1LP
      ? networkService.L1LPContract!
      : networkService.L2LPContract!
    ).estimateGas.withdrawLiquidity(
      value_Wei_String,
      currency,
      networkService.account,
      { from: networkService.account }
    )
    const blockGasLimit = (await networkService.provider!.getBlock('latest'))
      .gasLimit
    const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
      ? networkService.L1LPContract!
      : networkService.L2LPContract!
    )
      .connect(networkService.provider!.getSigner())
      .withdrawLiquidity(value_Wei_String, currency, networkService.account, {
        gasLimit: estimateGas.mul(2).gt(blockGasLimit)
          ? blockGasLimit
          : estimateGas.mul(2),
      })
    await TX.wait()
    return TX
  } catch (error) {
    console.log('NS: withdrawLiquidity error:', error)
    return error
  }
}
