import networkService from 'services/networkService'
import { ethers, utils } from 'ethers'
import { L1LiquidityPoolABI } from 'services/abi'
import tokenInfo from '@bobanetwork/register/addresses/tokenInfo.json'
import { sortRawTokens } from 'util/common'

export const L1LPInfo = async () => {
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

  const L1LPdata = await Promise.all(L1LPInfoPromise)
  sortRawTokens(L1LPdata).forEach((token) => {
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
