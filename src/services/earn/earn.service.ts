import { TokenInfo } from 'containers/history/tokenInfo'
import { BigNumberish, Contract } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import {
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L2LiquidityPoolABI,
  L2StandardERC20ABI,
} from 'services/abi'
import networkService from 'services/networkService'
import { LiquidityPoolLayer } from 'types/earn.types'
import { sortRawTokens } from 'util/common'
import { ERROR_CODE } from 'util/constant'
import { Network } from 'util/network/network.util'

export class EarnService {
  loadL1LpContract() {
    if (networkService.addresses.L1LPAddress) {
      throw new Error(`${ERROR_CODE} L1LpAddress not found!`)
    }
    return new Contract(
      networkService.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      networkService.L1Provider
    )
  }

  loadL2LpContract() {
    if (!networkService.addresses.L2LPAddress) {
      throw new Error(`${ERROR_CODE} L2LpAddress not found!`)
    }
    return new Contract(
      networkService.addresses.L2LPAddress,
      L2LiquidityPoolABI,
      networkService.L2Provider
    )
  }

  checkWalletConnection() {
    if (!networkService.account) {
      throw new Error(`${ERROR_CODE} wallet not connected!`)
    }
  }

  async loadL1LpInfo() {
    try {
      const account = networkService.account
      const addresses = networkService.addresses
      const tokenAddresses = networkService.tokenAddresses

      const poolInfo = {}
      const userInfo = {}

      const tokenAddressList = Object.keys(tokenAddresses!).reduce(
        (acc, tokenSymbol) => {
          if (
            tokenSymbol !== 'xBOBA' &&
            tokenSymbol !== 'OLO' &&
            tokenSymbol !== 'WAGMIv0' &&
            tokenSymbol !== 'WAGMIv1' &&
            tokenSymbol !== 'WAGMIv2' &&
            tokenSymbol !== 'WAGMIv2-Oolong' &&
            tokenSymbol !== 'WAGMIv3' &&
            tokenSymbol !== 'WAGMIv3-Oolong'
          ) {
            acc.push(tokenAddresses![tokenSymbol].L1.toLowerCase())
          }
          return acc
        },
        [addresses.L1_ETH_Address]
      )

      const L1LPContract = new Contract(
        addresses.L1LPAddress,
        L1LiquidityPoolABI,
        networkService.L1Provider
      )

      const L1LPInfoPromise: any = []

      const getL1LPInfoPromise = async (tokenAddress) => {
        let tokenBalance
        let tokenSymbol
        let tokenName
        let decimals

        if (tokenAddress === addresses.L1_ETH_Address) {
          //getting eth balance
          tokenBalance = await networkService.L1Provider!.getBalance(
            addresses.L1LPAddress
          )
          tokenSymbol = networkService.L1NativeTokenSymbol
          tokenName = networkService.L1NativeTokenName
          decimals = 18
        } else {
          //getting eth balance
          const tokenContract = new Contract(
            tokenAddress,
            L1ERC20ABI,
            networkService.L1Provider
          )

          tokenBalance = await tokenContract.balanceOf(addresses.L1LPAddress)
          const tokenInfoFiltered =
            networkService.tokenInfo!.L1[getAddress(tokenAddress)]

          if (TokenInfo) {
            tokenSymbol = tokenInfoFiltered?.symbol
            tokenName = tokenInfoFiltered?.name
            decimals = tokenInfoFiltered?.decimals
          } else {
            tokenSymbol = await tokenContract.symbol()
            tokenName = await tokenContract.name()
            decimals = await tokenContract.decimals()
          }
        }

        const poolTokenInfo = await L1LPContract.poolInfo(tokenAddress)
        let userTokenInfo = {}
        if (typeof account !== 'undefined' && account) {
          userTokenInfo = await L1LPContract.userInfo(tokenAddress, account)
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
    } catch (error) {
      return error
    }
  }
  async loadL2LpInfo() {
    try {
      const account = networkService.account
      const addresses = networkService.addresses
      const tokenAddresses = networkService.tokenAddresses

      const tokenAddressList = Object.keys(tokenAddresses!).reduce(
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
              L1: tokenAddresses![cur].L1.toLowerCase(),
              L2: tokenAddresses![cur].L2.toLowerCase(),
            })
          }
          return acc
        },
        [
          {
            L1: addresses.L1_ETH_Address,
            L2: addresses[`TK_L2${networkService.L1NativeTokenSymbol}`],
          },
        ]
      )

