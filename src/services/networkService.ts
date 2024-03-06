/* eslint-disable quotes */
/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { CrossChainMessenger } from '@bobanetwork/sdk'
import { addBobaFee } from 'actions/setupAction'
import metaTransactionAxiosInstance from 'api/metaTransactionAxios'
import { Contract, ethers } from 'ethers'

import {
  CHAIN_ID_LIST,
  Network,
  NetworkType,
  getNetworkDetail,
  networkLimitedAvailability,
  pingRpcUrl,
} from 'util/network/network.util'
import tokenInfo from '@bobanetwork/register/addresses/tokenInfo.json'
import walletService, { WalletService } from './wallet.service'

import {
  BOBAABI,
  BobaGasPriceOracleABI,
  GovernorBravoDelegateABI,
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L1StandardBridgeABI,
  L2LiquidityPoolABI,
  L2OutputOracleABI,
  L2StandardBridgeABI,
  L2StandardBridgeABIAnchorage,
  L2StandardERC20ABI,
  L2ToL1MessagePasserABI,
  OVM_GasPriceOracleABI,
  OptimismPortalABI,
  TeleportationABI,
} from './abi'

import { JsonRpcProvider } from '@ethersproject/providers'
import {
  NetworkDetailChainConfig,
  TxPayload,
} from '../util/network/config/network-details.types'
import appService from './app.service'
import { getToken } from 'actions/tokenAction'

const ERROR_ADDRESS = '0x0000000000000000000000000000000000000000'
const L2GasOracle = '0x420000000000000000000000000000000000000F'
const L2_SECONDARYFEETOKEN_ADDRESS =
  '0x4200000000000000000000000000000000000023'

let allTokens: TokenAddresses = {}

//#region types
type TokenList = Record<
  string,
  {
    name: string
    symbol: string
    decimals: number
  }
>

type TokenInfoForNetwork = {
  L1: TokenList
  L2: TokenList
}

type TokenAddresses = Record<string, { L1: string; L2: string }>

export class NetworkService {
  addresses: Record<string, string>

  networkType?: NetworkType
  network?: Network
  networkConfig?: any
  L1Provider?: JsonRpcProvider
  L2Provider?: JsonRpcProvider
  L1orL2?: 'L1' | 'L2'

  // L1 native details.
  L1NativeTokenSymbol?: string
  L1NativeTokenName?: string
  tokenInfo?: TokenInfoForNetwork

  // populated by initializeAccount
  provider?: JsonRpcProvider
  chainId?: string | number
  account?: string

  tokenAddresses?: TokenAddresses
  supportedTokens: string[]
  supportedTokenAddresses: TokenAddresses
  supportedAltL1Chains?: string[] // @todo can be removed.

  // @todo remove and make use of this.networkConfig in places where it's getting used.
  payloadForL1SecurityFee?: TxPayload
  gasEstimateAccount?: string

  // #Contracts @todo remove and move to sepecific services files.
  L1_TEST_Contract?: Contract
  L2_TEST_Contract?: Contract
  L2_ETH_Contract?: Contract
  BobaContract?: Contract
  xBobaContract?: Contract
  delegateContract?: Contract
  gasOracleContract?: Contract
  L1StandardBridgeContract?: Contract
  L2StandardBridgeContract?: Contract
  Teleportation?: Contract
  L1LPContract?: Contract
  L2LPContract?: Contract

  //#region Anchorage specific
  L2ToL1MessagePasser?: Contract
  L2OutputOracle?: Contract
  OptimismPortal?: Contract

  watcher?: CrossChainMessenger
  fastWatcher?: CrossChainMessenger
  walletService: WalletService

  constructor() {
    this.addresses = {}

    this.supportedTokens = []
    this.supportedTokenAddresses = {}
    this.walletService = walletService
  }

  // caching address for user further in application.
  getAddressCached(
    cache: Record<string, string>, /// @todo double check if we can remove
    contractName: string,
    varToSet: string
  ): boolean {
    const address = cache[contractName]
    if (typeof address === 'undefined') {
      return false
    } else {
      this.addresses = {
        ...this.addresses,
        [varToSet]: address,
      }
      return true
    }
  }

