import { utils } from 'ethers'

import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const L1FeeBalance = async () => {
  try {
    const balance = await networkService.L1Provider!.getBalance(
      walletService.account!
    )
    return utils.formatEther(balance)
  } catch (error) {
    console.log('NS: getL1FeeBalance error:', error)
    return 0
  }
}
