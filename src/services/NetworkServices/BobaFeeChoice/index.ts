import { ethers } from 'ethers'
import { addBobaFee } from 'actions/setupAction'
import { BobaGasPriceOracleABI } from 'services/abi'
import { Network } from 'util/network/network.util'
import { JsonRpcProvider } from '@ethersproject/providers'
import { AddressesType, BobaFeeResult, BobaFeeError } from './types'

const handleError = (error) => {
  console.error(error)
  return error
}

const getBobaFeeChoice = async (
  addresses: AddressesType,
  L2Provider: JsonRpcProvider | undefined,
  networkGateway: Network | undefined,
  account: string | undefined
): Promise<BobaFeeResult | BobaFeeError> => {
  const bobaFeeContract = new ethers.Contract(
    addresses.Boba_GasPriceOracle,
    BobaGasPriceOracleABI,
    L2Provider
  )

  try {
    const [priceRatio, feeChoice] = await Promise.all([
      bobaFeeContract.priceRatio(),
      networkGateway === Network.ETHEREUM
        ? bobaFeeContract.bobaFeeTokenUsers(account)
        : !(await bobaFeeContract.secondaryFeeTokenUsers(account)),
    ])

    const bobaFee = {
      priceRatio: priceRatio.toString(),
      feeChoice,
    }

    await addBobaFee(bobaFee)
    return bobaFee
  } catch (error) {
    return handleError(error)
  }
}

export { getBobaFeeChoice }
