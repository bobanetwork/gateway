import { LAYER, Layer } from 'util/constant'
import networkService from 'services/networkService'
import appService from 'services/app.service'

import { CHAIN_ID_LIST } from 'util/network/network.util'

export const Address = (chainId?: number) => {
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
