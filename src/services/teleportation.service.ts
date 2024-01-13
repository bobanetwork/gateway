import { CHAIN_ID_LIST, getRpcUrl } from 'util/network/network.util'
import networkService from './networkService'
import appService from './app.service'
import { LAYER, Layer } from 'util/constant'
import { ethers } from 'ethers'
import walletService from './wallet.service'
import { updateSignatureStatus_depositLP } from 'actions/signAction'
import { setFetchDepositTxBlock } from 'actions/bridgeAction'

export class TeleportationService {
  getTeleportationAddress(chainId?: number) {
    if (!chainId) {
      chainId = networkService.chainId
    }
    const networkConfig = CHAIN_ID_LIST[chainId!]
    let teleportationAddr
    if (!networkConfig) {
      console.error(
        `Unknown chainId to retrieve teleportation contract from: ${chainId}`
      )
      return { teleportationAddr: null, networkConfig: null }
    }
    const addresses = appService.fetchAddresses({
      networkType: networkConfig.networkType,
      network: networkConfig.chain,
    })
    if (networkConfig.layer === LAYER.L1) {
      teleportationAddr = addresses.Proxy__L1Teleportation
    } else if (networkConfig.layer === LAYER.L2) {
      teleportationAddr = addresses.Proxy__L2Teleportation
    }
    return { teleportationAddr, networkConfig }
  }

  getTeleportationContract(chainId) {
    const { teleportationAddr, networkConfig } =
      this.getTeleportationAddress(chainId)

    if (!teleportationAddr || !networkService.Teleportation) {
      return
    }

    const rpc = getRpcUrl({
      networkType: networkConfig.networkType,
      network: networkConfig.chain,
      layer: networkConfig.layer,
    })
    const provider = new ethers.providers.StaticJsonRpcProvider(rpc)
    const response = networkService
      .Teleportation!.attach(teleportationAddr)
      .connect(provider)
    console.log('response', response)
    return response
  }

  async isTeleportationOfAssetSupported(layer, token, destChainId) {
    const teleportationAddr =
      layer === LAYER.L1
        ? networkService.addresses.Proxy__L1Teleportation
        : networkService.addresses.Proxy__L2Teleportation
    if (!teleportationAddr) {
      return { supported: false }
    }
    const contract = networkService
      .Teleportation!.attach(teleportationAddr)
      .connect(walletService.provider!.getSigner())
    return contract.supportedTokens(token, destChainId)
  }

  async depositWithTeleporter(layer, currency, value_Wei_String, destChainId) {
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
}

const teleportationService = new TeleportationService()

export default teleportationService
