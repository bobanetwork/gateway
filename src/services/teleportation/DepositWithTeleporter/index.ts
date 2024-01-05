import { updateSignatureStatus_depositLP } from 'actions/signAction'
import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import networkService from 'services/networkService'
import { Layer } from 'util/constant'
import walletService from 'services/wallet.service'
import { ethers } from 'ethers'

export const DepositWithTeleporter = async (
  layer,
  currency,
  value_Wei_String,
  destChainId
) => {
  try {
    updateSignatureStatus_depositLP(false)
    setFetchDepositTxBlock(false)

    const teleportationAddr =
      layer === Layer.L1
        ? networkService.addresses.Proxy__L1Teleportation
        : networkService.addresses.Proxy__L2Teleportation
    const msgVal =
      currency === networkService.addresses.L1_ETH_Address ||
      currency === networkService.addresses.NETWORK_NATIVE
        ? { value: value_Wei_String }
        : {}
    const teleportationContract = networkService
      .Teleportation!.attach(teleportationAddr)
      .connect(walletService.provider!.getSigner())
    const tokenAddress =
      currency === networkService.addresses.NETWORK_NATIVE
        ? ethers.constants.AddressZero
        : currency

    const assetSupport = await teleportationContract.supportedTokens(
      tokenAddress,
      destChainId
    )
    if (!assetSupport?.supported) {
      console.error(
        'Teleportation: Asset not supported for chainId',
        assetSupport,
        tokenAddress,
        destChainId
      )
      return new Error(
        `Teleportation: Asset ${tokenAddress} not supported for chainId ${destChainId}`
      )
    }

    const depositTX = await teleportationContract.teleportAsset(
      tokenAddress,
      value_Wei_String,
      destChainId,
      msgVal
    )

    setFetchDepositTxBlock(true)

    //at this point the tx has been submitted, and we are waiting...
    await depositTX.wait()
    updateSignatureStatus_depositLP(true)

    const opts = {
      fromBlock: -4000,
    }
    const receipt = await networkService.watcher!.waitForMessageReceipt(
      depositTX,
      opts
    )
    const txReceipt = receipt.transactionReceipt
    console.log(' completed swap-on ! tx hash:', txReceipt)
    return txReceipt
  } catch (error) {
    console.log('Teleportation error:', error)
    return error
  }
}
