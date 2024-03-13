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

import { formatEther } from '@ethersproject/units'
import { CrossChainMessenger } from '@bobanetwork/sdk'

import { BigNumber, BigNumberish, Contract, ethers, utils } from 'ethers'

import store from 'store'
import { orderBy } from 'util/lodash'
import BN from 'bn.js'

import { logAmount } from 'util/amountConvert'
import { getToken } from 'actions/tokenAction'

import { addBobaFee } from 'actions/setupAction'

import {
  updateSignatureStatus_depositLP,
  updateSignatureStatus_exitLP,
  updateSignatureStatus_exitTRAD,
} from 'actions/signAction'

import omgxWatcherAxiosInstance from 'api/omgxWatcherAxios'
import coinGeckoAxiosInstance from 'api/coinGeckoAxios'
import metaTransactionAxiosInstance from 'api/metaTransactionAxios'

import { sortRawTokens } from 'util/common'
import { graphQLService } from './graphql.service'

import tokenInfo from '@bobanetwork/register/addresses/tokenInfo.json'

import { Layer, MIN_NATIVE_L1_BALANCE } from 'util/constant'
import {
  CHAIN_ID_LIST,
  getNetworkDetail,
  getRpcUrl,
  Network,
  networkLimitedAvailability,
  NetworkType,
  pingRpcUrl,
} from 'util/network/network.util'
import appService from './app.service'
import walletService, { WalletService } from './wallet.service'

import {
  BOBAABI,
  BobaFixedSavingsABI,
  BobaGasPriceOracleABI,
  DiscretionaryExitFeeABI,
  GovernorBravoDelegateABI,
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L1StandardBridgeABI,
  L2BillingContractABI,
  L2LiquidityPoolABI,
  L2OutputOracleABI,
  L2StandardBridgeABI,
  L2StandardBridgeABIAnchorage,
  L2StandardERC20ABI,
  L2ToL1MessagePasserABI,
  OptimismPortalABI,
  OVM_GasPriceOracleABI,
  TeleportationABI,
} from './abi'

import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import { LAYER } from '../containers/history/types'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
import {
  NetworkDetailChainConfig,
  TxPayload,
} from '../util/network/config/network-details.types'
import { LiquidityPoolLayer } from 'types/earn.types'

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
  L1: Record<string, TokenList>
  L2: Record<string, TokenList>
}

type TokenAddresses = Record<string, { L1: string; L2: string }>

class NetworkService {
  account?: string
  L1Provider?: JsonRpcProvider
  L2Provider?: JsonRpcProvider
  provider?: JsonRpcProvider
  chainId?: number
  environment?: string
  L1orL2?: 'L2' | 'L1'
  networkGateway?: Network
  networkType?: NetworkType
  watcher?: CrossChainMessenger
  fastWatcher?: CrossChainMessenger

  //#region contract_members
  L1_TEST_Contract?: Contract
  L2_TEST_Contract?: Contract
  L2_ETH_Contract?: Contract
  BobaContract?: Contract
  xBobaContract?: Contract
  delegateContract?: Contract
  gasOracleContract?: Contract
  L1StandardBridgeContract?: Contract
  L2StandardBridgeContract?: Contract
  LightBridge?: Contract
  L1LPContract?: Contract
  L2LPContract?: Contract

  //#region Anchorage specific
  L2ToL1MessagePasser?: Contract
  L2OutputOracle?: Contract
  OptimismPortal?: Contract
  //#endregion
  //#endregion

  tokenAddresses?: TokenAddresses
  L1GasLimit: number
  L2GasLimit: number
  gasEstimateAccount?: string
  payloadForL1SecurityFee?: TxPayload
  payloadForFastDepositBatchCost?: TxPayload
  supportedTokens: string[]
  supportedTokenAddresses: TokenAddresses
  supportedAltL1Chains: string[]
  tokenInfo?: TokenInfoForNetwork
  addresses
  network?: Network
  networkConfig?: NetworkDetailChainConfig
  walletService: WalletService

  L1NativeTokenSymbol
  L1NativeTokenName?: string

  constructor() {
    // gas
    this.L1GasLimit = 9999999
    // setting of this value not important since it's not connected to anything in the contracts
    // "param _l1Gas Unused, but included for potential forward compatibility considerations"
    this.L2GasLimit = 1300000 //use the same as the hardcoded receive

    // support token
    this.supportedTokens = []
    this.supportedTokenAddresses = {}

    // support alt l1 tokens
    this.supportedAltL1Chains = []

    // token info
    this.tokenInfo = {} as any

    // newly added properties to network services.
    this.addresses = {}

    // wallet service
    this.walletService = walletService
  }

