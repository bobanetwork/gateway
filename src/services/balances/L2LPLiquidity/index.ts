import { ethers } from 'ethers'
import { L2LiquidityPoolABI } from 'services/abi'

import networkService from 'services/networkService'

export const L2LPLiquidity = async (
  tokenAddress: string
): Promise<string | number> => {
  const L2LPContract = new ethers.Contract(
    networkService.addresses.L2LPAddress,
    L2LiquidityPoolABI,
    networkService.L2Provider
  )

  try {
    const poolTokenInfo = await L2LPContract.poolInfo(tokenAddress)
    return poolTokenInfo.userDepositAmount.toString()
  } catch (error) {
    console.log('NS: L2LPLiquidity error:', error)
    return 0
  }
}
