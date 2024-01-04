import { utils } from 'ethers'

import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const L2BalanceETH = async () => {
  try {
    const balance = await networkService.L2Provider!.getBalance(
      walletService.account!
    )
    return utils.formatEther(balance)
  } catch (error) {
    console.log('NS: getL2BalanceETH error:', error)
    return 0
  }
}
