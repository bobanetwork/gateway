import { Address, Contract, SupportedAsset, Deposit } from './teleportation'
export class TeleportationService {
  getTeleportationAddress = async (chainId?: number) => Address(chainId)
  getTeleportationContract = async (chainId) => Contract(chainId)
  isTeleportationOfAssetSupported = async (layer, token, destChainId) =>
    SupportedAsset(layer, token, destChainId)
  depositWithTeleporter = async (
    layer,
    currency,
    value_Wei_String,
    destChainId
  ) => Deposit(layer, currency, value_Wei_String, destChainId)
}

const teleportationService = new TeleportationService()

export default teleportationService
