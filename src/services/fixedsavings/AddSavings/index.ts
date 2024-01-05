import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import { BobaFixedSavingsABI } from 'services/abi'

import walletService from 'services/wallet.service'
import networkService from 'services/networkService'

export const AddSavings = async (amountToStake: BigNumberish) => {
  if (!walletService.account) {
    return
  }

  try {
    const FixedSavings = new ethers.Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      walletService.provider!.getSigner()
    )

    const allowance_BN = await networkService
      .BobaContract!.connect(walletService.provider!.getSigner())
      .allowance(
        walletService.account,
        networkService.addresses.BobaFixedSavings
      )

    const depositAmount_BN = BigNumber.from(amountToStake)

    const approveAmount_BN = depositAmount_BN.add(
      BigNumber.from('1000000000000')
    )

    if (approveAmount_BN.gt(allowance_BN)) {
      const approveStatus = await networkService
        .BobaContract!.connect(walletService.provider!.getSigner())
        .approve(networkService.addresses.BobaFixedSavings, approveAmount_BN)
      await approveStatus.wait()
    } else {
      console.log(
        `Allowance is enough: ${allowance_BN.toString()}, ${depositAmount_BN.toString()}`
      )
    }

    const TX = await FixedSavings.stake(amountToStake)
    await TX.wait()
    return TX
  } catch (error) {
    console.log('NS: addFS_Savings error:', error)
    return error
  }
}