      const L2LPContract = new Contract(
        addresses.L2LPAddress,
        L2LiquidityPoolABI,
        networkService.L2Provider
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

        if (tokenAddress === addresses.L2_ETH_Address) {
          tokenBalance = await networkService.L2Provider!.getBalance(
            addresses.L2LPAddress
          )
          tokenSymbol =
            networkService.network === Network.ETHEREUM ? 'ETH' : 'BOBA'
          tokenName =
            networkService.network === Network.ETHEREUM
              ? 'Ethereum'
              : 'BOBA Token'
          decimals = 18
        } else {
          const tokenContract = new Contract(
            tokenAddress,
            L2StandardERC20ABI,
            networkService.L2Provider
          )

          tokenBalance = await tokenContract.balanceOf(addresses.L2LPAddress)
          const tokenInfoFiltered =
            networkService.tokenInfo!.L2[getAddress(tokenAddress)]
          if (TokenInfo) {
            tokenSymbol = tokenInfoFiltered.symbol
            tokenName = tokenInfoFiltered.name
            decimals = tokenInfoFiltered.decimals
          } else {
            tokenSymbol = await tokenContract.symbol()
            tokenName = await tokenContract.name()

            const l1TokenContract = new Contract(
              tokenAddressL1,
              L1ERC20ABI,
              networkService.L1Provider
            )

            decimals = await l1TokenContract.decimals()
          }
        }
        const poolTokenInfo = await L2LPContract.poolInfo(tokenAddress)
        let userTokenInfo = {}
        if (typeof account !== 'undefined' && account) {
          userTokenInfo = await L2LPContract.userInfo(tokenAddress, account)
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
    } catch (error) {
      console.log(`loadL2LpInfo error`, error)
      return error
    }
  }
  async loadL1LpBalance(tokenAddress: string) {
    try {
      this.checkWalletConnection()
      let balance: BigNumberish
      const tokenAddressLC = tokenAddress.toLowerCase()

      if (
        [
          networkService.addresses.L2_ETH_Address,
          networkService.addresses.L1_ETH_Address,
        ].includes(tokenAddressLC)
      ) {
        balance = await networkService.L1Provider!.getBalance(
          networkService.addresses.L1LPAddress
        )
      } else {
        const contract = new Contract(
          tokenAddress,
          L1ERC20ABI,
          networkService.L1Provider
        )

        balance = await contract.balanceOf(networkService.addresses.L1LPAddress)
      }

      return balance.toString()
    } catch (error) {
      return error
    }
  }
  async loadL2LpBalance(tokenAddress: string) {
    try {
      this.checkWalletConnection()
      const addressLC = tokenAddress.toLowerCase()

      let contractAddress = tokenAddress

      if (
        [
          networkService.addresses.L2_BOBA_Address,
          networkService.addresses.L1_ETH_Address,
        ].includes(addressLC)
      ) {
        //We are dealing with ETH
        contractAddress = networkService.addresses.L2_ETH_Address
      }

      const contract = new Contract(
        contractAddress,
        L2StandardERC20ABI,
        networkService.L2Provider
      )

      const balance = await contract.balanceOf(
        networkService.addresses.L2LPAddress
      )

      return balance.toString()
    } catch (error) {
      return error
    }
  }
  async loadReward({
    currencyAddress,
    value_Wei_String,
    L1orL2Pool,
  }: {
    currencyAddress: string
    value_Wei_String: BigNumberish
    L1orL2Pool: LiquidityPoolLayer
  }) {
    try {
      this.checkWalletConnection()

      let contract = this.loadL1LpContract()
      if (L1orL2Pool !== LiquidityPoolLayer.L1LP) {
        contract = this.loadL2LpContract()
      }

      const TX = await contract
        .connect(networkService.provider!.getSigner())
        .withdrawReward(
          value_Wei_String,
          currencyAddress,
          networkService.account
        )

      await TX.wait()

      return TX
    } catch (error) {
      return error
    }
  }

  async withdrawLiquidity({
    currency,
    value_Wei_String,
    L1orL2Pool,
  }: {
    currency: string
    value_Wei_String: string
    L1orL2Pool: LiquidityPoolLayer
  }) {
    try {
      this.checkWalletConnection()

      let contract = this.loadL1LpContract()

      if (L1orL2Pool !== LiquidityPoolLayer.L1LP) {
        contract = this.loadL2LpContract()
      }

      const estimateGas = await contract.estimateGas.withdrawLiquidity(
        value_Wei_String,
        currency,
        networkService.account,
        { from: networkService.account }
      )

      const blockGasLimit = (await networkService.provider!.getBlock('latest'))
        .gasLimit

      const TX = await contract
        .connect(networkService.provider!.getSigner())
        .withdrawLiquidity(value_Wei_String, currency, networkService.account, {
          gasLimit: estimateGas.mul(2).gt(blockGasLimit)
            ? blockGasLimit
            : estimateGas.mul(2),
        })

      await TX.wait()
      return TX
    } catch (error) {
      return error
    }
  }
}

const earnService = new EarnService()
export default earnService
