import { BigNumber, BigNumberish, ethers } from 'ethers'
import { Network } from 'util/network/network.util'

import walletService from 'services/wallet.service'
import networkService from 'services/networkService'

export const ApproveERC20 = async (
  value_Wei_String: BigNumberish,
  currency: string,
  approveContractAddress: string,
  contractABI
) => {
  try {
    const ERC20Contract = new ethers.Contract(
      currency,
      contractABI,
      walletService.provider!.getSigner()
    )

    /***********************/

    let allowance_BN = await ERC20Contract.allowance(
      walletService.account,
      approveContractAddress
    )
    console.log('Initial Allowance is:', allowance_BN)

    /*
        OMG IS A SPECIAL CASE - allowance needs to be set to zero, and then
        set to actual amount, unless current approval amount is equal to, or
        bigger than, the current approval value
        */
    if (
      networkService.networkGateway === Network.ETHEREUM &&
      allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
      currency.toLowerCase() ===
        networkService.tokenAddresses!.OMG.L1.toLowerCase()
    ) {
      console.log(
        "Current OMG Token allowance too small - might need to reset to 0, unless it's already zero"
      )
      if (allowance_BN.gt(BigNumber.from('0'))) {
        const approveOMG = await ERC20Contract.approve(
          approveContractAddress,
          ethers.utils.parseEther('0')
        )
        await approveOMG.wait()
        console.log('OMG Token allowance has been set to 0')
      }
    }

    //recheck the allowance
    allowance_BN = await ERC20Contract.allowance(
      walletService.account,
      approveContractAddress
    )
    console.log('Second Allowance is:', allowance_BN)

    const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

    console.log('Allowed?:', allowed)

    if (!allowed) {
      console.log('Not good enough - need to set to:', value_Wei_String)
      //and now, the normal allowance transaction
      const approveStatus = await ERC20Contract.approve(
        approveContractAddress,
        value_Wei_String
      )
      await approveStatus.wait()
      console.log('ERC20 L1 SWAP ops approved:', approveStatus)
    }

    return true
  } catch (error) {
    console.log('NS: approveERC20 error:', error)
    return error
  }
}
