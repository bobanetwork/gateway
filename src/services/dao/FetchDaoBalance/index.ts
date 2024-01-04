import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { formatEther } from '@ethersproject/units'

export const FetchDaoBalance = async () => {
  if (!networkService.BobaContract || !walletService.account) {
    return
  }
  try {
    const balance = await networkService.BobaContract!.balanceOf(
      walletService.account
    )
    return { balance: formatEther(balance) }
  } catch (error) {
    console.log('Error: fetchDaoBalance', error)
    return error
  }
}
