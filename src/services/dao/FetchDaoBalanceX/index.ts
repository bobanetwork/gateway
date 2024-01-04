import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { formatEther } from '@ethersproject/units'

export const FetchDaoBalanceX = async () => {
  if (!networkService.xBobaContract || walletService.account) {
    return
  }
  try {
    const balance = await networkService.xBobaContract.balanceOf(
      walletService.account
    )
    return { balanceX: formatEther(balance) }
  } catch (error) {
    console.log('Error: fetchDaoBalanceX', error)
    return error
  }
}
