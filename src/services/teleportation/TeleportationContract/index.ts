import { ethers } from 'ethers'
import networkService from 'services/networkService'
import { getRpcUrl } from 'util/network/network.util'
import { getTeleportationAddress } from './services/teleportation.service'

export const TeleportationContract = (chainId) => {
  const { teleportationAddr, networkConfig } = getTeleportationAddress(chainId)
  if (!teleportationAddr || !networkService.Teleportation) {
    return
  }

  const rpc = getRpcUrl({
    networkType: networkConfig.networkType,
    network: networkConfig.chain,
    layer: networkConfig.layer,
  })
  const provider = new ethers.providers.StaticJsonRpcProvider(rpc)

  return networkService
    .Teleportation!.attach(teleportationAddr)
    .connect(provider)
}
