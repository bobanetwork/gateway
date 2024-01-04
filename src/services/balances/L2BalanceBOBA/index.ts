import { ethers, utils } from 'ethers'
import { L2StandardERC20ABI } from 'services/abi'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const L2BalanceBOBA = async () => {
  try {
    const ERC20Contract = new ethers.Contract(
      networkService.tokenAddresses!['BOBA'].L2,
      L2StandardERC20ABI,
      walletService.provider!.getSigner()
    )
    const balance = await ERC20Contract.balanceOf(walletService.account)
    return utils.formatEther(balance)
  } catch (error) {
    console.log('NS: getL2BalanceBOBA error:', error)
    return 0
  }
}