  // NOTE: added check for anchorage to use in services
  isAnchorageEnabled() {
    if (
      this.networkType === NetworkType.TESTNET &&
      this.networkGateway === Network.ETHEREUM_SEPOLIA
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
        if (this.networkGateway === Network.ETHEREUM) {
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

  async estimateMinL1NativeTokenForFee() {
    if (this.L1orL2 !== 'L2') {
      return 0
    }

    if (this.networkGateway === Network.ETHEREUM) {
      // for ethereum l1 fee is always const to 0.002.
      return MIN_NATIVE_L1_BALANCE
    } else {
      // for alt l1 this fee can change
      const bobaFeeContract = new ethers.Contract(
        this.addresses.Boba_GasPriceOracle,
        BobaGasPriceOracleABI,
        this.provider!.getSigner()
      )

      const minTokenForFee = await bobaFeeContract.secondaryFeeTokenMinimum()

      return logAmount(minTokenForFee.toString(), 18)
    }
  }

  async switchFee(targetFee) {
    if (this.L1orL2 !== 'L2') {
      return
    }

    const bobaFeeContract = new ethers.Contract(
      this.addresses.Boba_GasPriceOracle,
      BobaGasPriceOracleABI,
      this.provider!.getSigner()
    )

    try {
      let tx: TransactionResponse

      if (targetFee === 'BOBA') {
        tx = await bobaFeeContract.useBobaAsFeeToken()
        await tx.wait()
      } else if (targetFee === 'ETH') {
        tx = await bobaFeeContract.useETHAsFeeToken()
        await tx.wait()
      } else if (targetFee === this.L1NativeTokenSymbol) {
        tx = await bobaFeeContract.useSecondaryFeeTokenAsFeeToken()
        await tx.wait()
      } else {
        console.error(
          `NetworkService:switchFee: Unknown targetFee selected: ${targetFee}`
        )
        return
      }

      await this.getBobaFeeChoice()

      return tx
    } catch (error) {
      console.log(error)
      return error
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
    if (this.networkGateway === Network.ETHEREUM) {
      rawValue = await Boba_GasPriceOracle.getBOBAForSwap()
    } else {
      rawValue = await Boba_GasPriceOracle.getSecondaryFeeTokenForSwap()
    }

    const value = rawValue.toString()

    const nonce = (await this.BobaContract!.nonces(this.account)).toNumber()
    const deadline = Math.floor(Date.now() / 1000) + 300
    const verifyingContract = this.BobaContract!.address

    const name = await this.BobaContract!.name()
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
        this.networkGateway === Network.ETHEREUM
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

  async getAddressCached(cache, contractName, varToSet) {
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

  async initializeBase({ networkGateway: network, networkType }) {
    this.network = network //// refer this in other services and clean up iteratively.
    this.networkGateway = network // e.g. mainnet | goerli | ...
    this.networkType = networkType // e.g. mainnet | goerli | ...
    // defines the set of possible networks along with chainId for L1 and L2
    const networkDetail = getNetworkDetail({
      network,
      networkType,
    })

    this.networkConfig = networkDetail

    try {
      if (Network[network]) {
        this.payloadForL1SecurityFee = networkDetail.payloadForL1SecurityFee
        this.payloadForFastDepositBatchCost =
          networkDetail.payloadForFastDepositBatchCost
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

      const activeL2RpcURL = networkDetail['L2']['rpcUrl'][0]
      for (const rpcURL of networkDetail['L2']['rpcUrl']) {
        if (await pingRpcUrl(rpcURL)) {
          activeL1RpcURL = rpcURL
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

      // get the tokens based on l1ChainId
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

      let addresses = {}
      // setting up all address;
      if (!!Network[network]) {
        addresses = appService.fetchAddresses({
          network,
          networkType,
        })
      }
      this.addresses = addresses

      // NOTE: should invoke for anchorage.
      if (!this.isAnchorageEnabled() && this.network === Network.ETHEREUM) {
        if (
          !(await this.getAddressCached(
            this.addresses,
            'BobaMonsters',
            'BobaMonsters'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__L1LiquidityPool',
            'L1LPAddress'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__L2LiquidityPool',
            'L2LPAddress'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__BobaFixedSavings',
            'BobaFixedSavings'
          ))
        ) {
          return
        }
      }

      // Note: should bypass if limitedNetworkAvailability & anchorage not enabled.
      const isLimitedNetwork = networkLimitedAvailability(networkType, network)
      if (!isLimitedNetwork && !this.isAnchorageEnabled()) {
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__L1CrossDomainMessenger',
            'L1MessengerAddress'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__L1CrossDomainMessengerFast',
            'L1FastMessengerAddress'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__L1StandardBridge',
            'L1StandardBridgeAddress'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'Proxy__Boba_GasPriceOracle',
            'Boba_GasPriceOracle'
          ))
        ) {
          return
        }
      }

      // not critical
      await this.getAddressCached(
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
        if (this.addresses.L1LPAddress) {
          this.L1LPContract = new ethers.Contract(
            this.addresses.L1LPAddress,
            L1LiquidityPoolABI,
            this.L1Provider
          )
        }
        if (this.addresses.L1LPAddress) {
          this.L2LPContract = new ethers.Contract(
            this.addresses.L2LPAddress,
            L2LiquidityPoolABI,
            this.L2Provider
          )
        }

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
      this.LightBridge = new ethers.Contract(
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
          !(await this.getAddressCached(
            this.addresses,
            'GovernorBravoDelegate',
            'GovernorBravoDelegate'
          ))
        ) {
          return
        }
        if (
          !(await this.getAddressCached(
            this.addresses,
            'GovernorBravoDelegator',
            'GovernorBravoDelegator'
          ))
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
        network: this.networkGateway!,
        networkType: this.networkType!,
      })

      const L1ChainId = networkDetail['L1']['chainId']
      const L2ChainId = networkDetail['L2']['chainId']

      if (
        !this.networkGateway ||
        typeof chainId === 'undefined' ||
        typeof L1ChainId === 'undefined' ||
        typeof L2ChainId === 'undefined'
      ) {
        return
      }

      // there are numerous possible chains we could be on also, either L1 or L2
      // at this point, we only know whether we want to be on which network etc

      if (!!Network[this.networkGateway] && chainId === L2ChainId) {
        this.L1orL2 = 'L2'
      } else if (!!Network[this.networkGateway] && chainId === L1ChainId) {
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

  async switchChain(targetLayer) {
    // ignore request if we are already on the target layer

    if (!targetLayer) {
      return false
    }

    const networkDetail = getNetworkDetail({
      network: this.networkGateway!,
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

  async getL1FeeBalance() {
    try {
      const balance = await this.L1Provider!.getBalance(this.account!)
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL1FeeBalance error:', error)
      return error
    }
  }

  async getL2BalanceETH() {
    try {
      const balance = await this.L2Provider!.getBalance(this.account!)
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL2BalanceETH error:', error)
      return error
    }
  }

  async getL2BalanceBOBA() {
    try {
      const ERC20Contract = new ethers.Contract(
        this.tokenAddresses!['BOBA'].L2,
        L2StandardERC20ABI, //any old abi will do...
        this.provider!.getSigner()
      )
      const balance = await ERC20Contract.balanceOf(this.account)
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL2BalanceBOBA error:', error)
      return error
    }
  }

  async getBalances() {
    try {
      let layer1Balances
      let layer2Balances
      if (
        this.network === Network.ETHEREUM ||
        this.network === Network.ETHEREUM_SEPOLIA
      ) {
        layer1Balances = [
          {
            address: this.addresses.L1_ETH_Address,
            addressL2: this.addresses.L2_ETH_Address,
            currency: this.addresses.L1_ETH_Address,
            symbol: 'ETH',
            decimals: 18,
            balance: new BN(0),
          },
        ]

        layer2Balances = [
          {
            address: this.addresses.L2_ETH_Address,
            addressL1: this.addresses.L1_ETH_Address,
            addressL2: this.addresses.L2_ETH_Address,
            currency: this.addresses.L1_ETH_Address,
            symbol: 'ETH',
            decimals: 18,
            balance: new BN(0),
          },
        ]
      } else {
        layer1Balances = [
          {
            address: this.addresses.L1_ETH_Address,
            addressL2:
              this.addresses['TK_L2' + networkService.L1NativeTokenSymbol],
            currency: this.addresses.L1_ETH_Address,
            symbol: networkService.L1NativeTokenSymbol,
            decimals: 18,
            balance: new BN(0),
          },
        ]

        layer2Balances = [
          {
            address: this.addresses.L2_ETH_Address,
            addressL1: this.addresses.TK_L1BOBA,
            addressL2: this.addresses.L2_ETH_Address,
            currency: this.addresses.TK_L1BOBA,
            symbol: 'BOBA',
            decimals: 18,
            balance: new BN(0),
          },
        ]
      }

      // Always check ETH
      const layer1Balance = await this.L1Provider!.getBalance(this.account!)
      const layer2Balance = await this.L2Provider!.getBalance(this.account!)

      layer1Balances[0].balance = new BN(layer1Balance.toString())
      layer2Balances[0].balance = new BN(layer2Balance.toString())

      const state = store.getState()
      const tA = Object.values(state.tokenList)

      const tokenC = new ethers.Contract(
        this.addresses.L1_ETH_Address,
        L1ERC20ABI,
        this.L1Provider
      )

      const getERC20Balance = async (token, tokenAddress, layer, provider) => {
        const balance = await tokenC
          .attach(tokenAddress)
          .connect(provider)
          .balanceOf(this.account)
        return {
          ...token,
          balance: new BN(balance.toString()),
          layer,
          address: layer === 'L1' ? token.addressL1 : token.addressL2,
          symbol: token.symbolL1,
        }
      }

      const getBalancePromise: any = []

      tA.forEach((token: any) => {
        if (token.addressL1 === null) {
          return
        }
        if (token.addressL2 === null) {
          return
        }
        if (
          this.network === Network.ETHEREUM ||
          this.network === Network.ETHEREUM_SEPOLIA
        ) {
          if (token.addressL1 === this.addresses.L1_ETH_Address) {
            return
          }
          if (token.addressL2 === this.addresses.L2_ETH_Address) {
            return
          }
        } else {
          if (token.addressL1 === this.addresses.L1_ETH_Address) {
            return getBalancePromise.push(
              getERC20Balance(token, token.addressL2, 'L2', this.L2Provider)
            )
          }
          if (token.addressL2 === this.addresses.L2_BOBA_Address) {
            return getBalancePromise.push(
              getERC20Balance(token, token.addressL1, 'L1', this.L1Provider)
            )
          }
        }

        if (
          [
            'xBOBA',
            'WAGMIv0',
            'WAGMIv1',
            'WAGMIv2',
            'WAGMIv2-Oolong',
            'WAGMIv3',
            'WAGMIv3-Oolong',
            'OLO',
          ].includes(token.symbolL1)
        ) {
          //there is no L1 xBOBA, WAGMIv0, WAGMIv1, WAGMIv2, WAGMIv2OLO, WAGMIv3, WAGMIv3OLO, OLO
          getBalancePromise.push(
            getERC20Balance(token, token.addressL2, 'L2', this.L2Provider)
          )
        } else {
          getBalancePromise.push(
            getERC20Balance(token, token.addressL1, 'L1', this.L1Provider)
          )
          getBalancePromise.push(
            getERC20Balance(token, token.addressL2, 'L2', this.L2Provider)
          )
        }
      })

      const tokenBalances = await Promise.allSettled(getBalancePromise).then(
        (results) =>
          results
            .filter((result) => {
              switch (result.status) {
                case 'fulfilled': {
                  return true
                }
                case 'rejected': {
                  console.log('NS: getBalances:', result.reason)
                  return false
                }
              }
            })
            .map((result: any) => result.value)
      )

      tokenBalances.forEach((token) => {
        if (
          token.layer === 'L1' &&
          token.symbol !== 'xBOBA' &&
          token.symbol !== 'WAGMIv0' &&
          token.symbol !== 'WAGMIv1' &&
          token.symbol !== 'WAGMIv2' &&
          token.symbol !== 'WAGMIv2-Oolong' &&
          token.symbol !== 'WAGMIv3' &&
          token.symbol !== 'WAGMIv3-Oolong'
        ) {
          layer1Balances.push(token)
        } else if (token.layer === 'L2') {
          layer2Balances.push(token)
        }
      })

      return {
        layer1: orderBy(layer1Balances, (i) => i.currency),
        layer2: orderBy(layer2Balances, (i) => i.currency),
      }
    } catch (error) {
      console.log('NS: getBalances error:', error)
      return error
    }
  }

  /** @dev Once we fully migrated to Anchorage we might want to merge this function with depositETHL2. */
  async depositETHAnchorage({ recipient = null, L1DepositAmountWei }) {
    try {
      setFetchDepositTxBlock(false)
      let depositTX
      // @todo make sure to evaluate and update the fallback logic.
      const isFallback = false // TODO evaluate when to use fallback optimismportal

      const signer = networkService.provider?.getSigner()

      // deposit fallback via OptimismPortal
      if (isFallback) {
        if (recipient) {
          depositTX = await networkService.OptimismPortal?.connect(
            signer!
          ).depositTransaction(recipient, L1DepositAmountWei, 100000, false, [])
        } else {
          depositTX = await signer!.sendTransaction({
            to: this.OptimismPortal?.address,
            value: L1DepositAmountWei,
          })
        }
      } else {
        // deposit preferred way via L1StandardBridge
        if (recipient) {
          depositTX = await this.L1StandardBridgeContract!.connect(
            signer!
          ).depositETHTo(recipient, 100000, [], { value: L1DepositAmountWei })
        } else {
          depositTX = await this.L1StandardBridgeContract!.connect(
            signer!
          ).depositETH(100000, [], { value: L1DepositAmountWei })
        }
      }

      setFetchDepositTxBlock(true)
      const received = await depositTX.wait()

      return received
    } catch (error) {
      console.log('NS: depositETHL2 error:', error)
      return error
    }
  }

  //Move ETH from L1 to L2 using the standard deposit system
  /******
   * Deposit ETH from L1 to L2.
   * Deposit ETH from L1 to another L2 account.
   * */
  async depositETHL2({ recipient = null, value_Wei_String }) {
    try {
      setFetchDepositTxBlock(false)

      let depositTX

      if (this.network === Network.ETHEREUM) {
        if (!recipient) {
          depositTX = await this.L1StandardBridgeContract!.connect(
            this.provider!.getSigner()
          ).depositETH(
            this.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
        } else {
          depositTX = await this.L1StandardBridgeContract!.connect(
            this.provider!.getSigner()
          ).depositETHTo(
            recipient,
            this.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
        }
      } else {
        if (!recipient) {
          depositTX = await this.L1StandardBridgeContract!.connect(
            this.provider!.getSigner()
          ).depositNativeToken(
            this.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
        } else {
          depositTX = await this.L1StandardBridgeContract!.connect(
            this.provider!.getSigner()
          ).depositNativeTokenTo(
            recipient,
            this.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString()),
            {
              value: value_Wei_String,
            }
          )
        }
      }

      setFetchDepositTxBlock(true)
      //at this point the tx has been submitted, and we are waiting...

      const opts = {
        fromBlock: -4000,
      }

      const receipt = await this.watcher!.waitForMessageReceipt(depositTX, opts)
      const txReceipt = receipt.transactionReceipt
      console.log('completed Deposit! L2 tx hash:', receipt.transactionReceipt)
      return txReceipt
    } catch (error) {
      console.log('NS: depositETHL2 error:', error)
      return error
    }
  }

  //Transfer funds from one account to another, on the L2
  async transfer(
    address: string,
    value_Wei_String: BigNumberish,
    currency: string
  ) {
    let tx: TransactionResponse

    try {
      if (currency === this.addresses.L2_ETH_Address) {
        //we are sending ETH

        const wei = BigNumber.from(value_Wei_String)

        tx = await this.provider!.getSigner().sendTransaction({
          to: address,
          value: ethers.utils.hexlify(wei),
        })
      } else {
        //any ERC20 json will do....
        tx = await this.L2_TEST_Contract!.connect(this.provider!.getSigner())
          .attach(currency)
          .transfer(address, value_Wei_String)
        await tx.wait()
      }

      return tx
    } catch (error) {
      console.log('NS: transfer error:', error)
      return error
    }
  }

  async checkAllowance(currencyAddress: string, targetContract: string) {
    console.log('currencyAddress', currencyAddress)
    console.log('targetContract', targetContract)
    try {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L1ERC20ABI, //could use any abi - just something with .allowance
        this.provider!.getSigner()
      )
      return await ERC20Contract.allowance(this.account, targetContract)
    } catch (error) {
      console.log('NS: checkAllowance error:', error)
      return error
    }
  }

  async approveERC20(
    value_Wei_String: BigNumberish,
    currency: string,
    approveContractAddress: string = this.addresses.L1StandardBridgeAddress,
    contractABI = L1ERC20ABI
  ) {
    try {
      const ERC20Contract = new ethers.Contract(
        currency,
        contractABI,
        this.provider!.getSigner()
      )

      /***********************/

      let allowance_BN = await ERC20Contract.allowance(
        this.account,
        approveContractAddress
      )
      console.log('Initial Allowance is:', allowance_BN)

      /*
      OMG IS A SPECIAL CASE - allowance needs to be set to zero, and then
      set to actual amount, unless current approval amount is equal to, or
      bigger than, the current approval value
      */
      if (
        this.networkGateway === Network.ETHEREUM &&
        allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
        currency.toLowerCase() === allTokens.OMG.L1.toLowerCase()
      ) {
        console.log(
          "Current OMG Token allowance too small - might need to reset to 0, unless it's already zero"
        )
        if (allowance_BN.gt(BigNumber.from('0'))) {
          const approveOMG = await ERC20Contract.approve(
            approveContractAddress,
            ethers.utils.parseEther('0')
          )
          await approveOMG.wait()
          console.log('OMG Token allowance has been set to 0')
        }
      }

      //recheck the allowance
      allowance_BN = await ERC20Contract.allowance(
        this.account,
        approveContractAddress
      )
      console.log('Second Allowance is:', allowance_BN)

      const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

      console.log('Allowed?:', allowed)

      if (!allowed) {
        console.log('Not good enough - need to set to:', value_Wei_String)
        //and now, the normal allowance transaction
        const approveStatus = await ERC20Contract.approve(
          approveContractAddress,
          value_Wei_String
        )
        await approveStatus.wait()
        console.log('ERC20 L1 SWAP ops approved:', approveStatus)
      }

      return true
    } catch (error) {
      console.log('NS: approveERC20 error:', error)
      return error
    }
  }

  /** @dev Once we fully migrated to Anchorage we might want to merge this function with depositERC20. */
  async depositERC20Anchorage({
    recipient = null,
    L1DepositAmountWei,
    currency,
    currencyL2,
  }): Promise<any> {
    setFetchDepositTxBlock(false)
    const signer = this.provider?.getSigner()
    if (!signer) {
      console.error('no signer!')
    }

    const L1_ERC20_Contract = this.L1_TEST_Contract!.attach(currency)
    const L2_ERC20_Contract = this.L2_TEST_Contract!.attach(currencyL2)
    const L1BOBABalance = await L1_ERC20_Contract.balanceOf(this.account)
    const L2BOBABalance = await L2_ERC20_Contract.balanceOf(this.account)

    if (L1BOBABalance.lt(L1DepositAmountWei)) {
      console.error('Insufficient L1 token balance')
      return
    }

    const allowance_BN = await L1_ERC20_Contract.allowance(
      this.account,
      this.addresses.L1StandardBridgeProxy
    )

    const allowed = allowance_BN.gte(BigNumber.from(L1DepositAmountWei))

    if (!allowed) {
      const L1ApproveTx = await L1_ERC20_Contract.connect(signer!).approve(
        this.addresses.L1StandardBridgeProxy,
        L1DepositAmountWei
      )
      await L1ApproveTx.wait()
    }

    let L1DepositTx
    if (recipient) {
      L1DepositTx = await this.L1StandardBridgeContract!.connect(
        signer!
      ).depositERC20To(
        currency,
        currencyL2,
        recipient,
        L1DepositAmountWei,
        999999,
        '0x'
      )
    } else {
      L1DepositTx = await this.L1StandardBridgeContract!.connect(
        signer!
      ).depositERC20(currency, currencyL2, L1DepositAmountWei, 999999, '0x')
    }
    const depositReceipt = await L1DepositTx.wait()
    console.log(
      `Deposited ${ethers.utils.formatEther(
        L1DepositAmountWei
      )} tokens to L1 Standard Bridge`
    )

    setFetchDepositTxBlock(true)
    while (true) {
      const postL2BOBABalanceTmp = await L2_ERC20_Contract.balanceOf(
        this.account
      )
      if (!L2BOBABalance.eq(postL2BOBABalanceTmp)) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // TODO: Probably we want the l2Funds received tx receipt here
    return depositReceipt
  }

  //Used to move ERC20 Tokens from L1 to L2 using the classic deposit
  async depositErc20({
    recipient = null,
    value_Wei_String,
    currency,
    currencyL2,
  }) {
    setFetchDepositTxBlock(false)
    const L1_TEST_Contract = this.L1_TEST_Contract!.attach(currency)

    let allowance_BN = await L1_TEST_Contract.allowance(
      this.account,
      this.addresses.L1StandardBridgeAddress
    )
    try {
      /*
        OMG IS A SPECIAL CASE - allowance needs to be set to zero, and then
        set to actual amount, unless current approval amount is equal to, or
        bigger than, the current approval value
        */
      if (
        this.networkGateway === Network.ETHEREUM &&
        allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
        currency.toLowerCase() === allTokens.OMG.L1.toLowerCase()
      ) {
        console.log(
          "Current OMG Token allowance too small - might need to reset to 0, unless it's already zero"
        )
        if (allowance_BN.gt(BigNumber.from('0'))) {
          const approveOMG = await L1_TEST_Contract.approve(
            this.addresses.L1StandardBridgeAddress,
            ethers.utils.parseEther('0')
          )
          await approveOMG.wait()
          console.log('OMG Token allowance has been set to 0')
        }
      }

      //recheck the allowance
      allowance_BN = await L1_TEST_Contract.allowance(
        this.account,
        this.addresses.L1StandardBridgeAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

      if (!allowed) {
        //and now, the normal allowance transaction
        const approveStatus = await L1_TEST_Contract.connect(
          this.provider!.getSigner()
        ).approve(this.addresses.L1StandardBridgeAddress, value_Wei_String)
        await approveStatus.wait()
        console.log('ERC20 L1 ops approved:', approveStatus)
      }
      let depositTX
      if (!recipient) {
        // incase no recipient
        depositTX = await this.L1StandardBridgeContract!.connect(
          this.provider!.getSigner()
        ).depositERC20(
          currency,
          currencyL2,
          value_Wei_String,
          this.L2GasLimit,
          utils.formatBytes32String(new Date().getTime().toString())
        )
      } else {
        // deposit ERC20 to L2 account address.
        depositTX = await this.L1StandardBridgeContract!.connect(
          this.provider!.getSigner()
        ).depositERC20To(
          currency,
          currencyL2,
          recipient,
          value_Wei_String,
          this.L2GasLimit,
          utils.formatBytes32String(new Date().getTime().toString())
        )
      }
      setFetchDepositTxBlock(true)
      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()

      const opts = {
        fromBlock: -4000,
      }
      const receipt = await this.watcher!.waitForMessageReceipt(depositTX, opts)
      const txReceipt = receipt.transactionReceipt
      await this.getBalances()
      return txReceipt
    } catch (error) {
      console.log('NS: depositErc20 error:', error)
      return error
    }
  }

  //Standard 7 day exit from BOBA
  async exitBOBA(currencyAddress, value_Wei_String) {
    await updateSignatureStatus_exitTRAD(false)

    try {
      const L2BillingContract = new ethers.Contract(
        this.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        this.L2Provider
      )
      let BobaApprovalAmount = await L2BillingContract.exitFee()

      //now coming in as a value_Wei_String
      const value = BigNumber.from(value_Wei_String)

      const allowance = await this.checkAllowance(
        currencyAddress,
        this.addresses.DiscretionaryExitFee
      )

      const BobaAllowance = await this.checkAllowance(
        this.addresses.TK_L2BOBA,
        this.addresses.DiscretionaryExitFee
      )

      if (this.networkGateway === Network.ETHEREUM) {
        // Should approve BOBA
        if (
          utils.getAddress(currencyAddress) ===
          utils.getAddress(this.addresses.TK_L2BOBA)
        ) {
          BobaApprovalAmount = BobaApprovalAmount.add(value)
        }

        if (BobaAllowance.lt(BobaApprovalAmount)) {
          const res = await this.approveERC20(
            BobaApprovalAmount,
            this.addresses.TK_L2BOBA,
            this.addresses.DiscretionaryExitFee
          )
          if (!res) {
            return false
          }
        }
      }

      let otherField
      if (this.networkGateway === Network.ETHEREUM) {
        otherField =
          currencyAddress === this.addresses.L2_ETH_Address ? { value } : {}
      } else {
        otherField =
          currencyAddress === this.addresses.L2_ETH_Address
            ? { value: value.add(BobaApprovalAmount) }
            : { value: BobaApprovalAmount }
      }

      // Should approve other tokens
      if (
        currencyAddress !== this.addresses.L2_ETH_Address &&
        utils.getAddress(currencyAddress) !==
          utils.getAddress(this.addresses.TK_L2BOBA) &&
        allowance.lt(value)
      ) {
        const res = await this.approveERC20(
          value,
          currencyAddress,
          this.addresses.DiscretionaryExitFee
        )
        if (!res) {
          return false
        }
      }

      const DiscretionaryExitFeeContract = new ethers.Contract(
        this.addresses.DiscretionaryExitFee,
        DiscretionaryExitFeeABI,
        this.provider!.getSigner()
      )

      const tx = await DiscretionaryExitFeeContract.payAndWithdraw(
        currencyAddress,
        value_Wei_String,
        this.L1GasLimit,
        utils.formatBytes32String(new Date().getTime().toString()),
        otherField
      )

      //everything submitted... waiting
      await tx.wait()

      //can close window now
      await updateSignatureStatus_exitTRAD(true)

      return tx
    } catch (error) {
      console.log('NS: exitBOBA error:', error)
      return error
    }
  }

  /* Estimate cost of Classical Exit to L1 */
  async getExitCost(currencyAddress: string) {
    try {
      let approvalCost_BN = BigNumber.from('0')

      const gasPrice = await this.L2Provider!.getGasPrice()
      console.log('Classical exit gas price', gasPrice.toString())

      if (currencyAddress !== this.addresses.L2_ETH_Address) {
        const ERC20Contract = new ethers.Contract(
          currencyAddress,
          L2StandardERC20ABI, //any old abi will do...
          this.provider!.getSigner()
        )

        const tx = await ERC20Contract.populateTransaction.approve(
          this.addresses.DiscretionaryExitFee,
          utils.parseEther('1.0')
        )

        const approvalGas_BN = await this.L2Provider!.estimateGas({
          ...tx,
          from: this.gasEstimateAccount,
        })
        approvalCost_BN = approvalGas_BN.mul(gasPrice)
        console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
      }

      const DiscretionaryExitFeeContract = new ethers.Contract(
        this.addresses.DiscretionaryExitFee,
        DiscretionaryExitFeeABI,
        this.provider!.getSigner()
      )

      const L2BillingContract = new ethers.Contract(
        this.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        this.L2Provider
      )
      const exitFee = await L2BillingContract.exitFee()
      let value = utils.parseEther('0.00001').add(exitFee)
      if (this.networkGateway === Network.ETHEREUM) {
        value = utils.parseEther('0.00001')
      }

      const tx2 =
        await DiscretionaryExitFeeContract.populateTransaction.payAndWithdraw(
          this.addresses.L2_ETH_Address,
          utils.parseEther('0.00001'),
          this.L1GasLimit,
          ethers.utils.formatBytes32String(new Date().getTime().toString()),
          { value }
        )

      const gas_BN = await this.L2Provider!.estimateGas({
        ...tx2,
        from: this.gasEstimateAccount,
      })
      console.log('Classical exit gas', gas_BN.toString())

      const cost_BN = gas_BN.mul(gasPrice)
      console.log('Classical exit cost (ETH):', utils.formatEther(cost_BN))

      const totalCost = utils.formatEther(cost_BN.add(approvalCost_BN))
      console.log('Classical exit total cost (ETH):', totalCost)

      //returns total cost in ETH
      return totalCost
    } catch (error) {
      return 0
    }
  }

  /***********************************************/
  /*****                  Fee                *****/
  /***** Fees are reported as integers,      *****/
  /***** where every int represents 0.1%     *****/

  /***********************************************/

  async getL1TotalFeeRate() {
    try {
      const L1LPContract = new ethers.Contract(
        this.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        this.L1Provider
      )
      const [operatorFeeRate, userMinFeeRate, userMaxFeeRate] =
        await Promise.all([
          L1LPContract.ownerRewardFeeRate(),
          L1LPContract.userRewardMinFeeRate(),
          L1LPContract.userRewardMaxFeeRate(),
        ])

      const feeRateL = Number(userMinFeeRate) + Number(operatorFeeRate)
      const feeRateH = Number(userMaxFeeRate) + Number(operatorFeeRate)

      return {
        feeMin: (feeRateL / 10).toFixed(1),
        feeMax: (feeRateH / 10).toFixed(1),
      }
    } catch (error) {
      console.log('NS: getL1TotalFeeRate error:', error)
      return error
    }
  }

  async getL2TotalFeeRate() {
    try {
      const L2LPContract = new ethers.Contract(
        this.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        this.L2Provider
      )
      const [operatorFeeRate, userMinFeeRate, userMaxFeeRate] =
        await Promise.all([
          L2LPContract.ownerRewardFeeRate(),
          L2LPContract.userRewardMinFeeRate(),
          L2LPContract.userRewardMaxFeeRate(),
        ])

      const feeRateL = Number(userMinFeeRate) + Number(operatorFeeRate)
      const feeRateH = Number(userMaxFeeRate) + Number(operatorFeeRate)

      return {
        feeMin: (feeRateL / 10).toFixed(1),
        feeMax: (feeRateH / 10).toFixed(1),
      }
    } catch (error) {
      console.log('NS: getL2TotalFeeRate error:', error)
      return error
    }
  }

  async getL1UserRewardFeeRate(tokenAddress) {
    try {
      const L1LPContract = new ethers.Contract(
        this.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        this.L1Provider
      )
      const feeRate = await L1LPContract.getUserRewardFeeRate(tokenAddress)
      //console.log("NS: getL1UserRewardFeeRate:", feeRate)
      return (feeRate / 10).toFixed(1)
    } catch (error) {
      console.log('NS: getL1UserRewardFeeRate error:', error)
      return error
    }
  }

  async getL2UserRewardFeeRate(tokenAddress) {
    try {
      const L2LPContract = new ethers.Contract(
        this.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        this.L2Provider
      )
      const feeRate = await L2LPContract.getUserRewardFeeRate(tokenAddress)
      //console.log("NS: getL2UserRewardFeeRate:", feeRate)
      return (feeRate / 10).toFixed(1)
    } catch (error) {
      console.log('NS: getL2UserRewardFeeRate error:', error)
      return error
    }
  }

  /*****************************************************/
  /***** Pool, User Info, to populate the Earn tab *****/

  /*****************************************************/
  async getL1LPInfo() {
    const poolInfo = {}
    const userInfo = {}

    const tokenAddressList = Object.keys(this.tokenAddresses!).reduce(
      (acc, cur) => {
        if (
          cur !== 'xBOBA' &&
          cur !== 'OLO' &&
          cur !== 'WAGMIv0' &&
          cur !== 'WAGMIv1' &&
          cur !== 'WAGMIv2' &&
          cur !== 'WAGMIv2-Oolong' &&
          cur !== 'WAGMIv3' &&
          cur !== 'WAGMIv3-Oolong'
        ) {
          acc.push(this.tokenAddresses![cur].L1.toLowerCase())
        }
        return acc
      },
      [this.addresses.L1_ETH_Address]
    )

    const L1LPContract = new ethers.Contract(
      this.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      this.L1Provider
    )

    const L1LPInfoPromise: any = []

    const getL1LPInfoPromise = async (tokenAddress) => {
      let tokenBalance
      let tokenSymbol
      let tokenName
      let decimals

      if (tokenAddress === this.addresses.L1_ETH_Address) {
        //getting eth balance
        tokenBalance = await this.L1Provider!.getBalance(
          this.addresses.L1LPAddress
        )
        tokenSymbol = this.L1NativeTokenSymbol
        tokenName = this.L1NativeTokenName
        decimals = 18
      } else {
        //getting eth balance
        tokenBalance = await this.L1_TEST_Contract!.attach(tokenAddress)
          .connect(this.L1Provider!)
          .balanceOf(this.addresses.L1LPAddress)
        const tokenInfoFiltered =
          this.tokenInfo!.L1[utils.getAddress(tokenAddress)]
        if (tokenInfo) {
          tokenSymbol = tokenInfoFiltered?.symbol
          tokenName = tokenInfoFiltered?.name
          decimals = tokenInfoFiltered?.decimals
        } else {
          tokenSymbol = await this.L1_TEST_Contract!.attach(tokenAddress)
            .connect(this.L1Provider!)
            .symbol()
          tokenName = await this.L1_TEST_Contract!.attach(tokenAddress)
            .connect(this.L1Provider!)
            .name()
          decimals = await this.L1_TEST_Contract!.attach(tokenAddress)
            .connect(this.L1Provider!)
            .decimals()
        }
      }

      const poolTokenInfo = await L1LPContract.poolInfo(tokenAddress)
      let userTokenInfo = {}
      if (typeof this.account !== 'undefined' && this.account) {
        userTokenInfo = await L1LPContract.userInfo(tokenAddress, this.account)
      }
      return {
        tokenAddress,
        tokenBalance,
        tokenSymbol,
        tokenName,
        poolTokenInfo,
        userTokenInfo,
        decimals,
      }
    }

    tokenAddressList.forEach((tokenAddress) =>
      L1LPInfoPromise.push(getL1LPInfoPromise(tokenAddress))
    )

    const L1LPInfo = await Promise.all(L1LPInfoPromise)
    sortRawTokens(L1LPInfo).forEach((token) => {
      const userIn = Number(token.poolTokenInfo.userDepositAmount.toString())
      const rewards = Number(token.poolTokenInfo.accUserReward.toString())
      const duration =
        new Date().getTime() - Number(token.poolTokenInfo.startTime) * 1000
      const durationDays = duration / (60 * 60 * 24 * 1000)
      const annualRewardEstimate = (365 * rewards) / durationDays
      let annualYieldEstimate = (100 * annualRewardEstimate) / userIn
      if (!annualYieldEstimate) {
        annualYieldEstimate = 0
      }
      poolInfo[token.tokenAddress.toLowerCase()] = {
        symbol: token.tokenSymbol,
        name: token.tokenName,
        decimals: token.decimals,
        l1TokenAddress: token.poolTokenInfo.l1TokenAddress.toLowerCase(),
        l2TokenAddress: token.poolTokenInfo.l2TokenAddress.toLowerCase(),
        accUserReward: token.poolTokenInfo.accUserReward.toString(),
        accUserRewardPerShare:
          token.poolTokenInfo.accUserRewardPerShare.toString(),
        userDepositAmount: token.poolTokenInfo.userDepositAmount.toString(),
        startTime: token.poolTokenInfo.startTime.toString(),
        APR: annualYieldEstimate,
        tokenBalance: token.tokenBalance.toString(),
      }
      userInfo[token.tokenAddress] = {
        l1TokenAddress: token.tokenAddress.toLowerCase(),
        amount: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.amount.toString()
          : 0,
        pendingReward: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.pendingReward.toString()
          : 0,
        rewardDebt: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.rewardDebt.toString()
          : 0,
      }
    })

    return { poolInfo, userInfo }
  }

  async getL2LPInfo() {
    const tokenAddressList = Object.keys(this.tokenAddresses!).reduce(
      (acc, cur) => {
        if (
          cur !== 'xBOBA' &&
          cur !== 'OLO' &&
          cur !== 'WAGMIv0' &&
          cur !== 'WAGMIv1' &&
          cur !== 'WAGMIv2' &&
          cur !== 'WAGMIv2-Oolong' &&
          cur !== 'WAGMIv3' &&
          cur !== 'WAGMIv3-Oolong'
        ) {
          acc.push({
            L1: this.tokenAddresses![cur].L1.toLowerCase(),
            L2: this.tokenAddresses![cur].L2.toLowerCase(),
          })
        }
        return acc
      },
      [
        {
          L1: this.addresses.L1_ETH_Address,
          L2: this.addresses[`TK_L2${this.L1NativeTokenSymbol}`],
        },
      ]
    )

    const L2LPContract = new ethers.Contract(
      this.addresses.L2LPAddress,
      L2LiquidityPoolABI,
      this.L2Provider
    )

    const poolInfo = {}
    const userInfo = {}

    const L2LPInfoPromise: any = []

    const getL2LPInfoPromise = async (
      tokenAddress: string,
      tokenAddressL1: string
    ) => {
      let tokenBalance
      let tokenSymbol
      let tokenName
      let decimals

      if (tokenAddress === this.addresses.L2_ETH_Address) {
        tokenBalance = await this.L2Provider!.getBalance(
          this.addresses.L2LPAddress
        )
        tokenSymbol = this.network === Network.ETHEREUM ? 'ETH' : 'BOBA'
        tokenName =
          this.network === Network.ETHEREUM ? 'Ethereum' : 'BOBA Token'
        decimals = 18
      } else {
        tokenBalance = await this.L2_TEST_Contract!.attach(tokenAddress)
          .connect(this.L2Provider!)
          .balanceOf(this.addresses.L2LPAddress)
        const tokenInfoFiltered =
          this.tokenInfo!.L2[utils.getAddress(tokenAddress)]
        if (tokenInfo) {
          tokenSymbol = tokenInfoFiltered.symbol
          tokenName = tokenInfoFiltered.name
          decimals = tokenInfoFiltered.decimals
        } else {
          tokenSymbol = await this.L2_TEST_Contract!.attach(tokenAddress)
            .connect(this.L2Provider!)
            .symbol()
          tokenName = await this.L2_TEST_Contract!.attach(tokenAddress)
            .connect(this.L2Provider!)
            .name()
          decimals = await this.L1_TEST_Contract!.attach(tokenAddressL1)
            .connect(this.L1Provider!)
            .decimals()
        }
      }
      const poolTokenInfo = await L2LPContract.poolInfo(tokenAddress)
      let userTokenInfo = {}
      if (typeof this.account !== 'undefined' && this.account) {
        userTokenInfo = await L2LPContract.userInfo(tokenAddress, this.account)
      }
      return {
        tokenAddress,
        tokenBalance,
        tokenSymbol,
        tokenName,
        poolTokenInfo,
        userTokenInfo,
        decimals,
      }
    }

    tokenAddressList.forEach(({ L1, L2 }) =>
      L2LPInfoPromise.push(getL2LPInfoPromise(L2, L1))
    )

    const L2LPInfo = await Promise.all(L2LPInfoPromise)

    sortRawTokens(L2LPInfo).forEach((token) => {
      const userIn = Number(token.poolTokenInfo.userDepositAmount.toString())
      const rewards = Number(token.poolTokenInfo.accUserReward.toString())
      const duration =
        new Date().getTime() - Number(token.poolTokenInfo.startTime) * 1000
      const durationDays = duration / (60 * 60 * 24 * 1000)
      const annualRewardEstimate = (365 * rewards) / durationDays
      let annualYieldEstimate = (100 * annualRewardEstimate) / userIn
      if (!annualYieldEstimate) {
        annualYieldEstimate = 0
      }
      poolInfo[token.tokenAddress.toLowerCase()] = {
        symbol: token.tokenSymbol,
        name: token.tokenName,
        decimals: token.decimals,
        l1TokenAddress: token.poolTokenInfo.l1TokenAddress.toLowerCase(),
        l2TokenAddress: token.poolTokenInfo.l2TokenAddress.toLowerCase(),
        accUserReward: token.poolTokenInfo.accUserReward.toString(),
        accUserRewardPerShare:
          token.poolTokenInfo.accUserRewardPerShare.toString(),
        userDepositAmount: token.poolTokenInfo.userDepositAmount.toString(),
        startTime: token.poolTokenInfo.startTime.toString(),
        APR: annualYieldEstimate,
        tokenBalance: token.tokenBalance.toString(),
      }
      userInfo[token.tokenAddress.toLowerCase()] = {
        l2TokenAddress: token.tokenAddress.toLowerCase(),
        amount: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.amount.toString()
          : 0,
        pendingReward: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.pendingReward.toString()
          : 0,
        rewardDebt: Object.keys(token.userTokenInfo).length
          ? token.userTokenInfo.rewardDebt.toString()
          : 0,
      }
    })

    return { poolInfo, userInfo }
  }

  // FIXME: move this to separate service of earn.
  /***********************************************/
  /*****           Get Reward                *****/
  /***********************************************/
  async getReward(
    currencyAddress,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const TX = await (
        L1orL2Pool === LiquidityPoolLayer.L1LP
          ? this.L1LPContract!
          : this.L2LPContract!
      )
        .connect(this.provider!.getSigner())
        .withdrawReward(value_Wei_String, currencyAddress, this.account)
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: getReward error:', error)
      return error
    }
  }

  /***********************************************/
  /*****          Withdraw Liquidity         *****/

  /***********************************************/
  async withdrawLiquidity(
    currency,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const estimateGas = await (
        L1orL2Pool === LiquidityPoolLayer.L1LP
          ? this.L1LPContract!
          : this.L2LPContract!
      ).estimateGas.withdrawLiquidity(
        value_Wei_String,
        currency,
        this.account,
        { from: this.account }
      )
      const blockGasLimit = (await this.provider!.getBlock('latest')).gasLimit
      const TX = await (
        L1orL2Pool === LiquidityPoolLayer.L1LP
          ? this.L1LPContract!
          : this.L2LPContract!
      )
        .connect(this.provider!.getSigner())
        .withdrawLiquidity(value_Wei_String, currency, this.account, {
          gasLimit: estimateGas.mul(2).gt(blockGasLimit)
            ? blockGasLimit
            : estimateGas.mul(2),
        })
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: withdrawLiquidity error:', error)
      return error
    }
  }

  /***********************************************************/
  /***** SWAP ON to BOBA by depositing funds to the L1LP *****/

  /***********************************************************/
  async depositL1LP(currency, value_Wei_String) {
    try {
      await updateSignatureStatus_depositLP(false)
      setFetchDepositTxBlock(false)

      const depositTX = await this.L1LPContract!.connect(
        this.provider!.getSigner()
      ).clientDepositL1(
        value_Wei_String,
        currency,
        currency === this.addresses.L1_ETH_Address
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
      const receipt = await this.watcher!.waitForMessageReceipt(depositTX, opts)
      const txReceipt = receipt.transactionReceipt
      console.log(' completed swap-on ! L2 tx hash:', txReceipt)
      return txReceipt
    } catch (error) {
      console.log('NS: depositL1LP error:', error)
      return error
    }
  }

  getLightBridgeAddress(chainId?: number) {
    if (!chainId) {
      chainId = this.chainId
    }
    const networkConfig = CHAIN_ID_LIST[chainId!]
    let lightBridgeAddr
    if (!networkConfig) {
      console.error(
        `Unknown chainId to retrieve teleportation contract from: ${chainId}`
      )
      return { lightBridgeAddr: null, networkConfig: null }
    }
    const addresses = appService.fetchAddresses({
      networkType: networkConfig.networkType,
      network: networkConfig.chain,
    })
    if (networkConfig.layer === LAYER.L1) {
      lightBridgeAddr = addresses.Proxy__L1Teleportation
    } else if (networkConfig.layer === LAYER.L2) {
      lightBridgeAddr = addresses.Proxy__L2Teleportation
    }
    return { lightBridgeAddr, networkConfig }
  }

  getLightBridgeContract(chainId) {
    const { lightBridgeAddr, networkConfig } =
      this.getLightBridgeAddress(chainId)
    if (!lightBridgeAddr || !this.LightBridge) {
      return
    }

    const rpc = getRpcUrl({
      networkType: networkConfig.networkType,
      network: networkConfig.chain,
      layer: networkConfig.layer,
    })
    const provider = new ethers.providers.StaticJsonRpcProvider(rpc)

    return this.LightBridge!.attach(lightBridgeAddr).connect(provider)
  }

  async isTeleportationOfAssetSupported(layer, token, destChainId) {
    const lightBridgeAddr =
      layer === Layer.L1
        ? this.addresses.Proxy__L1Teleportation
        : this.addresses.Proxy__L2Teleportation
    if (!lightBridgeAddr) {
      return { supported: false }
    }
    const contract = this.LightBridge!.attach(lightBridgeAddr).connect(
      this.provider!.getSigner()
    )
    return contract.supportedTokens(token, destChainId)
  }

  async depositWithTeleporter(layer, currency, value_Wei_String, destChainId) {
    try {
      updateSignatureStatus_depositLP(false)
      setFetchDepositTxBlock(false)

      const lightBridgeAddr =
        layer === Layer.L1
          ? this.addresses.Proxy__L1Teleportation
          : this.addresses.Proxy__L2Teleportation
      const msgVal =
        currency === this.addresses.L1_ETH_Address ||
        currency === this.addresses.NETWORK_NATIVE_TOKEN
          ? { value: value_Wei_String }
          : {}
      const teleportationContract = this.LightBridge!.attach(
        lightBridgeAddr
      ).connect(this.provider!.getSigner())
      const tokenAddress =
        currency === this.addresses.NETWORK_NATIVE_TOKEN
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
      const receipt = await this.watcher!.waitForMessageReceipt(depositTX, opts)
      const txReceipt = receipt.transactionReceipt
      console.log(' completed swap-on ! tx hash:', txReceipt)
      return txReceipt
    } catch (error) {
      console.log('Teleportation error:', error)
      return error
    }
  }

  /***************************************/
  /************ L1LP Pool size ***********/

  async L1LPPending(tokenAddress): Promise<string> {
    const L1pending = await omgxWatcherAxiosInstance(this.networkConfig).get(
      'get.l2.pendingexits',
      {}
    )

    const pendingFast = L1pending.data.filter((i) => {
      return (
        i.fastRelay === 1 && //fast exit
        i.exitToken.toLowerCase() === tokenAddress.toLowerCase()
      ) //and, this specific token
    })

    const sum = pendingFast.reduce((prev, current) => {
      const weiString = BigNumber.from(current.exitAmount)
      return prev.add(weiString)
    }, BigNumber.from('0'))

    return sum.toString()
  }

  /***************************************/
  /************ L1LP Pool size ***********/

  /***************************************/
  async L2LPPending(tokenAddress) {
    //Placeholder return
    const sum = BigNumber.from('0')
    return sum.toString()
  }

  /***************************************/
  /************ L1LP Pool size ***********/

  /***************************************/
  async L1LPBalance(tokenAddress): Promise<string> {
    let balance: BigNumberish
    const tokenAddressLC = tokenAddress.toLowerCase()

    if (
      tokenAddressLC === this.addresses.L2_ETH_Address ||
      tokenAddressLC === this.addresses.L1_ETH_Address
    ) {
      balance = await this.L1Provider!.getBalance(this.addresses.L1LPAddress)
    } else {
      balance = await this.L1_TEST_Contract!.attach(tokenAddress)
        .connect(this.L1Provider!)
        .balanceOf(this.addresses.L1LPAddress)
    }

    return balance.toString()
  }

  /***************************************/
  /************ L2LP Pool size ***********/

  /***************************************/
  async L2LPBalance(tokenAddress): Promise<string> {
    let balance: BigNumberish
    const tokenAddressLC = tokenAddress.toLowerCase()

    if (
      tokenAddressLC === this.addresses.L2_BOBA_Address ||
      tokenAddressLC === this.addresses.L1_ETH_Address
    ) {
      //We are dealing with ETH
      balance = await this.L2_ETH_Contract!.connect(this.L2Provider!).balanceOf(
        this.addresses.L2LPAddress
      )
    } else {
      balance = await this.L2_TEST_Contract!.attach(tokenAddress)
        .connect(this.L2Provider!)
        .balanceOf(this.addresses.L2LPAddress)
    }

    return balance.toString()
  }

  /***************************************/
  /*********** L1LP Liquidity ************/

  /***************************************/
  async L1LPLiquidity(tokenAddress) {
    const L1LPContractNS = new ethers.Contract(
      this.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      this.L1Provider
    )

    try {
      const poolTokenInfo = await L1LPContractNS.poolInfo(tokenAddress)
      return poolTokenInfo.userDepositAmount.toString()
    } catch (error) {
      console.log('NS: L1LPLiquidity error:', error)
      return error
    }
  }

  /***************************************/
  /*********** L2LP Liquidity ************/

  /***************************************/
  async L2LPLiquidity(tokenAddress) {
    const L2LPContractNS = new ethers.Contract(
      this.addresses.L2LPAddress,
      L2LiquidityPoolABI,
      this.L2Provider
    )

    try {
      const poolTokenInfo = await L2LPContractNS.poolInfo(tokenAddress)
      return poolTokenInfo.userDepositAmount.toString()
    } catch (error) {
      console.log('NS: L2LPLiquidity error:', error)
      return error
    }
  }

  /* Estimate cost of Fast Exit to L1 */
  async getFastExitCost(currencyAddress) {
    let approvalCost_BN = BigNumber.from('0')

    const gasPrice = await this.L2Provider!.getGasPrice()
    console.log('Fast exit gas price', gasPrice.toString())

    if (currencyAddress !== this.addresses.L2_ETH_Address) {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L2StandardERC20ABI, //any old abi will do...
        this.provider!.getSigner()
      )

      const tx = await ERC20Contract.populateTransaction.approve(
        this.addresses.L2LPAddress,
        utils.parseEther('1.0')
      )

      const approvalGas_BN = await this.L2Provider!.estimateGas({
        ...tx,
        from: this.gasEstimateAccount,
      })
      approvalCost_BN = approvalGas_BN.mul(gasPrice)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
    }

    const L2BillingContract = new ethers.Contract(
      this.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      this.L2Provider
    )

    const approvalAmount = await L2BillingContract.exitFee()

    let value
    if (this.networkGateway === Network.ETHEREUM) {
      value =
        currencyAddress === this.addresses.L2_ETH_Address ? { value: '1' } : {}
    } else {
      value =
        currencyAddress === this.addresses.L2_ETH_Address
          ? { value: approvalAmount.add('1') }
          : { value: approvalAmount }
    }

    //in some cases zero not allowed
    const tx2 = await this.L2LPContract!.connect(
      this.provider!.getSigner()
    ).populateTransaction.clientDepositL2(
      currencyAddress === this.addresses.L2_ETH_Address ? '1' : '0', //ETH does not allow zero
      currencyAddress,
      value
    )

    const depositGas_BN = await this.L2Provider!.estimateGas({
      ...tx2,
      from: this.gasEstimateAccount,
    })

    let l1SecurityFee = BigNumber.from('0')
    if (this.networkType === NetworkType.MAINNET) {
      delete tx2.from
      l1SecurityFee = await this.gasOracleContract!.getL1Fee(
        utils.serializeTransaction(tx2)
      )
      // We can't correctly calculate the final l1 securifty fee,
      // so we increase it by 1.1X to make sure that users have
      // enough balance to cover it
      l1SecurityFee = l1SecurityFee.mul('11').div('10')
      console.log('l1Security fee (ETH)', l1SecurityFee.toString())
    }

    const depositCost_BN = depositGas_BN.mul(gasPrice).add(l1SecurityFee)
    console.log('Fast exit cost (ETH):', utils.formatEther(depositCost_BN))

    //returns total cost in ETH
    return utils.formatEther(depositCost_BN.add(approvalCost_BN))
  }

  /* Estimate cost of Fast Deposit to L2 */
  async getFastDepositCost(currencyAddress: string) {
    let approvalCost_BN = BigNumber.from('0')

    const gasPrice = await this.L1Provider!.getGasPrice()
    console.log('Fast deposit gas price', gasPrice.toString())

    if (currencyAddress !== this.addresses.L1_ETH_Address) {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L1ERC20ABI, //any old abi will do...
        this.provider!.getSigner()
      )

      const tx = await ERC20Contract.populateTransaction.approve(
        this.addresses.L1LPAddress,
        utils.parseEther('1.0')
      )

      const approvalGas_BN = await this.L1Provider!.estimateGas(tx)
      approvalCost_BN = approvalGas_BN.mul(gasPrice)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
    }

    //in some cases zero not allowed
    const tx2 = await this.L1LPContract!.connect(
      this.provider!.getSigner()
    ).populateTransaction.clientDepositL1(
      currencyAddress === this.addresses.L1_ETH_Address ? '1' : '0', //ETH does not allow zero
      currencyAddress,
      currencyAddress === this.addresses.L1_ETH_Address ? { value: '1' } : {}
    )

    const depositGas_BN = await this.L1Provider!.estimateGas(tx2)
    console.log('Fast deposit gas', depositGas_BN.toString())

    const depositCost_BN = depositGas_BN.mul(gasPrice)
    console.log('Fast deposit cost (ETH):', utils.formatEther(depositCost_BN))

    //returns total cost in ETH
    return utils.formatEther(depositCost_BN.add(approvalCost_BN))
  }

  /**************************************************************/
  /***** SWAP OFF from BOBA by depositing funds to the L2LP *****/

  /**************************************************************/
  async depositL2LP(currencyAddress: string, value_Wei_String: BigNumberish) {
    await updateSignatureStatus_exitLP(false)

    console.log('depositL2LP currencyAddress', currencyAddress)

    const L2BillingContract = new ethers.Contract(
      this.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      this.L2Provider
    )
    let BobaApprovalAmount = await L2BillingContract.exitFee()

    const BobaAllowance = await this.checkAllowance(
      this.addresses.TK_L2BOBA,
      this.addresses.L2LPAddress
    )

    try {
      if (this.networkGateway === Network.ETHEREUM) {
        // Approve BOBA first only when the Boba is not native token.
        if (
          utils.getAddress(currencyAddress) ===
          utils.getAddress(this.addresses.TK_L2BOBA)
        ) {
          BobaApprovalAmount = BobaApprovalAmount.add(
            BigNumber.from(value_Wei_String)
          )
        }
        if (BobaAllowance.lt(BobaApprovalAmount)) {
          const approveStatus = await this.approveERC20(
            BobaApprovalAmount,
            this.addresses.TK_L2BOBA,
            this.addresses.L2LPAddress
          )
          if (!approveStatus) {
            return false
          }
        }
      }

      // Approve other tokens
      if (
        currencyAddress !== this.addresses.L2_ETH_Address &&
        utils.getAddress(currencyAddress) !==
          utils.getAddress(this.addresses.TK_L2BOBA)
      ) {
        const L2ERC20Contract = new ethers.Contract(
          currencyAddress,
          L2StandardERC20ABI,
          this.provider!.getSigner()
        )

        const allowance_BN = await L2ERC20Contract.allowance(
          this.account,
          this.addresses.L2LPAddress
        )

        const depositAmount_BN = BigNumber.from(value_Wei_String)

        if (depositAmount_BN.gt(allowance_BN)) {
          const approveStatus = await L2ERC20Contract.approve(
            this.addresses.L2LPAddress,
            value_Wei_String
          )
          await approveStatus.wait()
          if (!approveStatus) {
            return false
          }
        }
      }

      const time_start = new Date().getTime()
      console.log('TX start time:', time_start)

      let otherField
      if (this.networkGateway === Network.ETHEREUM) {
        otherField =
          currencyAddress === this.addresses.L2_ETH_Address
            ? { value: value_Wei_String }
            : {}
      } else {
        otherField =
          currencyAddress === this.addresses.L2_ETH_Address
            ? { value: BobaApprovalAmount.add(value_Wei_String) }
            : { value: BobaApprovalAmount }
      }

      const depositTX = await this.L2LPContract!.connect(
        this.provider!.getSigner()
      ).clientDepositL2(value_Wei_String, currencyAddress, otherField)

      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()

      const block = await this.L2Provider!.getTransaction(depositTX.hash)
      console.log(' block:', block)

      //closes the modal
      await updateSignatureStatus_exitLP(true)

      return depositTX
    } catch (error) {
      console.log('NS: depositL2LP error:', error)
      return error
    }
  }

  async fetchLookUpPrice(params) {
    try {
      // fetching only the prices compare to usd.
      const res = await coinGeckoAxiosInstance.get(
        `simple/price?ids=${params.join()}&vs_currencies=usd`
      )
      return res.data
    } catch (error) {
      return error
    }
  }

  /***********************************************/
  /*****         DAO Functions               *****/
  /***********************************************/

  // get DAO Balance
  async getDaoBalance() {
    if (!this.BobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: getDaoBalance() error - called but account === null')
      return
    }

    try {
      const balance = await this.BobaContract!.balanceOf(this.account)
      return { balance: formatEther(balance) }
    } catch (error) {
      console.log('Error: getDaoBalance', error)
      return error
    }
  }

  async getDaoBalanceX() {
    if (!this.xBobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: getDaoBalanceX() error - called but account === null')
      return
    }

    try {
      const balance = await this.xBobaContract.balanceOf(this.account)
      return { balanceX: formatEther(balance) }
    } catch (error) {
      console.log('Error: getDaoBalanceX', error)
      return error
    }
  }

  // get DAO Votes
  async getDaoVotes() {
    if (!this.BobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: getDaoVotes() error - called but account === null')
      return
    }

    try {
      const votes = await this.BobaContract!.getCurrentVotes(this.account)
      return { votes: formatEther(votes) }
    } catch (error) {
      console.log('NS: getDaoVotes error:', error)
      return error
    }
  }

  // get DAO Votes
  async getDaoVotesX() {
    if (!this.xBobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: getDaoVotesX() error - called but account === null')
      return
    }

    try {
      const votes = await this.xBobaContract.getCurrentVotes(this.account)
      return { votesX: formatEther(votes) }
    } catch (error) {
      console.log('NS: getDaoVotesX error:', error)
      return error
    }
  }

  //Delegate DAO Authority
  async delegateVotes({ recipient }) {
    if (this.L1orL2 !== 'L2') {
      return
    }
    if (!this.BobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: delegateVotes() error - called but account === null')
      return
    }

    try {
      const tx = await this.BobaContract!.connect(
        this.provider!.getSigner()
      ).delegate(recipient)
      await tx.wait()
      return tx
    } catch (error) {
      console.log('NS: delegateVotes error:', error)
      return error
    }
  }

  //Delegate DAO Authority
  async delegateVotesX({ recipient }) {
    if (this.L1orL2 !== 'L2') {
      return
    }
    if (!this.xBobaContract) {
      return
    }

    if (!this.account) {
      console.log('NS: delegateVotesX() error - called but account === null')
      return
    }

    try {
      const tx = await this.xBobaContract
        .connect(this.provider!.getSigner())
        .delegate(recipient)
      await tx.wait()
      return tx
    } catch (error) {
      console.log('NS: delegateVotesX error:', error)
      return error
    }
  }

  // Proposal Create Threshold
  async getProposalThreshold() {
    if (!this.delegateContract) {
      return
    }

    try {
      const delegateCheck = await this.delegateContract.attach(
        this.addresses.GovernorBravoDelegator
      )
      const rawThreshold = await delegateCheck.proposalThreshold()
      return { proposalThreshold: formatEther(rawThreshold) }
    } catch (error) {
      console.log('NS: getProposalThreshold error:', error)
      return error
    }
  }

  // Create Proposal
  /************************/
  /*****Old Dao Fix Me.****/
  /************************/

  // FIXME:
  async createProposal(payload) {
    if (this.L1orL2 !== 'L2') {
      return
    }
    if (!this.delegateContract) {
      return
    }

    if (!this.account) {
      console.log('NS: delegateVotesX() error - called but account === null')
      return
    }

    let signatures = ['']
    let value1 = 0
    let value2 = 0
    let value3 = 0
    let description = ''
    let address = ['']
    let callData = ['']
    // FIXME: Ve DAO From here
    /*
      let tokenIds = payload.tokenIds
      // create proposal only on latest contracts.
      const delegateCheck = await this.delegateContract.attach(this.addresses.GovernorBravoDelegatorV2)

    */
    // FIXME: Ve DAO Till here

    const delegateCheck = await this.delegateContract.attach(
      this.addresses.GovernorBravoDelegator
    )

    if (payload.action === 'text-proposal') {
      address = ['0x000000000000000000000000000000000000dEaD']
      description = payload.text.slice(0, 252) //100+150+2
      callData = [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]
    } else if (payload.action === 'change-lp1-fee') {
      signatures = ['configureFeeExits(uint256,uint256,uint256)']
      value1 = Number(payload.value[0])
      value2 = Number(payload.value[1])
      value3 = Number(payload.value[2])
      description = `Change L1 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
      address = [this.addresses.L2LPAddress]
      callData = [
        ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256'],
          [value1, value2, value3]
        ),
      ]
    } else if (payload.action === 'change-lp2-fee') {
      address = [delegateCheck.address]
      signatures = ['configureFee(uint256,uint256,uint256)']
      value1 = Number(payload.value[0])
      value2 = Number(payload.value[1])
      value3 = Number(payload.value[2])
      description = `Change L2 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
      address = [this.addresses.L2LPAddress]
      callData = [
        ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256'],
          [value1, value2, value3]
        ),
      ]
    } else if (payload.action === 'change-threshold') {
      address = [delegateCheck.address]
      signatures = ['_setProposalThreshold(uint256)']
      value1 = Number(payload.value[0])
      description = `Change Proposal Threshold to ${value1} BOBA`
      callData = [ethers.utils.defaultAbiCoder.encode(['uint256'], [value1])]
    }

    try {
      const values = [0] //amount of ETH to send, generally, zero

      return await delegateCheck
        .connect(this.provider!.getSigner())
        .propose(address, values, signatures, callData, description)
    } catch (error) {
      console.log('NS: createProposal error:', error)
      return error
    }
  }

  //Fetch DAO Proposals
  async queueProposal(proposalID) {
    if (!this.delegateContract) {
      return
    }

    if (!this.account) {
      console.log('NS: queueProposal() error - called but account === null')
      return
    }

    try {
      const delegateCheck = this.delegateContract
        .connect(this.provider!.getSigner())
        .attach(this.addresses.GovernorBravoDelegator)
      return delegateCheck.queue(Number(proposalID))
    } catch (error) {
      console.log('NS: queueProposal error:', error)
      return error
    }
  }

  async executeProposal(proposalID) {
    if (!this.delegateContract) {
      return
    }

    if (!this.account) {
      console.log('NS: executeProposal() error - called but account === null')
      return
    }

    try {
      const delegateCheck = this.delegateContract
        .connect(this.provider!.getSigner())
        .attach(this.addresses.GovernorBravoDelegator)
      return delegateCheck.execute(Number(proposalID))
    } catch (error) {
      console.log('NS: executeProposal error:', error)
      return error
    }
  }

  /***********************************************/
  /*****       Fixed savings account         *****/

  /***********************************************/
  async addFS_Savings(value_Wei_String: BigNumberish) {
    if (!this.account) {
      console.log(
        'NS: withdrawFS_Savings() error - called but account === null'
      )
      return
    }

    try {
      const FixedSavings = new ethers.Contract(
        this.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        this.provider!.getSigner()
      )

      const allowance_BN = await this.BobaContract!.connect(
        this.provider!.getSigner()
      ).allowance(this.account, this.addresses.BobaFixedSavings)

      const depositAmount_BN = BigNumber.from(value_Wei_String)

      const approveAmount_BN = depositAmount_BN.add(
        BigNumber.from('1000000000000')
      )

      try {
        if (approveAmount_BN.gt(allowance_BN)) {
          console.log('Need to approve YES:', approveAmount_BN)
          const approveStatus = await this.BobaContract!.connect(
            this.provider!.getSigner()
          ).approve(this.addresses.BobaFixedSavings, approveAmount_BN)
          await approveStatus.wait()
        } else {
          console.log(
            'Allowance is sufficient:',
            allowance_BN.toString(),
            depositAmount_BN.toString()
          )
        }
      } catch (error) {
        console.log('NS: addFS_Savings approve error:', error)
        return error
      }

      const TX = await FixedSavings.stake(value_Wei_String)
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: addFS_Savings error:', error)
      return error
    }
  }

  async savingEstimate() {
    // used to generate gas estimates for contracts that cannot set amount === 0
    // to avoid need to approve amount

    const otherField = {
      from: this.gasEstimateAccount,
    }

    const gasPrice_BN = await this.provider!.getGasPrice()
    console.log('gas price', gasPrice_BN.toString())

    let approvalCost_BN = BigNumber.from('0')
    let stakeCost_BN = BigNumber.from('0')

    try {
      // first, we need the allowance of the benchmarkAccount
      const allowance_BN = await this.BobaContract!.connect(
        this.provider!
      ).allowance(this.gasEstimateAccount, this.addresses.BobaFixedSavings)
      console.log('benchmarkAllowance_BN', allowance_BN.toString())

      // second, we need the approval cost
      const tx1 = await this.BobaContract!.connect(
        this.provider!.getSigner()
      ).populateTransaction.approve(
        this.addresses.BobaFixedSavings,
        allowance_BN.toString()
      )

      const approvalGas_BN = await this.provider!.estimateGas(tx1)
      approvalCost_BN = approvalGas_BN.mul(gasPrice_BN)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))

      // third, we need the stake cost
      const FixedSavings = new ethers.Contract(
        this.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        this.provider
      )

      const tx2 = await FixedSavings.populateTransaction.stake(
        allowance_BN.toString(),
        otherField
      )
      const stakeGas_BN = await this.provider!.estimateGas(tx2)
      stakeCost_BN = stakeGas_BN.mul(gasPrice_BN)
      console.log('Stake cost in ETH:', utils.formatEther(stakeCost_BN))

      const safety_margin_BN = BigNumber.from('1000000000000')
      console.log('Stake safety margin:', utils.formatEther(safety_margin_BN))

      return approvalCost_BN.add(stakeCost_BN).add(safety_margin_BN)
    } catch (error) {
      console.log('NS: stakingEstimate() error', error)
      return error
    }
  }

  async withdrawFS_Savings(stakeID) {
    if (!this.account) {
      return
    }

    try {
      const FixedSavings = new ethers.Contract(
        this.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        this.provider!.getSigner()
      )
      const TX = await FixedSavings.unstake(stakeID)
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: withdrawFS_Savings error:', error)
      return error
    }
  }

  async getFS_Saves() {
    if (this.account === null) {
      return
    }

    try {
      const FixedSavings = new ethers.Contract(
        this.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        this.L2Provider
      )
      await FixedSavings.l2Boba()
      const stakecount = await FixedSavings.personalStakeCount(this.account)
      return { stakecount: Number(stakecount) }
    } catch (error) {
      console.log('NS: getSaves error:', error)
      return error
    }
  }

  async getFS_Info() {
    if (this.account === null) {
      console.log('NS: getFS_Info() error - called but account === null')
      return
    }

    try {
      const FixedSavings = new ethers.Contract(
        this.addresses.BobaFixedSavings,
        BobaFixedSavingsABI,
        this.L2Provider
      )

      const stakeInfo: any = []

      const stakeCounts = await FixedSavings.personalStakeCount(this.account)

      for (let i = 0; i < stakeCounts; i++) {
        const stakeId = await FixedSavings.personalStakePos(this.account, i)
        const stakeData = await FixedSavings.stakeDataMap(stakeId)

        stakeInfo.push({
          stakeId: Number(stakeId.toString()),
          depositTimestamp: Number(stakeData.depositTimestamp.toString()),
          depositAmount: logAmount(stakeData.depositAmount.toString(), 18),
          isActive: stakeData.isActive,
        })
      }
      return { stakeInfo }
    } catch (error) {
      console.log('NS: getFS_Info error:', error)
      return error
    }
  }

  /***********************************************/
  /*****            L1 Security Fee          *****/

  /***********************************************/
  async estimateL1SecurityFee(payload = this.payloadForL1SecurityFee) {
    const deepCopyPayload = { ...payload }
    delete deepCopyPayload.from
    // Gas oracle
    this.gasOracleContract = new ethers.Contract(
      L2GasOracle,
      OVM_GasPriceOracleABI,
      this.L2Provider
    )
    const l1SecurityFee = await this.gasOracleContract!.getL1Fee(
      ethers.utils.serializeTransaction(deepCopyPayload)
    )
    return l1SecurityFee.toNumber()
  }

  /***********************************************/
  /*****                L2 Fee              *****/

  /***********************************************/
  async estimateL2Fee(payload: TxPayload = this.payloadForL1SecurityFee!) {
    try {
      const l2GasPrice = await this.L2Provider!.getGasPrice()
      const l2GasEstimate = await this.L2Provider!.estimateGas(payload)
      return l2GasPrice.mul(l2GasEstimate).toNumber()
    } catch {
      return 0
    }
  }

  /***********************************************/
  /*****              Exit fee               *****/

  /***********************************************/
  async getExitFeeFromBillingContract() {
    if (!this.addresses.Proxy__BobaBillingContract) {
      return 0
    }
    const L2BillingContract = new ethers.Contract(
      this.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      this.L2Provider
    )
    return ethers.utils.formatEther(await L2BillingContract.exitFee())
  }

  /*************************************************
   **************** Alt L1 Functions ***************
   *************************************************/

  /****************************************
   ************* DAO ***********
   *****************************************/
  async fetchProposals() {
    if (!this.delegateContract) {
      return
    }

    const delegateCheck = this.delegateContract.attach(
      this.addresses.GovernorBravoDelegator
    )

    try {
      const proposalList: any = []

      const proposalCounts = await delegateCheck.proposalCount()
      const totalProposals = await proposalCounts.toNumber()

      /// @notice An event emitted when a new proposal is created
      // event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startTimestamp, uint endTimestamp, string description);
      const L2ChainId = this.networkConfig!.L2.chainId
      const descriptionList = await graphQLService.queryBridgeProposalCreated({
        sourceChainId: L2ChainId,
      })

      for (let i = 0; i < totalProposals; i++) {
        const proposalRaw = descriptionList!.data.proposalCreateds[i]

        if (typeof proposalRaw === 'undefined') {
          continue
        }

        const proposalID = proposalRaw.idParam

        //this is a number such as 2
        const proposalData = await delegateCheck.proposals(proposalID)

        const proposalStates = [
          'Pending',
          'Active',
          'Canceled',
          'Defeated',
          'Succeeded',
          'Queued',
          'Expired',
          'Executed',
        ]

        const state = await delegateCheck.state(proposalID)

        const againstVotes = parseInt(
          formatEther(proposalData.againstVotes),
          10
        )
        const forVotes = parseInt(formatEther(proposalData.forVotes), 10)
        const abstainVotes = parseInt(
          formatEther(proposalData.abstainVotes),
          10
        )

        const startTimestamp = proposalData.startTimestamp.toString()
        const endTimestamp = proposalData.endTimestamp.toString()

        const proposal = await delegateCheck.getActions(i + 2)

        const hasVoted = null

        const description = proposalRaw.description.toString()

        proposalList.push({
          id: proposalID?.toString(),
          proposal,
          description,
          totalVotes: forVotes + againstVotes,
          forVotes,
          againstVotes,
          abstainVotes,
          state: proposalStates[state],
          startTimestamp,
          endTimestamp,
          hasVoted,
        })
      }
      return { proposalList }
    } catch (error) {
      console.log('NS: fetchProposals error:', error)
      return error
    }
  }

  async castProposalVote({ id, userVote }) {
    if (!this.delegateContract) {
      return
    }

    if (!this.account) {
      console.log('NS: castProposalVote() error - called but account === null')
      return
    }
    try {
      const delegateCheck = this.delegateContract
        .connect(this.provider!.getSigner())
        .attach(this.addresses.GovernorBravoDelegator)
      return delegateCheck.castVote(id, userVote)
    } catch (error) {
      console.log('NS: castProposalVote error:', error)
      return error
    }
  }

  /****************************************
   ************* END HERE *****************
   ***********OLD DAO REMOVE ME TILL HERE *
   *****************************************/

  async submitTxBuilder(
    contract: Contract,
    methodIndex,
    methodName: string,
    inputs
  ) {
    const parseResult = (resultPR, outputsPR) => {
      const parseResultPR: any = []
      if (outputsPR.length === 1) {
        return resultPR.toString()
      }
      for (let i = 0; i < outputsPR.length; i++) {
        try {
          const output = outputsPR[i]
          const key = output.name ? output.name : output.type
          if (output.type.includes('uint')) {
            parseResultPR.push({ [key]: resultPR[i].toString() })
          } else {
            parseResultPR.push({ [key]: resultPR[i] })
          }
        } catch (err) {
          return 'Error: Failed to parse result'
        }
      }
      return JSON.stringify(parseResultPR)
    }

    let parseInput: any = Object.values(inputs)
    let value = 0
    const stateMutability =
      contract.interface.functions[methodName].stateMutability
    const outputs = contract.interface.functions[methodName].outputs
    if (stateMutability === 'payable') {
      value = parseInput[parseInput.length - 1]
      parseInput = parseInput.slice(0, parseInput.length - 1)
    }

    let result
    try {
      if (stateMutability === 'view' || stateMutability === 'pure') {
        result = await contract[methodName](...parseInput)
        return {
          methodIndex,
          result: { result: parseResult(result, outputs), err: null },
        }
      } else if (stateMutability === 'payable') {
        console.log({ value }, ...parseInput)
        const tx = await contract[methodName](...parseInput, { value })
        return { methodIndex, result: { transactionHash: tx.hash, err: null } }
      } else {
        const tx = await contract[methodName](...parseInput)
        return { methodIndex, result: { transactionHash: tx.hash, err: null } }
      }
    } catch (err) {
      return { methodIndex, result: { err: JSON.stringify(err) } }
    }
  }

  // getting block number;

  async getLatestBlockNumber() {
    return this.provider!.getBlockNumber()
  }

  async getBlockTime(blockNumber) {
    return (await this.provider!.getBlock(blockNumber)).timestamp
  }
}

const networkService = new NetworkService()
export default networkService
