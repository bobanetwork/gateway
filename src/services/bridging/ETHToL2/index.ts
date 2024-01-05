import { utils } from 'ethers'

import networkService from 'services/networkService'
import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import { Network } from 'util/network/network.util'
const L2GasLimit = 1300000

/**
 * Move ETH from L1 to L2 using the standard deposit system
 *
 * - Deposit ETH from L1 to L2.
 * - Deposit ETH from L1 to another L2 account.
 **/

export const ETHToL2 = async ({ recipient = null, value_Wei_String }) => {
  try {
    setFetchDepositTxBlock(false)

    let depositTX
    if (networkService.network === Network.ETHEREUM) {
      if (!recipient) {
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositETH(
            L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
      } else {
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositETHTo(
            recipient,
            L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
      }
    } else {
      if (!recipient) {
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositNativeToken(
            L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
      } else {
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositNativeTokenTo(
            recipient,
            L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
      }
    }

    setFetchDepositTxBlock(true)

    //at this point the tx has been submitted, and we are waiting...
    await depositTX.wait()

    const opts = {
      fromBlock: -4000,
    }

    const receipt = await networkService.watcher!.waitForMessageReceipt(
      depositTX,
      opts
    )
    const txReceipt = receipt.transactionReceipt
    console.log('completed Deposit! L2 tx hash:', receipt.transactionReceipt)
    return txReceipt
  } catch (error) {
    console.log('NS: depositETHL2 error:', error)
    return error
  }
}
