import { ethers } from 'ethers'
import networkService from './networkService'
import {
  BobaGasPriceOracleABI,
  L2BillingContractABI,
  OVM_GasPriceOracleABI,
} from './abi'
import { Network } from 'util/network/network.util'
import { MIN_NATIVE_L1_BALANCE } from 'util/constant'
import walletService from './wallet.service'
import { logAmount } from 'util/amountConvert'
import { TransactionResponse } from '@ethersproject/providers'

// TODO: move to constant or app config.
const L2GasOracle = '0x420000000000000000000000000000000000000F'

export class FeeService {
  async switchFee(targetFee: 'BOBA' | 'ETH') {
    if (networkService.L1orL2 !== 'L2') {
      return
    }

    const bobaFeeContract = new ethers.Contract(
      networkService.addresses.Boba_GasPriceOracle,
      BobaGasPriceOracleABI,
      walletService.provider!.getSigner()
    )

    try {
      let tx: TransactionResponse

      if (targetFee === 'BOBA') {
        tx = await bobaFeeContract.useBobaAsFeeToken()
        await tx.wait()
      } else if (targetFee === 'ETH') {
        tx = await bobaFeeContract.useETHAsFeeToken()
        await tx.wait()
      } else if (targetFee === networkService.L1NativeTokenSymbol) {
        tx = await bobaFeeContract.useSecondaryFeeTokenAsFeeToken()
        await tx.wait()
      } else {
        console.error(`switchFee: Unknown targetFee selected: ${targetFee}`)
        return
      }

      await networkService.getBobaFeeChoice()

      return tx
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async estimateMinL1NativeTokenForFee() {
    try {
      if (networkService.L1orL2 !== 'L2') {
        return 0
      }
      if (networkService.networkGateway === Network.ETHEREUM) {
        // for ethereum l1 fee is always const to 0.002.
        return MIN_NATIVE_L1_BALANCE
      } else {
        // for alt l1 this fee can change
        const bobaFeeContract = new ethers.Contract(
          networkService.addresses.Boba_GasPriceOracle,
          BobaGasPriceOracleABI,
          walletService.provider!.getSigner()
        )

        const minTokenForFee = await bobaFeeContract.secondaryFeeTokenMinimum()

        return logAmount(minTokenForFee.toString(), 18)
      }
    } catch (error) {
      console.log(`Error: estimateMinL1NativeTokenForFree`, error)
      return 0
    }
  }

  async estimateL1SecurityFee() {
    try {
      const payload = networkService.payloadForL1SecurityFee
      const deepCopyPayload = { ...payload }
      delete deepCopyPayload.from
      // Gas oracle
      const gasOracleContract = new ethers.Contract(
        L2GasOracle,
        OVM_GasPriceOracleABI,
        networkService.L2Provider
      )
      const l1SecurityFee = await gasOracleContract.getL1Fee(
        ethers.utils.serializeTransaction(deepCopyPayload)
      )
      return l1SecurityFee.toNumber()
    } catch (error) {
      console.log(`Error estimateL1SecurityFee`, error)
      return 0
    }
  }

  async estimateL2Fee() {
    try {
      const payload = networkService.payloadForL1SecurityFee!
      const l2GasPrice = await networkService.L2Provider!.getGasPrice()
      const l2GasEstimate =
        await networkService.L2Provider!.estimateGas(payload)
      return l2GasPrice.mul(l2GasEstimate).toNumber()
    } catch (error) {
      console.log(`Error: estimateL2Fee`, error)
      return 0
    }
  }

  async getExitFeeFromBillingContract() {
    try {
      const L2BillingContract = new ethers.Contract(
        networkService.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        networkService.L2Provider
      )
      const exitFee = await L2BillingContract.exitFee()
      return ethers.utils.formatEther(exitFee)
    } catch (error) {
      console.log(`Error: exitFee BillingContract`, error)
      return 0
    }
  }
}

const feeService = new FeeService()
export default feeService
