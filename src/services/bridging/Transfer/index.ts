import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import networkService from 'services/networkService'

export const Transfer = async (
  address: string,
  value_Wei_String: BigNumberish,
  currency: string
) => {
  let tx: TransactionResponse

  try {
    if (currency === networkService.addresses.L2_ETH_Address) {
      //we are sending ETH

      const wei = BigNumber.from(value_Wei_String)

      tx = await networkService.provider!.getSigner().sendTransaction({
        to: address,
        value: utils.hexlify(wei),
      })
    } else {
      //any ERC20 json will do....
      tx = await networkService
        .L2_TEST_Contract!.connect(networkService.provider!.getSigner())
        .attach(currency)
        .transfer(address, value_Wei_String)
      await tx.wait()
    }

    return tx
  } catch (error) {
    console.log('NS: transfer error:', error)
    return error
  }
}
