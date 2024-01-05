import { BigNumberish } from 'ethers'
import networkService from 'services/networkService'

export const L2LPBalance = async (tokenAddress: string): Promise<string> => {
  let balance: BigNumberish
  const tokenAddressLC = tokenAddress.toLowerCase()

  if (
    tokenAddressLC === networkService.addresses.L2_BOBA_Address ||
    tokenAddressLC === networkService.addresses.L1_ETH_Address
  ) {
    //We are dealing with ETH
    balance = await networkService
      .L2_ETH_Contract!.connect(networkService.L2Provider!)
      .balanceOf(networkService.addresses.L2LPAddress)
  } else {
    balance = await networkService
      .L2_TEST_Contract!.attach(tokenAddress)
      .connect(networkService.L2Provider!)
      .balanceOf(networkService.addresses.L2LPAddress)
  }

  return balance.toString()
}
