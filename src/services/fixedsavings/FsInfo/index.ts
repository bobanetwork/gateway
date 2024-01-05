import { ethers } from 'ethers'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { BobaFixedSavingsABI } from 'services/abi'
import { logAmount } from 'util/amountConvert'

export const FsInfo = async () => {
  if (walletService.account === null) {
    console.log('NS: getFS_Info() error - called but account === null')
    return
  }

  try {
    const FixedSavings = new ethers.Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      networkService.L2Provider
    )

    const stakeInfo: any = []

    const stakeCounts = await FixedSavings.personalStakeCount(
      walletService.account
    )

    for (let i = 0; i < stakeCounts; i++) {
      const stakeId = await FixedSavings.personalStakePos(
        walletService.account,
        i
      )
      const stakeData = await FixedSavings.stakeDataMap(stakeId)

      stakeInfo.push({
        stakeId: Number(stakeId.toString()),
        depositTimestamp: Number(stakeData.depositTimestamp.toString()),
        depositAmount: logAmount(stakeData.depositAmount.toString(), 18),
        isActive: stakeData.isActive,
      })
    }
    return { stakeInfo }
  } catch (error) {
    console.log('NS: getFS_Info error:', error)
    return error
  }
}
