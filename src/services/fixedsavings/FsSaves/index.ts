import { ethers } from 'ethers'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { BobaFixedSavingsABI } from 'services/abi'

export const FsSaves = async () => {
  if (walletService.account === null) {
    return
  }

  try {
    const FixedSavings = new ethers.Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      networkService.L2Provider
    )
    await FixedSavings.l2Boba()
    const stakecount = await FixedSavings.personalStakeCount(
      walletService.account
    )
    return { stakecount: Number(stakecount) }
  } catch (error) {
    console.log('NS: getSaves error:', error)
    return error
  }
}
