import { ethers } from 'ethers'
import { L1LiquidityPoolABI } from 'services/abi'

import networkService from 'services/networkService'

export const L1LPLiquidity = async (
  tokenAddress: string
): Promise<string | number> => {
  const L1LPContract = new ethers.Contract(
    networkService.addresses.L1LPAddress,
    L1LiquidityPoolABI,
    networkService.L1Provider
  )

  try {
    const poolTokenInfo = await L1LPContract.poolInfo(tokenAddress)
    return poolTokenInfo.userDepositAmount.toString()
  } catch (error) {
    console.log('NS: L1LPLiquidity error:', error)
    return 0
  }
}
