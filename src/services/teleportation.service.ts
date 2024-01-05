import {
  TeleportationAddress,
  TeleportationContract,
  IsTeleportationOfAssetSupported,
  DepositWithTeleporter,
} from './teleportation'
export class TeleportationService {
  getTeleportationAddress = async (chainId?: number) =>
    TeleportationAddress(chainId)
  getTeleportationContract = async (chainId) => TeleportationContract(chainId)
  isTeleportationOfAssetSupported = async (layer, token, destChainId) =>
    IsTeleportationOfAssetSupported(layer, token, destChainId)
  depositWithTeleporter = async (
    layer,
    currency,
    value_Wei_String,
    destChainId
  ) => DepositWithTeleporter(layer, currency, value_Wei_String, destChainId)
}

const teleportationService = new TeleportationService()

export default teleportationService
