import { ethers } from 'ethers'
import walletService from 'services/wallet.service'
import { L1ERC20ABI } from 'services/abi'

export const CheckAllowance = async (
  currencyAddress: string,
  targetContract: string
) => {
  try {
    const ERC20Contract = new ethers.Contract(
      currencyAddress,
      L1ERC20ABI, //could use any abi - just something with .allowance
      walletService.provider!.getSigner()
    )
    return await ERC20Contract.allowance(walletService.account, targetContract)
  } catch (error) {
    console.log('NS: checkAllowance error:', error)
    return error
  }
}
