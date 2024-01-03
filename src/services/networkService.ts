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

import { isDevBuild, Layer, MIN_NATIVE_L1_BALANCE } from 'util/constant'
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
  L2StandardBridgeABI,
  L2StandardERC20ABI,
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
import balanceService from './balance.service'

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
  Teleportation?: Contract
  L1LPContract?: Contract
  L2LPContract?: Contract
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

  async getBobaFeeChoice() {
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

  // TODO: swap.service.ts
  // TODO: rename to swap it's more over emergency swap feature.
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

  getAddressCached(
    cache: Record<any, any>,
    contractName: string,
    varToSet: string
  ): Boolean {
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

  // TODO: cleannup and see if we can move contract initiation specific to service or function.
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

      this.supportedTokens = tokenAsset.tokens
      this.supportedTokenAddresses = tokenAsset.tokenAddresses
      this.supportedAltL1Chains = tokenAsset.altL1Chains

      let addresses = {}
      // setting up all address;
      if (!!Network[network]) {
        addresses = appService.fetchAddresses({
          network,
          networkType,
        })
      }

      this.addresses = addresses

      if (network === Network.ETHEREUM) {
        // check only if selected network is ETHEREUM
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

      const isLimitedNetwork = networkLimitedAvailability(networkType, network)
      if (!isLimitedNetwork) {
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
        this.L1StandardBridgeContract = new ethers.Contract(
          this.addresses.L1StandardBridgeAddress,
          L1StandardBridgeABI,
          this.L1Provider
        )

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

        /*The test token*/
        this.L1_TEST_Contract = new ethers.Contract(
          allTokens.BOBA.L1, //this will get changed anyway when the contract is used
          L1ERC20ABI,
          this.L1Provider
        )

        this.L2_TEST_Contract = new ethers.Contract(
          allTokens.BOBA.L2, //this will get changed anyway when the contract is used
          L2StandardERC20ABI,
          this.L2Provider
        )

        // Liquidity pools
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

      if (this.addresses.L2StandardBridgeAddress !== null) {
        this.L2StandardBridgeContract = new ethers.Contract(
          this.addresses.L2StandardBridgeAddress,
          L2StandardBridgeABI,
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

  // TODO: cleanup and move to walletService itself.
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

  // TODO: token.service.ts
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

  // TODO: bridging.service.ts
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
      await depositTX.wait()

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

  // TODO: bridging.service.ts
  // REVIEW: More over looks like deprecated so we can remove this.
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

  // TODO: bridging.service.ts
  // REVIEW: More over looks like deprecated so we can remove this.
  //Estimate funds transfer from one account to another, on the L2
  async transferEstimate(
    recipient: string,
    value_Wei_String: string,
    currency: string
  ) {
    const gasPrice_BN = await this.L2Provider!.getGasPrice()

    let cost_BN = BigNumber.from('0')
    let gas_BN = BigNumber.from('0')

    try {
      if (currency === this.addresses.L2_ETH_Address) {
        gas_BN = await this.provider!.getSigner().estimateGas({
          from: this.account,
          to: recipient,
          value: value_Wei_String,
        })

        cost_BN = gas_BN.mul(gasPrice_BN)
        console.log('ETH: Transfer cost in ETH:', utils.formatEther(cost_BN))
      } else {
        const ERC20Contract = new ethers.Contract(
          currency,
          L2StandardERC20ABI, // any old abi will do...
          this.provider!.getSigner()
        )

        const tx = await ERC20Contract.populateTransaction.transfer(
          recipient,
          value_Wei_String
        )

        gas_BN = await this.L2Provider!.estimateGas(tx)

        cost_BN = gas_BN.mul(gasPrice_BN)
        console.log('ERC20: Transfer cost in ETH:', utils.formatEther(cost_BN))
      }

      const safety_margin = BigNumber.from('1000000000000')
      console.log('ERC20: Safety margin:', utils.formatEther(safety_margin))

      return cost_BN.add(safety_margin)
    } catch (error) {
      console.log('NS: transferEstimate error:', error)
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

  // TODO: bridging.service.ts
  //Used to move ERC20 Tokens from L1 to L2 using the classic deposit
  async depositErc20({
    recipient = null,
    value_Wei_String,
    currency,
    currencyL2,
  }) {
    const L1_TEST_Contract = this.L1_TEST_Contract!.attach(currency)

    let allowance_BN = await L1_TEST_Contract.allowance(
      this.account,
      this.addresses.L1StandardBridgeAddress
    )
    setFetchDepositTxBlock(false)
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
      await balanceService.getBalances()
      return txReceipt
    } catch (error) {
      console.log('NS: depositErc20 error:', error)
      return error
    }
  }

  // TODO: bridging.service.ts
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

  /***********************************************************/
  /***** SWAP ON to BOBA by depositing funds to the L1LP *****/
  /***********************************************************/

  // TODO: move to bridging service as it's corresponds to fast deposits.
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

  // TODO: teleportation.service.ts
  getTeleportationAddress(chainId?: number) {
    if (!chainId) {
      chainId = this.chainId
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

  // TODO: teleportation.service.ts
  getTeleportationContract(chainId) {
    const { teleportationAddr, networkConfig } =
      this.getTeleportationAddress(chainId)
    if (!teleportationAddr || !this.Teleportation) {
      return
    }

    const rpc = getRpcUrl({
      networkType: networkConfig.networkType,
      network: networkConfig.chain,
      layer: networkConfig.layer,
    })
    const provider = new ethers.providers.StaticJsonRpcProvider(rpc)

    return this.Teleportation!.attach(teleportationAddr).connect(provider)
  }

  // TODO: teleportation.service.ts
  async isTeleportationOfAssetSupported(layer, token, destChainId) {
    const teleportationAddr =
      layer === Layer.L1
        ? this.addresses.Proxy__L1Teleportation
        : this.addresses.Proxy__L2Teleportation
    if (!teleportationAddr) {
      return { supported: false }
    }
    const contract = this.Teleportation!.attach(teleportationAddr).connect(
      this.provider!.getSigner()
    )
    return contract.supportedTokens(token, destChainId)
  }

  // TODO: teleportation.service.ts
  async depositWithTeleporter(layer, currency, value_Wei_String, destChainId) {
    try {
      updateSignatureStatus_depositLP(false)
      setFetchDepositTxBlock(false)

      const teleportationAddr =
        layer === Layer.L1
          ? this.addresses.Proxy__L1Teleportation
          : this.addresses.Proxy__L2Teleportation
      const msgVal =
        currency === this.addresses.L1_ETH_Address ||
        currency === this.addresses.NETWORK_NATIVE
          ? { value: value_Wei_String }
          : {}
      const teleportationContract = this.Teleportation!.attach(
        teleportationAddr
      ).connect(this.provider!.getSigner())
      const tokenAddress =
        currency === this.addresses.NETWORK_NATIVE
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

  /**************************************************************/
  /***** SWAP OFF from BOBA by depositing funds to the L2LP *****/
  /**************************************************************/
  // TODO: bridging.service.ts
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

  // TODO: price.service.ts or api.service.ts
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
}

const networkService = new NetworkService()
export default networkService