  getAllAddresses() {
    return this.addresses
  }

  isAnchorageEnabled() {
    if (
      this.networkType === NetworkType.TESTNET &&
      this.network === Network.ETHEREUM_SEPOLIA
    ) {
      return true
    }
    return false
  }

  async getBobaFeeChoice() {
    if (!this.isAnchorageEnabled()) {
      const bobaFeeContract = new ethers.Contract(
        this.addresses.Boba_GasPriceOracle,
        BobaGasPriceOracleABI,
        this.L2Provider
      )

      try {
        const priceRatio = await bobaFeeContract.priceRatio()

        let feeChoice
        if (this.network === Network.ETHEREUM) {
          feeChoice = await bobaFeeContract.bobaFeeTokenUsers(this.account)
        } else {
          // this returns weather the secondary token getting use as tokenfee
          feeChoice = await bobaFeeContract.secondaryFeeTokenUsers(this.account)
          // if it's false which means boba is getting used as tokenfee which is default value.
          feeChoice = !feeChoice
        }
        const bobaFee = {
          priceRatio: priceRatio.toString(),
          feeChoice,
        }
        await addBobaFee(bobaFee)
        return bobaFee
      } catch (error) {
        console.log(error)
        return error
      }
    }
  }

  async getETHMetaTransaction() {
    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]

    const owner = this.account
    const spender = this.addresses.Proxy__Boba_GasPriceOracle

    const Boba_GasPriceOracle = new ethers.Contract(
      this.addresses.Proxy__Boba_GasPriceOracle,
      BobaGasPriceOracleABI,
      this.provider!.getSigner()
    )

    let rawValue
    if (this.network === Network.ETHEREUM) {
      rawValue = await Boba_GasPriceOracle.getBOBAForSwap()
    } else {
      rawValue = await Boba_GasPriceOracle.getSecondaryFeeTokenForSwap()
    }

    const value = rawValue.toString()

    let l2SecondaryFeeTokenAddress = L2_SECONDARYFEETOKEN_ADDRESS
    if (Network.ETHEREUM === this.network && this.chainId === 1) {
      l2SecondaryFeeTokenAddress = allTokens.BOBA.L2
    }

    const bobaContract = new ethers.Contract(
      l2SecondaryFeeTokenAddress,
      BOBAABI,
      this.L2Provider
    )

    const nonce = (await bobaContract!.nonces(this.account)).toNumber()
    const deadline = Math.floor(Date.now() / 1000) + 300
    const verifyingContract = bobaContract!.address

    const name = await bobaContract!.name()
    const version = '1'
    const chainId = (await this.L2Provider!.getNetwork()).chainId

    const data = {
      primaryType: 'Permit',
      types: { EIP712Domain, Permit },
      domain: { name, version, chainId, verifyingContract },
      message: { owner, spender, value, nonce, deadline },
    }

    let signature

    try {
      signature = await this.provider!.send('eth_signTypedData_v4', [
        this.account,
        JSON.stringify(data),
      ])
    } catch (error) {
      return error
    }

