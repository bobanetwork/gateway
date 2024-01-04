import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import { BigNumber, ethers, utils } from 'ethers'
import { Network } from 'util/network/network.util'

import balanceService from 'services/balance.service'
import networkService from 'services/networkService'

const L2GasLimit = 1300000

//Used to move ERC20 Tokens from L1 to L2 using the classic deposit

export const DepositErc20 = async ({
  recipient = null,
  value_Wei_String,
  currency,
  currencyL2,
}) => {
  const L1_TEST_Contract = networkService.L1_TEST_Contract!.attach(currency)

  let allowance_BN = await L1_TEST_Contract.allowance(
    networkService.account,
    networkService.addresses.L1StandardBridgeAddress
  )
  setFetchDepositTxBlock(false)
  try {
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
        const approveOMG = await L1_TEST_Contract.approve(
          networkService.addresses.L1StandardBridgeAddress,
          ethers.utils.parseEther('0')
        )
        await approveOMG.wait()
        console.log('OMG Token allowance has been set to 0')
      }
    }

    //recheck the allowance
    allowance_BN = await L1_TEST_Contract.allowance(
      networkService.account,
      networkService.addresses.L1StandardBridgeAddress
    )

    const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

    if (!allowed) {
      //and now, the normal allowance transaction
      const approveStatus = await L1_TEST_Contract.connect(
        networkService.provider!.getSigner()
      ).approve(
        networkService.addresses.L1StandardBridgeAddress,
        value_Wei_String
      )
      await approveStatus.wait()
      console.log('ERC20 L1 ops approved:', approveStatus)
    }
    let depositTX
    if (!recipient) {
      // incase no recipient
      depositTX = await networkService
        .L1StandardBridgeContract!.connect(networkService.provider!.getSigner())
        .depositERC20(
          currency,
          currencyL2,
          value_Wei_String,
          L2GasLimit,
          utils.formatBytes32String(new Date().getTime().toString())
        )
    } else {
      // deposit ERC20 to L2 account address.
      depositTX = await networkService
        .L1StandardBridgeContract!.connect(networkService.provider!.getSigner())
        .depositERC20To(
          currency,
          currencyL2,
          recipient,
          value_Wei_String,
          L2GasLimit,
          utils.formatBytes32String(new Date().getTime().toString())
        )
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
    await balanceService.getBalances()
    return txReceipt
  } catch (error) {
    console.log('NS: depositErc20 error:', error)
    return error
  }
}
