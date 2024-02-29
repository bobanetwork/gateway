import { logAmount } from 'util/amountConvert'
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
