import { BigNumber, ethers, utils } from 'ethers'
import { Network } from 'util/network/network.util'

import { updateSignatureStatus_exitTRAD } from 'actions/signAction'
import networkService from 'services/networkService'
import { DiscretionaryExitFeeABI, L2BillingContractABI } from 'services/abi'
import { CheckAllowance } from 'services/bridging'
import bridgingService from 'services/bridging.service'

const L1GasLimit = 9999999

export const ExitBoba = async (currencyAddress, value_Wei_String) => {
  await updateSignatureStatus_exitTRAD(false)

  try {
    const L2BillingContract = new ethers.Contract(
      networkService.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      networkService.L2Provider
    )
    let BobaApprovalAmount = await L2BillingContract.exitFee()

    //now coming in as a value_Wei_String
    const value = BigNumber.from(value_Wei_String)

    const allowance = await CheckAllowance(
      currencyAddress,
      networkService.addresses.DiscretionaryExitFee
    )

    const BobaAllowance = await CheckAllowance(
      networkService.addresses.TK_L2BOBA,
      networkService.addresses.DiscretionaryExitFee
    )

    if (networkService.networkGateway === Network.ETHEREUM) {
      // Should approve BOBA
      if (
        utils.getAddress(currencyAddress) ===
        utils.getAddress(networkService.addresses.TK_L2BOBA)
      ) {
        BobaApprovalAmount = BobaApprovalAmount.add(value)
      }

      if (BobaAllowance.lt(BobaApprovalAmount)) {
        const res = await bridgingService.approveERC20(
          BobaApprovalAmount,
          networkService.addresses.TK_L2BOBA,
          networkService.addresses.DiscretionaryExitFee
        )
        if (!res) {
          return false
        }
      }
    }

    let otherField
    if (networkService.networkGateway === Network.ETHEREUM) {
      otherField =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value }
          : {}
    } else {
      otherField =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value: value.add(BobaApprovalAmount) }
          : { value: BobaApprovalAmount }
    }

    // Should approve other tokens
    if (
      currencyAddress !== networkService.addresses.L2_ETH_Address &&
      utils.getAddress(currencyAddress) !==
        utils.getAddress(networkService.addresses.TK_L2BOBA) &&
      allowance.lt(value)
    ) {
      const res = await bridgingService.approveERC20(
        value,
        currencyAddress,
        networkService.addresses.DiscretionaryExitFee
      )
      if (!res) {
        return false
      }
    }

    const DiscretionaryExitFeeContract = new ethers.Contract(
      networkService.addresses.DiscretionaryExitFee,
      DiscretionaryExitFeeABI,
      networkService.provider!.getSigner()
    )

    const tx = await DiscretionaryExitFeeContract.payAndWithdraw(
      currencyAddress,
      value_Wei_String,
      L1GasLimit,
      utils.formatBytes32String(new Date().getTime().toString()),
      otherField
    )

    //everything submitted... waiting
    await tx.wait()

    //can close window now
    await updateSignatureStatus_exitTRAD(true)

    return tx
  } catch (error) {
    console.log('NS: exitBOBA error:', error)
    return error
  }
}
