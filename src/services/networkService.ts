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

import { BigNumber, BigNumberish, Contract, ethers, utils } from 'ethers'

import BN from 'bn.js'
import store from 'store'
import { orderBy } from 'util/lodash'

import { getToken } from 'actions/tokenAction'
import { logAmount } from 'util/amountConvert'

import metaTransactionAxiosInstance from 'api/metaTransactionAxios'

import tokenInfo from '@bobanetwork/register/addresses/tokenInfo.json'

import { MIN_NATIVE_L1_BALANCE } from 'util/constant'
import {
  CHAIN_ID_LIST,
  getNetworkDetail,
  Network,
  networkLimitedAvailability,
  NetworkType,
  pingRpcUrl,
} from 'util/network/network.util'
import appService from './app.service'
import walletService, { WalletService } from './wallet.service'

import {
  BOBAABI,
  BobaGasPriceOracleABI,
  DiscretionaryExitFeeABI,
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

import { JsonRpcProvider } from '@ethersproject/providers'
import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import {
  NetworkDetailChainConfig,
  TxPayload,
} from '../util/network/config/network-details.types'
import oracleService from './oracle/oracle.service'

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
  //#region contract_members
  L1_TEST_Contract?: Contract
  L2_TEST_Contract?: Contract
  L2_ETH_Contract?: Contract
  BobaContract?: Contract
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

  // NOTE: Anchorage Bridging is enable for
  // Ethereum and BNB-testnet
  isAnchorageEnabled() {
    if (
      this.networkGateway === Network.ETHEREUM ||
      (this.networkGateway === Network.BNB &&
        this.networkType === NetworkType.TESTNET)
    ) {
      return true
    }
    return false
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

  async swapToken() {
    try {
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
        spender,
        BobaGasPriceOracleABI,
        this.provider!.getSigner()
      )

      const rawValue = await Boba_GasPriceOracle.getSecondaryFeeTokenForSwap()
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

      const signature = await this.provider!.send('eth_signTypedData_v4', [
        this.account,
        JSON.stringify(data),
      ])

      const swapUrl = '/send.swapSecondaryFeeToken'
      await metaTransactionAxiosInstance(this.networkConfig).post(swapUrl, {
        owner,
        spender,
        value,
        deadline,
        signature,
        data,
      })
      await oracleService.getBobaFeeChoice()
      return true
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
    this.networkGateway = network // e.g. mainnet | sepolia | ...
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

      // as we don't have contract address for sepolia so added check to avoid calling it.
      if (
        this.networkType !== NetworkType.TESTNET &&
        this.network === Network.ETHEREUM
      ) {
        // TODO: remove monster related codes as we are not using.
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

      // NOTE: should bypass if limitedNetworkAvailability & sepolia it's not enabled.
      const isLimitedNetwork = networkLimitedAvailability(networkType, network)
      if (!isLimitedNetwork && this.networkType !== NetworkType.TESTNET) {
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
        if (this.addresses.L1StandardBridgeAddress) {
          this.L1StandardBridgeContract = new ethers.Contract(
            this.addresses.L1StandardBridgeAddress, // uses right addressed depending on ENABLE_ANCHORAGE
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

        if (
          !(
            this.networkType === NetworkType.TESTNET &&
            this.network === Network.ETHEREUM
          )
        ) {
          this.watcher = new CrossChainMessenger({
            l1SignerOrProvider: this.L1Provider,
            l2SignerOrProvider: this.L2Provider,
            l1ChainId: chainId,
            fastRelayer: false,
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

      if (Network.ETHEREUM === network && networkType === NetworkType.MAINNET) {
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
        if (!this.isAnchorageEnabled()) {
          await oracleService.getBobaFeeChoice()
        }
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

    Object.keys(allTokens).forEach(async (token) => {
      await getToken(allTokens[token].L1)
    })
  }

  // TODO clean up on anchorage migration
  async getL2BalanceETH() {
    try {
      const balance = await this.L2Provider!.getBalance(this.account!)
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL2BalanceETH error:', error)
      return error
    }
  }

  // TODO clean up on anchorage migration
  async getL2BalanceBOBA() {
    try {
      if (
        this.networkGateway === Network.OPTIMISM ||
        this.networkGateway === Network.ARBITRUM
      ) {
        return BigNumber.from(0)
      }

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
        this.network === Network.ARBITRUM ||
        this.network === Network.OPTIMISM ||
        this.network === Network.ETHEREUM
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

      this.addTokenList()
      const state = store.getState()
      const tokenListValues = Object.values(state.tokenList)

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

      tokenListValues.forEach((token: any) => {
        if (token.addressL1 === null) {
          return
        }
        if (token.addressL2 === null) {
          return
        }
        if (this.network === Network.ETHEREUM) {
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

  // @note clean up on completion of anchorage migration on mainnet.
  // TODO: clean up on anchorage migration
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

  async checkAllowance(currencyAddress: string, targetContract: string) {
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

  // TODO: move this to bridge service with better naming.
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
        this.networkType === NetworkType.MAINNET && /// as OMG only supported on mainnet.
        allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
        !!allTokens &&
        !!allTokens.OMG &&
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

  // TODO: cleanup on migration of anchorage to mainnet.
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
  // TODO: cleanup on migration to anchorage
  async exitBOBA(currencyAddress, value_Wei_String) {
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
      return tx
    } catch (error) {
      console.log('NS: exitBOBA error:', error)
      return error
    }
  }

  /* Estimate cost of Classical Exit to L1 */
  // TODO: cleanup on migration to anchorage
  async getExitCost(currencyAddress: string) {
    try {
      let approvalCost_BN = BigNumber.from('0')

      const gasPrice = await this.L2Provider!.getGasPrice()

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
      const cost_BN = gas_BN.mul(gasPrice)

      const totalCost = utils.formatEther(cost_BN.add(approvalCost_BN))
      return totalCost
    } catch (error) {
      return 0
    }
  }

  // TODO: cleanup on migration to anchorage
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
  // getting block number;
  async getLatestBlockNumber() {
    return this.provider!.getBlockNumber()
  }

  async getBlockTime(blockNumber) {
    return (await this.provider!.getBlock(blockNumber)).timestamp
  }

  async getLatestBlockTime() {
    if (!this.provider) {
      return
    }
    return (await this.provider!.getBlock('latest')).timestamp
  }
}

const networkService = new NetworkService()
export default networkService
