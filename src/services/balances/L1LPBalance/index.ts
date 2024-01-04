import { BigNumberish } from 'ethers'

import networkService from 'services/networkService'

export const L1LPBalance = async (tokenAddress: string): Promise<string> => {
  let balance: BigNumberish
  const tokenAddressLC = tokenAddress.toLowerCase()

  if (
    tokenAddressLC === networkService.addresses.L2_ETH_Address ||
    tokenAddressLC === networkService.addresses.L1_ETH_Address
  ) {
    balance = await networkService.L1Provider!.getBalance(
      networkService.addresses.L1LPAddress
    )
  } else {
    balance = await networkService
      .L1_TEST_Contract!.attach(tokenAddress)
      .connect(networkService.L1Provider!)
      .balanceOf(networkService.addresses.L1LPAddress)
  }

  return balance.toString()
}
