import { Contract } from 'ethers'
import { serializeTransaction } from 'ethers/lib/utils'
import { logAmount } from 'util/amountConvert'
import { TxPayload } from 'util/network/config/network-details.types'
import { OVM_GasPriceOracleABI } from './abi'
import { L2GasOracle } from './app.service'
import networkService from './networkService'

export const fetchGasDetail = async () => {
  try {
    // get gas price
    const feeDataL1 = await networkService.L1Provider?.getFeeData()
    const feeDataL2 = await networkService.L2Provider?.getFeeData()
    // get block count
    const block1 = await networkService.L1Provider?.getBlockNumber()
    const block2 = await networkService.L2Provider?.getBlockNumber()

    const gasL1 = Number(logAmount(feeDataL1?.gasPrice?.toString()!, 9))
    const gasL2 = Number(logAmount(feeDataL2?.gasPrice?.toString()!, 9))

    return {
      gasL1: !isNaN(gasL1) ? gasL1.toFixed(0) : '0',
      gasL2: !isNaN(gasL2) ? gasL2.toFixed(0) : '0',
      blockL1: Number(block1),
      blockL2: Number(block2),
    }
  } catch (error) {
    console.log('GS: getGas', error)
    return {}
  }
}

export const estimateL1SecurityFee = async (
  payload = networkService.payloadForL1SecurityFee
) => {
  try {
    const deepCopyPayload = { ...payload }
    delete deepCopyPayload.from // deleting from option.
    const oracleContract = new Contract(
      L2GasOracle,
      OVM_GasPriceOracleABI,
      networkService.L2Provider
    )
    const l1SecurityFee = await oracleContract!.getL1Fee(
      serializeTransaction(deepCopyPayload)
    )
    return l1SecurityFee.toNumber()
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const estimateL2Fee = async (
  payload: TxPayload = networkService.payloadForL1SecurityFee!
) => {
  try {
    const l2GasPrice = await networkService.L2Provider!.getGasPrice()
    const l2GasEstimate = await networkService.L2Provider!.estimateGas(payload)
    return l2GasPrice.mul(l2GasEstimate).toNumber()
  } catch (error) {
    console.log(`ERROR l2Fee`, error)
    return 0
  }
}
