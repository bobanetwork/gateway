import walletService from 'services/wallet.service'
import networkService from 'services/networkService'
import { BobaFixedSavingsABI } from 'services/abi'

import { ethers } from 'ethers'

export const WithdrawSavings = async (stakeId: number) => {
  if (!walletService.account) {
    return
  }

  try {
    const FixedSavings = new ethers.Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      walletService.provider!.getSigner()
    )
    const TX = await FixedSavings.unstake(stakeId)
    await TX.wait()
    return TX
  } catch (error) {
    console.log('NS: withdrawFS_Savings error:', error)
    return error
  }
}
