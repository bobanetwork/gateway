/* eslint-disable */

import { BigNumberish, ethers, utils } from 'ethers'
import { L1LiquidityPoolABI, L2LiquidityPoolABI } from './abi'
import networkService from './networkService'
import tokenInfo from '@bobanetwork/register/addresses/tokenInfo.json'
import { sortRawTokens } from 'util/common'
import { Network } from 'util/network/network.util'
import { LiquidityPoolLayer } from 'types/earn.types'

/*Earn program is deprecated but we need to support indefinetly to withdraw tokens from LP*/

class EarnService {
  async getL1LPInfo() {
    const poolInfo = {}
    const userInfo = {}

    const tokenAddressList = Object.keys(networkService.tokenAddresses!).reduce(
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
          acc.push(networkService.tokenAddresses![cur].L1.toLowerCase())
        }
        return acc
      },
      [networkService.addresses.L1_ETH_Address]
    )

    const L1LPContract = new ethers.Contract(
      networkService.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      networkService.L1Provider
    )

    const L1LPInfoPromise: any = []

    const getL1LPInfoPromise = async (tokenAddress) => {
      let tokenBalance
      let tokenSymbol
      let tokenName
      let decimals

      if (tokenAddress === networkService.addresses.L1_ETH_Address) {
        //getting eth balance
        tokenBalance = await networkService.L1Provider!.getBalance(
          networkService.addresses.L1LPAddress
        )
        tokenSymbol = networkService.L1NativeTokenSymbol
        tokenName = networkService.L1NativeTokenName
        decimals = 18
      } else {
        //getting eth balance
        tokenBalance = await networkService
          .L1_TEST_Contract!.attach(tokenAddress)
          .connect(networkService.L1Provider!)
          .balanceOf(networkService.addresses.L1LPAddress)
        const tokenInfoFiltered =
          networkService.tokenInfo!.L1[utils.getAddress(tokenAddress)]
        if (tokenInfo) {
          tokenSymbol = tokenInfoFiltered?.symbol
          tokenName = tokenInfoFiltered?.name
          decimals = tokenInfoFiltered?.decimals
        } else {
          tokenSymbol = await networkService
            .L1_TEST_Contract!.attach(tokenAddress)
            .connect(networkService.L1Provider!)
            .symbol()
          tokenName = await networkService
            .L1_TEST_Contract!.attach(tokenAddress)
            .connect(networkService.L1Provider!)
            .name()
          decimals = await networkService
            .L1_TEST_Contract!.attach(tokenAddress)
            .connect(networkService.L1Provider!)
            .decimals()
        }
      }

      const poolTokenInfo = await L1LPContract.poolInfo(tokenAddress)
      let userTokenInfo = {}
      if (
        typeof networkService.account !== 'undefined' &&
        networkService.account
      ) {
        userTokenInfo = await L1LPContract.userInfo(
          tokenAddress,
          networkService.account
        )
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
    const tokenAddressList = Object.keys(networkService.tokenAddresses!).reduce(
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
            L1: networkService.tokenAddresses![cur].L1.toLowerCase(),
            L2: networkService.tokenAddresses![cur].L2.toLowerCase(),
          })
        }
        return acc
      },
      [
        {
          L1: networkService.addresses.L1_ETH_Address,
          L2: networkService.addresses[
            `TK_L2${networkService.L1NativeTokenSymbol}`
          ],
        },
      ]
    )

    const L2LPContract = new ethers.Contract(
      networkService.addresses.L2LPAddress,
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

      if (tokenAddress === networkService.addresses.L2_ETH_Address) {
        tokenBalance = await networkService.L2Provider!.getBalance(
          networkService.addresses.L2LPAddress
        )
        tokenSymbol =
          networkService.network === Network.ETHEREUM ? 'ETH' : 'BOBA'
        tokenName =
          networkService.network === Network.ETHEREUM
            ? 'Ethereum'
            : 'BOBA Token'
        decimals = 18
      } else {
        tokenBalance = await networkService
          .L2_TEST_Contract!.attach(tokenAddress)
          .connect(networkService.L2Provider!)
          .balanceOf(networkService.addresses.L2LPAddress)
        const tokenInfoFiltered =
          networkService.tokenInfo!.L2[utils.getAddress(tokenAddress)]
        if (tokenInfo) {
          tokenSymbol = tokenInfoFiltered.symbol
          tokenName = tokenInfoFiltered.name
          decimals = tokenInfoFiltered.decimals
        } else {
          tokenSymbol = await networkService
            .L2_TEST_Contract!.attach(tokenAddress)
            .connect(networkService.L2Provider!)
            .symbol()
          tokenName = await networkService
            .L2_TEST_Contract!.attach(tokenAddress)
            .connect(networkService.L2Provider!)
            .name()
          decimals = await networkService
            .L1_TEST_Contract!.attach(tokenAddressL1)
            .connect(networkService.L1Provider!)
            .decimals()
        }
      }
      const poolTokenInfo = await L2LPContract.poolInfo(tokenAddress)
      let userTokenInfo = {}
      if (
        typeof networkService.account !== 'undefined' &&
        networkService.account
      ) {
        userTokenInfo = await L2LPContract.userInfo(
          tokenAddress,
          networkService.account
        )
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

  // TODO: setup types correctly.
  async withdrawReward(
    currencyAddress,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? networkService.L1LPContract!
        : networkService.L2LPContract!
      )
        .connect(networkService.provider!.getSigner())
        .withdrawReward(
          value_Wei_String,
          currencyAddress,
          networkService.account
        )
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: withdrawReward error:', error)
      return error
    }
  }

  async getL1LPBalance(tokenAddress: string): Promise<string> {
    let balance: BigNumberish
    const tokenAddressLC = tokenAddress.toLowerCase()

    if (
      tokenAddressLC === networkService.addresses.L2_ETH_Address ||
      tokenAddressLC === networkService.addresses.L1_ETH_Address
    ) {
      balance = await networkService.L1Provider!.getBalance(
        networkService.addresses.L1LPAddress
      )
    } else {
      balance = await networkService
        .L1_TEST_Contract!.attach(tokenAddress)
        .connect(networkService.L1Provider!)
        .balanceOf(networkService.addresses.L1LPAddress)
    }

    return balance.toString()
  }

  async getL2LPBalance(tokenAddress: string): Promise<string> {
    let balance: BigNumberish
    const tokenAddressLC = tokenAddress.toLowerCase()

    if (
      tokenAddressLC === networkService.addresses.L2_BOBA_Address ||
      tokenAddressLC === networkService.addresses.L1_ETH_Address
    ) {
      //We are dealing with ETH
      balance = await networkService
        .L2_ETH_Contract!.connect(networkService.L2Provider!)
        .balanceOf(networkService.addresses.L2LPAddress)
    } else {
      balance = await networkService
        .L2_TEST_Contract!.attach(tokenAddress)
        .connect(networkService.L2Provider!)
        .balanceOf(networkService.addresses.L2LPAddress)
    }

    return balance.toString()
  }

  async withdrawLiquidity(
    currency,
    value_Wei_String,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const estimateGas = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? networkService.L1LPContract!
        : networkService.L2LPContract!
      ).estimateGas.withdrawLiquidity(
        value_Wei_String,
        currency,
        networkService.account,
        { from: networkService.account }
      )
      const blockGasLimit = (await networkService.provider!.getBlock('latest'))
        .gasLimit
      const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? networkService.L1LPContract!
        : networkService.L2LPContract!
      )
        .connect(networkService.provider!.getSigner())
        .withdrawLiquidity(value_Wei_String, currency, networkService.account, {
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
}

const earnService = new EarnService()

export default earnService
