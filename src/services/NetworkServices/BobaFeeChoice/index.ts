import { ethers } from 'ethers'
import { addBobaFee } from 'actions/setupAction'
import { BobaGasPriceOracleABI } from 'services/abi'
import { Network } from 'util/network/network.util'
import { Provider } from 'ethers/providers'
import { AddressesType, BobaFeeResult, BobaFeeError } from './types'

const getBobaFeeChoice = async (
  addresses: AddressesType,
  L2Provider: Provider,
  networkGateway: Network,
  account: string
): Promise<BobaFeeResult | BobaFeeError> => {
  const bobaFeeContract = new ethers.Contract(
    addresses.Boba_GasPriceOracle,
    BobaGasPriceOracleABI,
    L2Provider
  )

  try {
    const priceRatio = await bobaFeeContract.priceRatio()

    let feeChoice
    if (networkGateway === Network.ETHEREUM) {
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
    console.log(error)
    return error
  }
}

export { getBobaFeeChoice }
