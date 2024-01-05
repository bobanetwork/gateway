import { LAYER } from 'util/constant'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const SupportedAsset = (layer, token, destChainId) => {
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
