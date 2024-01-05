import { updateSignatureStatus_depositLP } from 'actions/signAction'
import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const L1LP = async (currency, value_Wei_String) => {
  // Fast Deposit to L2

  try {
    await updateSignatureStatus_depositLP(false)
    setFetchDepositTxBlock(false)

    const depositTX = await networkService
      .L1LPContract!.connect(walletService.provider!.getSigner())
      .clientDepositL1(
        value_Wei_String,
        currency,
        currency === networkService.addresses.L1_ETH_Address
          ? { value: value_Wei_String }
          : {}
      )

    setFetchDepositTxBlock(true)

    //at this point the tx has been submitted, and we are waiting...
    await depositTX.wait()
    await updateSignatureStatus_depositLP(true)

    const opts = {
      fromBlock: -4000,
    }
    const receipt = await networkService.watcher!.waitForMessageReceipt(
      depositTX,
      opts
    )
    const txReceipt = receipt.transactionReceipt
    console.log(' completed swap-on ! L2 tx hash:', txReceipt)
    return txReceipt
  } catch (error) {
    console.log('NS: depositL1LP error:', error)
    return error
  }
}
