import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import { logAmount } from 'util/amountConvert'
import { BobaFixedSavingsABI } from './abi'
import networkService from './networkService'
import walletService from './wallet.service'

export class FixedSavingService {
  async addFS_Savings(amountToStake: BigNumberish) {
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

  async savingEstimate() {
    // used to generate gas estimates for contracts that cannot set amount === 0
    // to avoid need to approve amount

    const otherField = {
      from: networkService.gasEstimateAccount,
    }

    const gasPrice_BN = await walletService.provider!.getGasPrice()
    console.log('gas price', gasPrice_BN.toString())

    let approvalCost_BN = BigNumber.from('0')
    let stakeCost_BN = BigNumber.from('0')

    try {
      // first, we need the allowance of the benchmarkAccount
      const allowance_BN = await networkService
        .BobaContract!.connect(walletService.provider!)
        .allowance(
          networkService.gasEstimateAccount,
          networkService.addresses.BobaFixedSavings
        )
      console.log('benchmarkAllowance_BN', allowance_BN.toString())

      // second, we need the approval cost
      const tx1 = await networkService
        .BobaContract!.connect(walletService.provider!.getSigner())
        .populateTransaction.approve(
          networkService.addresses.BobaFixedSavings,
          allowance_BN.toString()
        )

      const approvalGas_BN = await walletService.provider!.estimateGas(tx1)
      approvalCost_BN = approvalGas_BN.mul(gasPrice_BN)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))

      // third, we need the stake cost
      const FixedSavings = new ethers.Contract(
        networkService.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        walletService.provider
      )

      const tx2 = await FixedSavings.populateTransaction.stake(
        allowance_BN.toString(),
        otherField
      )
      const stakeGas_BN = await walletService.provider!.estimateGas(tx2)
      stakeCost_BN = stakeGas_BN.mul(gasPrice_BN)
      console.log('Stake cost in ETH:', utils.formatEther(stakeCost_BN))

      const safety_margin_BN = BigNumber.from('1000000000000')
      console.log('Stake safety margin:', utils.formatEther(safety_margin_BN))

      return approvalCost_BN.add(stakeCost_BN).add(safety_margin_BN)
    } catch (error) {
      console.log('NS: stakingEstimate() error', error)
      return error
    }
  }

  async withdrawFS_Savings(stakeId: number) {
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

  async getFS_Saves() {
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

  async getFS_Info() {
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
}

const fixedSavingService = new FixedSavingService()
export default fixedSavingService
