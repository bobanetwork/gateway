import networkService from './networkService'
import { BigNumberish } from 'ethers'
import { L1ERC20ABI } from './abi'

import {
  L1LP,
  ETHToL2,
  TransferEstimate,
  DepositErc20,
  ExitBoba,
  CheckAllowance,
  ApproveERC20,
  DepositL2LP,
  Transfer,
} from './bridging'

export class BridgingService {
  depositL1LP = async (currency, value_Wei_String) =>
    L1LP(currency, value_Wei_String)

  depositETHToL2 = async ({ recipient = null, value_Wei_String }) =>
    ETHToL2({ recipient, value_Wei_String })

  transferEstimate = async (
    recipient: string,
    value_Wei_String: string,
    currency: string
  ) => TransferEstimate(recipient, value_Wei_String, currency)

  //Transfer funds from one account to another, on the L2
  transfer = async (
    address: string,
    value_Wei_String: BigNumberish,
    currency: string
  ) => Transfer(address, value_Wei_String, currency)

  depositErc20 = async ({
    recipient = null,
    value_Wei_String,
    currency,
    currencyL2,
  }) =>
    DepositErc20({
      recipient,
      value_Wei_String,
      currency,
      currencyL2,
    })

  //Standard 7 day exit from BOBA
  exitBOBA = async (currencyAddress, value_Wei_String) =>
    ExitBoba(currencyAddress, value_Wei_String)

  checkAllowance = async (currencyAddress: string, targetContract: string) =>
    CheckAllowance(currencyAddress, targetContract)
  depositL2LP = async (
    currencyAddress: string,
    value_Wei_String: BigNumberish
  ) => DepositL2LP(currencyAddress, value_Wei_String)

  approveERC20 = async (
    value_Wei_String: BigNumberish,
    currency: string,
    approveContractAddress: string = networkService.addresses
      .L1StandardBridgeAddress,
    contractABI = L1ERC20ABI
  ) =>
    ApproveERC20(
      value_Wei_String,
      currency,
      approveContractAddress,
      contractABI
    )
}

const bridgingService = new BridgingService()
export default bridgingService
