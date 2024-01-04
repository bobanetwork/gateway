import { Network } from 'util/network/network.util'

import { updateSignatureStatus_exitLP } from 'actions/signAction'
import { BigNumber, ethers, utils } from 'ethers'
import networkService from 'services/networkService'
import { L2BillingContractABI, L2StandardERC20ABI } from 'services/abi'
import bridgingService from 'services/bridging.service'

export const DepositL2LP = async (currencyAddress, value_Wei_String) => {
  await updateSignatureStatus_exitLP(false)

  const L2BillingContract = new ethers.Contract(
    networkService.addresses.Proxy__BobaBillingContract,
    L2BillingContractABI,
    networkService.L2Provider
  )
  let BobaApprovalAmount = await L2BillingContract.exitFee()

  const BobaAllowance = await bridgingService.checkAllowance(
    networkService.addresses.TK_L2BOBA,
    networkService.addresses.L2LPAddress
  )

  try {
    if (networkService.networkGateway === Network.ETHEREUM) {
      // Approve BOBA first only when the Boba is not native token.
      if (
        utils.getAddress(currencyAddress) ===
        utils.getAddress(networkService.addresses.TK_L2BOBA)
      ) {
        BobaApprovalAmount = BobaApprovalAmount.add(
          BigNumber.from(value_Wei_String)
        )
      }
      if (BobaAllowance.lt(BobaApprovalAmount)) {
        const approveStatus = await bridgingService.approveERC20(
          BobaApprovalAmount,
          networkService.addresses.TK_L2BOBA,
          networkService.addresses.L2LPAddress
        )
        if (!approveStatus) {
          return false
        }
      }
    }

    // Approve other tokens
    if (
      currencyAddress !== networkService.addresses.L2_ETH_Address &&
      utils.getAddress(currencyAddress) !==
        utils.getAddress(networkService.addresses.TK_L2BOBA)
    ) {
      const L2ERC20Contract = new ethers.Contract(
        currencyAddress,
        L2StandardERC20ABI,
        networkService.provider!.getSigner()
      )

      const allowance_BN = await L2ERC20Contract.allowance(
        networkService.account,
        networkService.addresses.L2LPAddress
      )

      const depositAmount_BN = BigNumber.from(value_Wei_String)

      if (depositAmount_BN.gt(allowance_BN)) {
        const approveStatus = await L2ERC20Contract.approve(
          networkService.addresses.L2LPAddress,
          value_Wei_String
        )
        await approveStatus.wait()
        if (!approveStatus) {
          return false
        }
      }
    }

    const time_start = new Date().getTime()
    console.log('TX start time:', time_start)

    let otherField
    if (networkService.networkGateway === Network.ETHEREUM) {
      otherField =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value: value_Wei_String }
          : {}
    } else {
      otherField =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value: BobaApprovalAmount.add(value_Wei_String) }
          : { value: BobaApprovalAmount }
    }

    const depositTX = await networkService
      .L2LPContract!.connect(networkService.provider!.getSigner())
      .clientDepositL2(value_Wei_String, currencyAddress, otherField)

    //at this point the tx has been submitted, and we are waiting...
    await depositTX.wait()

    const block = await networkService.L2Provider!.getTransaction(
      depositTX.hash
    )
    console.log(' block:', block)

    //closes the modal
    await updateSignatureStatus_exitLP(true)

    return depositTX
  } catch (error) {
    console.log('NS: depositL2LP error:', error)
    return error
  }
}
