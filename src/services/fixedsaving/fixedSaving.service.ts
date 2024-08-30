import { BigNumber, Contract } from 'ethers'
import { BOBAABI, BobaFixedSavingsABI } from 'services/abi'
import { L2_SECONDARYFEETOKEN_ADDRESS } from 'services/app.service'
import networkService from 'services/networkService'
import { logAmount } from 'util/amountConvert'
import { ERROR_CODE } from 'util/constant'
import { Network } from 'util/network/network.util'

class FixedSavingService {
  loadBobaTokenContract() {
    if (!networkService.account) {
      throw new Error(`${ERROR_CODE} wallet not connected!`)
    }
    let l2SecondaryFeeTokenAddress = L2_SECONDARYFEETOKEN_ADDRESS
    if (
      networkService.tokenAddresses &&
      Network.ETHEREUM === networkService.network
    ) {
      l2SecondaryFeeTokenAddress = networkService.tokenAddresses.BOBA.L2
    }

    return new Contract(
      l2SecondaryFeeTokenAddress,
      BOBAABI,
      networkService.L2Provider
    )
  }

  loadFixedSavingContract() {
    if (!networkService.account) {
      throw new Error(`${ERROR_CODE} wallet not connected!`)
    }
    if (!networkService.addresses.BobaFixedSavings) {
      throw new Error(`${ERROR_CODE} invalid fixed saving account!`)
    }

    return new Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      networkService.provider!.getSigner()
    )
  }

  async savingEstimate() {
    try {
      const estimateAccount = networkService.gasEstimateAccount
      const otherField = {
        from: estimateAccount,
      }

      const gasPrice_BN = await networkService.provider!.getGasPrice()

      let approvalCost_BN = BigNumber.from('0')
      let stakeCost_BN = BigNumber.from('0')

      const bobaContract = this.loadBobaTokenContract()

      // first, we need the allowance of the benchmarkAccount
      const allowance_BN = await bobaContract.allowance(
        estimateAccount,
        networkService.addresses.BobaFixedSavings
      )

      // second, we need the approval cost
      const tx1 = await bobaContract
        .connect(networkService.provider!.getSigner())
        .populateTransaction.approve(
          networkService.addresses.BobaFixedSavings,
          allowance_BN.toString()
        )

      const approvalGas_BN = await networkService.provider!.estimateGas(tx1)
      approvalCost_BN = approvalGas_BN.mul(gasPrice_BN)

      const FixedSavings = this.loadFixedSavingContract()

      const tx2 = await FixedSavings.connect(
        networkService.provider!
      ).populateTransaction.stake(allowance_BN.toString(), otherField)

      const stakeGas_BN = await networkService.provider!.estimateGas(tx2)
      stakeCost_BN = stakeGas_BN.mul(gasPrice_BN)

      const safety_margin_BN = BigNumber.from('1000000000000')

      return approvalCost_BN.add(stakeCost_BN).add(safety_margin_BN)
    } catch (error) {
      console.log('FS: error', error)
      return error
    }
  }

  async addSavings(amount: string) {
    try {
      const account = networkService.account
      const fsContract = this.loadFixedSavingContract()

      const bobaContract = this.loadBobaTokenContract()

      const allowance_BN = await bobaContract
        .connect(networkService.provider!.getSigner())
        .allowance(account, networkService.addresses.BobaFixedSavings)

      const savingAmount = BigNumber.from(amount)

      const approveAmount_BN = savingAmount.add(BigNumber.from('1000000000000'))

      if (approveAmount_BN.gt(allowance_BN)) {
        const approveStatus = await bobaContract
          .connect(networkService.provider!.getSigner())
          .approve(networkService.addresses.BobaFixedSavings, approveAmount_BN)
        await approveStatus.wait()
      }

      const TX = await fsContract.stake(amount)

      await TX.wait()

      return TX
    } catch (error) {
      console.log(`FS: error`, error)
      return error
    }
  }

  async withdrawSavings(stakeId: number) {
    try {
      const fsContract = this.loadFixedSavingContract()
      const trx = await fsContract.unstake(stakeId)
      await trx.wait()
      return trx
    } catch (error) {
      console.log(`FS: error`, error)
      return error
    }
  }

  async loadSavings() {
    try {
      const account = networkService.account
      const fsContract = this.loadFixedSavingContract()
      // await fsContract.l2Boba() // @note: verify incase needed!
      const stakecount = await fsContract
        .connect(networkService.L2Provider!)
        .personalStakeCount(account)
      return { stakecount: Number(stakecount) }
    } catch (error) {
      console.log(`FS: error`, error)
      return error
    }
  }

  async loadAccountSaveInfo() {
    try {
      const account = networkService.account
      let fsContract = this.loadFixedSavingContract()

      fsContract = fsContract.connect(networkService.L2Provider!)

      const stakeInfo: any = []

      const stakeCounts = await fsContract.personalStakeCount(account)

      for (let i = 0; i < stakeCounts; i++) {
        const stakeId = await fsContract.personalStakePos(account, i)
        const stakeData = await fsContract.stakeDataMap(stakeId)

        stakeInfo.push({
          stakeId: Number(stakeId.toString()),
          depositTimestamp: Number(stakeData.depositTimestamp.toString()),
          depositAmount: logAmount(stakeData.depositAmount.toString(), 18),
          isActive: stakeData.isActive,
        })
      }
      return { stakeInfo }
    } catch (error) {
      console.log(`FS: error`, error)
      return error
    }
  }

  async loadBobaBalance() {
    try {
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }
      const bobaContract = this.loadBobaTokenContract()
      const balance = await bobaContract.balanceOf(networkService.account)
      const decimals = await bobaContract.decimals()
      return {
        balance,
        decimals,
      }
    } catch (error) {
      return error
    }
  }
}

const fixedSavingService = new FixedSavingService()
export default fixedSavingService