    try {
      // change url if network is ethereum
      const swapUrl =
        this.network === Network.ETHEREUM
          ? '/send.swapBOBAForETH'
          : '/send.swapSecondaryFeeToken'
      await metaTransactionAxiosInstance(this.networkConfig).post(swapUrl, {
        owner,
        spender,
        value,
        deadline,
        signature,
        data,
      })
      await this.getBobaFeeChoice()
    } catch (error: any) {
      let errorData = error.response.data.error
      if (errorData.hasOwnProperty('error')) {
        errorData = errorData.error.error.body
      }
      return errorData
    }
  }

  async initializeBase({ networkGateway: network, networkType }) {
    this.network = network //// refer this in other services and clean up iteratively.
    this.networkType = networkType // e.g. mainnet | sepolia | ...
    // defines the set of possible networks along with chainId for L1 and L2
    const networkDetail = getNetworkDetail({
      network,
      networkType,
    })

    this.networkConfig = networkDetail

    try {
      if (Network[network]) {
        this.payloadForL1SecurityFee = networkDetail.payloadForL1SecurityFee
        this.gasEstimateAccount = networkDetail.gasEstimateAccount
      }

      let activeL1RpcURL = networkDetail['L1']['rpcUrl'][0]
      for (const rpcURL of networkDetail['L1']['rpcUrl']) {
        if (await pingRpcUrl(rpcURL)) {
          activeL1RpcURL = rpcURL
          break
        }
      }

      this.L1Provider = new ethers.providers.StaticJsonRpcProvider(
        activeL1RpcURL
      )

      let activeL2RpcURL = networkDetail['L2']['rpcUrl'][0]
      for (const rpcURL of networkDetail['L2']['rpcUrl']) {
        if (await pingRpcUrl(rpcURL)) {
          activeL2RpcURL = rpcURL
          break
        }
      }

      this.L2Provider = new ethers.providers.StaticJsonRpcProvider(
        activeL2RpcURL
      )

      this.L1NativeTokenSymbol = networkDetail['L1']['symbol']
      this.L1NativeTokenName =
        networkDetail['L1']['tokenName'] || this.L1NativeTokenSymbol

      appService.setupInitState({
        l1Token: this.L1NativeTokenSymbol,
        l1TokenName: this.L1NativeTokenName,
      })

      // load L1 network specific tokens.
      const chainId = (await this.L1Provider!.getNetwork()).chainId
      this.tokenInfo = tokenInfo[chainId]

      // fetch supported tokens, addresses, assets for network selected.
      const tokenAsset = appService.fetchSupportedAssets({
        network,
        networkType,
      })

      if (tokenAsset) {
        this.supportedTokens = tokenAsset.tokens
        this.supportedTokenAddresses = tokenAsset.tokenAddresses
        this.supportedAltL1Chains = tokenAsset.altL1Chains
      }

      // setting up all address;
      if (!!Network[network]) {
        this.addresses = appService.fetchAddresses({
          network,
          networkType,
        })
      }

      // NOTE: should invoke for anchorage.
      if (!this.isAnchorageEnabled() && this.network === Network.ETHEREUM) {
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__L1LiquidityPool',
            'L1LPAddress'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__L2LiquidityPool',
            'L2LPAddress'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__BobaFixedSavings',
            'BobaFixedSavings'
          )
        ) {
          return
        }
      }

      // Note: should bypass if limitedNetworkAvailability & anchorage not enabled.
      const isLimitedNetwork = networkLimitedAvailability(networkType, network)
      if (!isLimitedNetwork && !this.isAnchorageEnabled()) {
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__L1CrossDomainMessenger',
            'L1MessengerAddress'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__L1CrossDomainMessengerFast',
            'L1FastMessengerAddress'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__L1StandardBridge',
            'L1StandardBridgeAddress'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'Proxy__Boba_GasPriceOracle',
            'Boba_GasPriceOracle'
          )
        ) {
          return
        }
      }

      // not critical
      this.getAddressCached(
        this.addresses,
        'DiscretionaryExitFee',
        'DiscretionaryExitFee'
      )

      if (!isLimitedNetwork) {
        let L1StandardBridgeAddress

        // todo remove once migrated to anchorage
        if (this.addresses.L1StandardBridgeAddress) {
          L1StandardBridgeAddress = this.addresses.L1StandardBridgeAddress
        } else {
          L1StandardBridgeAddress = this.addresses.L1StandardBridgeProxy
            ? this.addresses.L1StandardBridgeProxy
            : this.addresses.L1StandardBridge
        }

        if (L1StandardBridgeAddress) {
          this.L1StandardBridgeContract = new ethers.Contract(
            L1StandardBridgeAddress, // uses right addressed depending on ENABLE_ANCHORAGE
            L1StandardBridgeABI,
            this.L1Provider
          )
        }

        const tokenList = {}

        this.supportedTokens.forEach((key) => {
          const L1a = this.addresses['TK_L1' + key]
          const L2a = this.addresses['TK_L2' + key]

          if (key === 'xBOBA') {
            if (L2a === ERROR_ADDRESS) {
              return false
            } else {
              tokenList[key] = {
                L1: 'xBOBA',
                L2: L2a,
              }
            }
          }

          // NOTE: if not in address manager then refer it from token assets config.
          if (typeof L1a === 'undefined' || typeof L2a === 'undefined') {
            if (typeof this.supportedTokenAddresses[key] !== 'undefined') {
              tokenList[key] = this.supportedTokenAddresses[key]
            }
            return false
          } else {
            tokenList[key] = {
              L1: L1a,
              L2: L2a,
            }
          }
        })

        this.tokenAddresses = tokenList
        allTokens = tokenList

        // /*The test token*/
        this.L1_TEST_Contract = new ethers.Contract(
          allTokens.BOBA?.L1, //this will get changed anyway when the contract is used
          L1ERC20ABI,
          this.L1Provider
        )

        this.L2_TEST_Contract = new ethers.Contract(
          allTokens.BOBA?.L2, //this will get changed anyway when the contract is used
          L2StandardERC20ABI,
          this.L2Provider
        )

        if (
          this.addresses.L2ToL1MessagePasserProxy ||
          this.addresses.L2ToL1MessagePasser
        ) {
          this.L2ToL1MessagePasser = new ethers.Contract(
            this.addresses.L2ToL1MessagePasser
              ? this.addresses.L2ToL1MessagePasser
              : this.addresses.L2ToL1MessagePasserProxy,
            L2ToL1MessagePasserABI,
            this.L2Provider
          )
        }

        if (this.addresses.OptimismPortalProxy) {
          this.OptimismPortal = new ethers.Contract(
            this.addresses.OptimismPortalProxy,
            OptimismPortalABI,
            this.L1Provider
          )
        }

        if (this.addresses.L2OutputOracleProxy) {
          this.L2OutputOracle = new ethers.Contract(
            this.addresses.L2OutputOracleProxy,
            L2OutputOracleABI,
            this.L1Provider
          )
        }

        // Liquidity pools
        // TODO: review and remove if it's not getting used.
        this.L1LPContract = new ethers.Contract(
          this.addresses.L1LPAddress,
          L1LiquidityPoolABI,
          this.L1Provider
        )
        this.L2LPContract = new ethers.Contract(
          this.addresses.L2LPAddress,
          L2LiquidityPoolABI,
          this.L2Provider
        )

        // @todo remove once fully migrated
        if (!this.isAnchorageEnabled()) {
          this.watcher = new CrossChainMessenger({
            l1SignerOrProvider: this.L1Provider,
            l2SignerOrProvider: this.L2Provider,
            l1ChainId: chainId,
            fastRelayer: false,
          })
          this.fastWatcher = new CrossChainMessenger({
            l1SignerOrProvider: this.L1Provider,
            l2SignerOrProvider: this.L2Provider,
            l1ChainId: chainId,
            fastRelayer: true,
          })
        }
      }

      if (this.addresses.L2StandardBridgeAddress !== null) {
        this.L2StandardBridgeContract = new ethers.Contract(
          this.addresses.L2StandardBridgeAddress,
          this.isAnchorageEnabled()
            ? L2StandardBridgeABIAnchorage
            : L2StandardBridgeABI,
          this.L2Provider
        )
      }

      this.L2_ETH_Contract = new ethers.Contract(
        this.addresses.L2_ETH_Address,
        L2StandardERC20ABI,
        this.L2Provider
      )

      // Teleportation
      // not deployed on mainnets yet
      this.Teleportation = new ethers.Contract(
        // correct one is used accordingly, thus as last resort we use a wrong/dummy address to have this constant defined
        this.addresses.Proxy__L1Teleportation ??
          this.addresses.Proxy__L2Teleportation ??
          '0x000000000000000000000000000000000000dead', // cannot be 0x0 due to internal checks
        TeleportationABI
      )

      let l2SecondaryFeeTokenAddress = L2_SECONDARYFEETOKEN_ADDRESS
      if (Network.ETHEREUM === network && chainId === 1) {
        l2SecondaryFeeTokenAddress = allTokens.BOBA.L2
      }
      this.BobaContract = new ethers.Contract(
        l2SecondaryFeeTokenAddress,
        BOBAABI,
        this.L2Provider
      )

      if (Network.ETHEREUM === network) {
        this.xBobaContract = new ethers.Contract(
          allTokens.xBOBA.L2,
          BOBAABI,
          this.L2Provider
        )

        if (
          !this.getAddressCached(
            this.addresses,
            'GovernorBravoDelegate',
            'GovernorBravoDelegate'
          )
        ) {
          return
        }
        if (
          !this.getAddressCached(
            this.addresses,
            'GovernorBravoDelegator',
            'GovernorBravoDelegator'
          )
        ) {
          return
        }

        this.delegateContract = new ethers.Contract(
          this.addresses.GovernorBravoDelegate,
          GovernorBravoDelegateABI,
          this.L2Provider
        )
      }

      this.gasOracleContract = new ethers.Contract(
        L2GasOracle,
        OVM_GasPriceOracleABI,
        this.L2Provider
      )

      return 'enabled'
    } catch (error) {
      console.log(`NS: ERROR: InitializeBase `, error)
      return false
    }
  }

  async initializeAccount() {
    try {
      if (!window.ethereum) {
        return 'nometamask'
      }

      this.walletService.bindProviderListeners()

      // connect to the wallet
      this.provider = this.walletService.provider
      this.chainId = (await this.provider!.getNetwork()).chainId
      this.account = await this.provider!.getSigner().getAddress()

      const chainId = await this.provider!.getNetwork().then((nt) => nt.chainId)

      // defines the set of possible networks along with chainId for L1 and L2
      const networkDetail = getNetworkDetail({
        network: this.network!,
        networkType: this.networkType!,
      })

      const L1ChainId = networkDetail['L1']['chainId']
      const L2ChainId = networkDetail['L2']['chainId']

      if (
        !this.network ||
        typeof chainId === 'undefined' ||
        typeof L1ChainId === 'undefined' ||
        typeof L2ChainId === 'undefined'
      ) {
        return
      }

      // there are numerous possible chains we could be on also, either L1 or L2
      // at this point, we only know whether we want to be on which network etc

      if (!!Network[this.network] && chainId === L2ChainId) {
        this.L1orL2 = 'L2'
      } else if (!!Network[this.network] && chainId === L1ChainId) {
        this.L1orL2 = 'L1'
      } else {
        return 'wrongnetwork'
      }

      const isLimitedNetwork =
        CHAIN_ID_LIST[L1ChainId]?.limitedAvailability ||
        CHAIN_ID_LIST[L2ChainId]?.limitedAvailability
      // this should not do anything unless we changed chains
      if (this.L1orL2 === 'L2' && !isLimitedNetwork) {
        await this.getBobaFeeChoice()
      }

      return this.L1orL2 // return the layer we are actually on
    } catch (error) {
      console.log(`NS: ERROR: InitializeAccount `, error)
      return false
    }
  }

  // TODO: cleanup and move to walletService itself.
  async switchChain(targetLayer) {
    // ignore request if we are already on the target layer

    if (!targetLayer) {
      return false
    }

    const networkDetail = getNetworkDetail({
      network: this.network!,
      networkType: this.networkType!,
    })
    const targetIDHex = networkDetail[targetLayer].chainIdHex
    const rpcURL =
      targetLayer === 'L1'
        ? [this.L1Provider!.connection.url]
        : networkDetail[targetLayer].rpcUrl
    const chainParam = {
      chainId: '0x' + networkDetail[targetLayer].chainId.toString(16),
      chainName: networkDetail[targetLayer].name,
      rpcUrls: [...rpcURL],
      nativeCurrency: {
        name: networkDetail[targetLayer].tokenName,
        symbol: networkDetail[targetLayer].symbol,
        decimals: 18,
      },
      blockExplorerUrls: [
        networkDetail[targetLayer]?.blockExplorerUrl?.slice(0, -1),
      ],
    }

    return this.walletService.switchChain(targetIDHex, chainParam)
  }

  async addTokenList() {
    // Add the token to our master list, if we do not have it yet
    // if the token is already in the list, then this function does nothing
    // but if a new token shows up, then it will get added
    if (allTokens === null) {
      return
    }

    Object.keys(allTokens).forEach((token, i) => {
      getToken(allTokens[token].L1)
    })
  }
}

const networkService = new NetworkService()
export default networkService
