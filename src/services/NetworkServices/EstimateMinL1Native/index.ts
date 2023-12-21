import { ethers } from 'ethers'
import { BobaGasPriceOracleABI } from 'services/abi'
import { Network } from 'util/network/network.util'
import { MIN_NATIVE_L1_BALANCE } from 'util/constant'
import { logAmount } from 'util/amountConvert'
import { L1orL2Type, AddressesType } from './types'
import { JsonRpcProvider } from '@ethersproject/providers'

const handleError = (error) => {
  console.error(error)
  return error
}

const estimateMinL1NativeToken = async (
  L1orL2: L1orL2Type | undefined,
  networkGateway: Network | undefined,
  addresses: AddressesType,
  provider: JsonRpcProvider | undefined
) => {
  if (L1orL2 !== 'L2') {
    return 0
  }

  try {
    if (networkGateway === Network.ETHEREUM) {
      return MIN_NATIVE_L1_BALANCE
    } else {
      const bobaFeeContract = new ethers.Contract(
        addresses.Boba_GasPriceOracle,
        BobaGasPriceOracleABI,
        provider?.getSigner()
      )

      const minTokenForFee = await bobaFeeContract.secondaryFeeTokenMinimum()

      return logAmount(minTokenForFee.toString(), 18)
    }
  } catch (error) {
    return handleError(error)
  }
}

export { estimateMinL1NativeToken }
