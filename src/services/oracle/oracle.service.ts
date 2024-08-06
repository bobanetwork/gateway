import { TransactionResponse } from '@ethersproject/providers'
import { addBobaFee } from 'actions/setupAction'
import { Contract } from 'ethers'
import { BobaGasPriceOracleABI } from 'services/abi'
import networkService from 'services/networkService'
import { ERROR_CODE } from 'util/constant'
import { Network } from 'util/network/network.util'

class OracleService {
  async getBobaFeeChoice() {
    try {
      const account = networkService.account
      if (!account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }
      if (!networkService.addresses.Boba_GasPriceOracle) {
        throw new Error(`${ERROR_CODE} invalid oracle address!`)
      }
      const bobaFeeContract = new Contract(
        networkService.addresses.Boba_GasPriceOracle,
        BobaGasPriceOracleABI,
        networkService.L2Provider
      )

      const priceRatio = await bobaFeeContract.priceRatio()

      let feeChoice
      if (networkService.networkGateway === Network.ETHEREUM) {
        feeChoice = await bobaFeeContract.bobaFeeTokenUsers(account)
      } else {
        feeChoice = await bobaFeeContract.secondaryFeeTokenUsers(account)
        feeChoice = !feeChoice
      }
      const bobaFee = {
        priceRatio: priceRatio.toString(),
        feeChoice,
      }
      await addBobaFee(bobaFee)
      return bobaFee
    } catch (error) {
      console.log(`getBobaFeeChoice`, error)
      return error
    }
  }

  async switchFeeToken(targetFee: string) {
    try {
      const account = networkService.account
      if (!account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }
      if (networkService.L1orL2 !== 'L2') {
        throw new Error(`${ERROR_CODE} on L1 network switch to L2 network!`)
      }
      if (!networkService.addresses.Boba_GasPriceOracle) {
        throw new Error(`${ERROR_CODE} invalid oracle address!`)
      }

      const bobaFeeContract = new Contract(
        networkService.addresses.Boba_GasPriceOracle,
        BobaGasPriceOracleABI,
        networkService.provider!.getSigner()
      )

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
        return false
      }

      await this.getBobaFeeChoice()

      return tx
    } catch (error) {
      console.log(`OS: switchFeeToken error`, error)
      return error
    }
  }
}

const oracleService = new OracleService()
export default oracleService
