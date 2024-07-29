import {
  CHAIN_ID_LIST,
  getRpcUrl,
  getRpcUrlByChainId,
} from 'util/network/network.util'
import networkService from './networkService'
import appService from './app.service'
import { ERROR_CODE, Layer, LAYER } from 'util/constant'
import { L1ERC20ABI, L2StandardERC20ABI, TeleportationABI } from './abi'
import { constants, Contract, providers } from 'ethers'
import { getDestinationTokenAddress } from '@bobanetwork/light-bridge-chains'

class LightBridgeService {
  async getLightBridgeAddress({ chainId }: { chainId?: number } = {}) {
    try {
      const inputChainId = chainId
      if (!chainId) {
        chainId = networkService.chainId
      }

      const destChainConfig = CHAIN_ID_LIST[chainId!]

      let lightBridgeAddress: string | undefined

      if (!destChainConfig) {
        throw new Error(`${ERROR_CODE} unknown destination network`)
      }

      const addresses = appService.fetchAddresses({
        networkType: destChainConfig.networkType,
        network: destChainConfig.chain,
      })

      let layer = destChainConfig.layer

      if (!inputChainId) {
        layer = networkService.L1orL2
      }

      if (layer === LAYER.L1) {
        lightBridgeAddress = addresses.Proxy__L1Teleportation
      } else if (layer === LAYER.L2) {
        lightBridgeAddress = addresses.Proxy__L2Teleportation
      }

      return {
        lightBridgeAddress,
        destChainConfig,
      }
    } catch (error) {
      console.log(`TS: Unknown chainId (unable to find address): ${chainId}`)
      return {
        lightBridgeAddress: null,
        destChainConfig: null,
      }
    }
  }

  async getLightBridgeContract(chainId: number) {
    try {
      const { lightBridgeAddress, destChainConfig } =
        await this.getLightBridgeAddress({ chainId })

      if (!lightBridgeAddress) {
        throw new Error(`${ERROR_CODE} invalid teleporation address`)
      }

      const rpc = getRpcUrl({
        networkType: destChainConfig.networkType,
        network: destChainConfig.chain,
        layer: destChainConfig.layer,
      })

      const provider = new providers.StaticJsonRpcProvider(rpc)

      const contract = new Contract(
        lightBridgeAddress,
        TeleportationABI,
        provider
      )

      return contract
    } catch (error) {
      console.log(`TS: error`, error)
      return null
    }
  }

  async getDisburserBalance({
    sourceChainId,
    destChainId,
    tokenAddress,
  }: {
    sourceChainId: string
    destChainId: string
    tokenAddress: string
  }) {
    try {
      if (tokenAddress === '0x4200000000000000000000000000000000000006') {
        tokenAddress = '0x0000000000000000000000000000000000000000'
      }

      const rpcUrl = getRpcUrlByChainId(destChainId)
      const destProvider = new providers.StaticJsonRpcProvider(rpcUrl)
      let destTokenAddress
      try {
        destTokenAddress = getDestinationTokenAddress(
          tokenAddress,
          sourceChainId,
          destChainId
        )
      } catch (err) {
        if (
          (err as string)
            .toString()
            .includes(
              'Token 0x4200000000000000000000000000000000000006 not supported on source chain 288'
            )
        ) {
          destTokenAddress = constants.AddressZero
        }
      }
      // check is native token.
      const isNativeToken =
        destTokenAddress === constants.AddressZero ||
        destTokenAddress === networkService.addresses.L2_ETH_Address

      const contract = await this.getLightBridgeContract(Number(destChainId))

      if (!contract) {
        throw new Error(`${ERROR_CODE} no lightbridge contract found`)
      }

      const disburserAddress = contract.disburser()

      if (!disburserAddress) {
        throw new Error(`${ERROR_CODE} invalid disburser address`)
      }

      if (isNativeToken) {
        return destProvider.getBalance(disburserAddress)
      } else {
        // based on current layer switch abi for erc20 token.
        const abi =
          networkService.L1orL2 === Layer.L1 ? L2StandardERC20ABI : L1ERC20ABI

        const tokenContract = new Contract(destTokenAddress, abi, destProvider)
        const balance = await tokenContract.balanceOf(disburserAddress)
        console.log(
          `Disburser Bal ${disburserAddress} ${balance} - ${networkService.L1orL2}`
        )
        return balance
      }
    } catch (error) {
      console.log(`TS: disburser balance `, error)
      return 0
    }
  }

  async isTokenSupported({
    layer,
    tokenAdress,
    destChainId,
  }: {
    layer: string
    tokenAdress: string
    destChainId: string
  }) {
    try {
      const lightBridgeAddress =
        layer === Layer.L1
          ? networkService.addresses.Proxy__L1Teleportation
          : networkService.addresses.Proxy__L2Teleportation

      if (!lightBridgeAddress) {
        throw new Error(`${ERROR_CODE} invalid teleporation Address`)
      }

      const contract = new Contract(
        lightBridgeAddress,
        TeleportationABI,
        networkService.provider?.getSigner()
      )

      if (tokenAdress === '0x4200000000000000000000000000000000000006') {
        tokenAdress = constants.AddressZero
      }

      return contract.supportedTokens(tokenAdress, destChainId)
    } catch (error) {
      console.log(`TS: supportedTokens`, error)
      return { supported: false }
    }
  }

  async deposit({
    layer,
    tokenAddress,
    value,
    destChainId,
  }: {
    value: string
    layer: string
    destChainId: number
    tokenAddress: string
  }) {
    try {
      const lightBridgeAddress =
        layer === Layer.L1
          ? networkService.addresses.Proxy__L1Teleportation
          : networkService.addresses.Proxy__L2Teleportation

      const msgVal =
        tokenAddress === networkService.addresses.L1_ETH_Address ||
        tokenAddress === networkService.addresses.NETWORK_NATIVE_TOKEN
          ? { value }
          : {}

      const contract = new Contract(
        lightBridgeAddress,
        TeleportationABI,
        networkService.provider!.getSigner()
      )

      if (tokenAddress === networkService.addresses.NETWORK_NATIVE_TOKEN) {
        tokenAddress = constants.AddressZero
      }

      const payload = await contract.supportedTokens(tokenAddress, destChainId)

      if (!payload.supported) {
        throw new Error(
          `${ERROR_CODE} Asset ${tokenAddress} not supported for chain ${destChainId}`
        )
      }

      const depositTx = await contract.teleportAsset(
        tokenAddress,
        value,
        destChainId,
        msgVal
      )

      await depositTx.wait()

      return true
    } catch (error) {
      console.log(`Teleport: deposit error`, error)
      return error
    }
  }
}

export const lightBridgeService = new LightBridgeService()
