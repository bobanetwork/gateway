/* eslint-disable */

import {
  BigNumberish,
  Contract,
  ContractInterface,
  ethers,
  utils,
} from 'ethers'
import { L1LiquidityPoolABI, L2LiquidityPoolABI } from './abi'
import networkService from './networkService'
import { sortRawTokens } from 'util/common'
import { Network } from 'util/network/network.util'
import { ILpInfoResponse, LiquidityPoolLayer } from 'types/earn.types'
import walletService from './wallet.service'

class EarnService {
  preparePoolUserInfo(rowTokens: any[]): ILpInfoResponse {
    let poolInfo = {}
    let userInfo = {}
    sortRawTokens(rowTokens).forEach((token) => {
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

    return {
      poolInfo,
      userInfo,
    }
  }

  getTokenAddressList(): Array<any> {
    if (
      !networkService.tokenAddresses ||
      !Object.keys(networkService.tokenAddresses).length
    ) {
      return []
    }

    return Object.keys(networkService.tokenAddresses)
      .filter(
        (tokenSymbol) =>
          ![
            'xBOBA',
            'OLO',
            'WAGMIv0',
            'WAGMIv1',
            'WAGMIv2',
            'WAGMIv2-Oolong',
            'WAGMIv3',
            'WAGMIv3-Oolong',
          ].includes(tokenSymbol)
      )
      .map((tokenSymbol) => ({
        // TODO: make sure to change the name to tokenAddressL1, tokenAddressL2
        L1: networkService.tokenAddresses![tokenSymbol].L1.toLowerCase(),
        L2: networkService.tokenAddresses![tokenSymbol].L2.toLowerCase(),
      }))
      .concat([
        {
          L1: networkService.addresses.L1_ETH_Address,
          L2: networkService.addresses[
            `TK_L2${networkService.L1NativeTokenSymbol}`
          ],
        },
      ])
  }

  async getTokenInfo({
    tokenAddress,
    lpContract,
  }: {
    tokenAddress: string
    lpContract: Contract
  }) {
    try {
      if (!!walletService.account) {
        return await lpContract.userInfo(tokenAddress, walletService.account)
      }
      return {}
    } catch (error) {
      return {}
    }
  }

  async getPoolInfo({
    tokenAddress,
    lpContract,
  }: {
    tokenAddress: string
    lpContract: Contract
  }) {
    try {
      return await lpContract.poolInfo(tokenAddress)
    } catch (error) {
      return {}
    }
  }

  async getL1TokenDetail({ tokenAddress }: { tokenAddress: string }) {
    let tokenBalance: BigNumberish
    let tokenSymbol: string
    let tokenName: string
    let decimals: number

    if (tokenAddress === networkService.addresses.L1_ETH_Address) {
      //getting eth balance
      tokenBalance = await networkService.L1Provider!.getBalance(
        networkService.addresses.L1LPAddress
      )
      tokenSymbol = networkService.L1NativeTokenSymbol
      tokenName = networkService.L1NativeTokenName!
      decimals = 18
    } else {
      //getting eth balance
      tokenBalance = await networkService
        .L1_TEST_Contract!.attach(tokenAddress)
        .connect(networkService.L1Provider!)
        .balanceOf(networkService.addresses.L1LPAddress)
      const tokenInfoFiltered =
        networkService.tokenInfo!.L1[utils.getAddress(tokenAddress)]
      if (tokenInfoFiltered) {
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

    return {
      tokenAddress,
      tokenBalance,
      tokenSymbol,
      tokenName,
      decimals,
    }
  }

  async getL2TokenDetail({
    tokenAddress,
    tokenAddressL1,
  }: {
    tokenAddress: string
    tokenAddressL1: string
  }) {
    let tokenBalance: BigNumberish
    let tokenSymbol: string
    let tokenName: string
    let decimals: number

    if (tokenAddress === networkService.addresses.L2_ETH_Address) {
      //getting ETH token balance
      tokenBalance = await networkService.L2Provider!.getBalance(
        networkService.addresses.L2LPAddress
      )
      tokenSymbol = networkService.network === Network.ETHEREUM ? 'ETH' : 'BOBA'
      tokenName =
        networkService.network === Network.ETHEREUM ? 'Ethereum' : 'BOBA Token'
      decimals = 18
    } else {
      tokenBalance = await networkService
        .L2_TEST_Contract!.attach(tokenAddress)
        .connect(networkService.L2Provider!)
        .balanceOf(networkService.addresses.L2LPAddress)

      const tokenInfoFiltered =
        networkService.tokenInfo!.L2[utils.getAddress(tokenAddress)]

      if (tokenInfoFiltered) {
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
    return {
      tokenAddress,
      tokenBalance,
      tokenSymbol,
      tokenName,
      decimals,
    }
  }

  async getL1LPInfo(): Promise<ILpInfoResponse> {
    const L1LPContract = new ethers.Contract(
      networkService.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      networkService.L1Provider
    )

    const l1LPInfoPromiseList: Array<Promise<any>> =
      this.getTokenAddressList().map(async ({ L1 }) => {
        const tokenRes = await this.getL1TokenDetail({
          tokenAddress: L1,
        })
        const poolTokenInfo = await this.getPoolInfo({
          tokenAddress: L1,
          lpContract: L1LPContract,
        })
        const userTokenInfo = await this.getTokenInfo({
          tokenAddress: L1,
          lpContract: L1LPContract,
        })
        return {
          ...tokenRes,
          poolTokenInfo,
          userTokenInfo,
        }
      })

    const l1LPInfo = await Promise.all(l1LPInfoPromiseList)

    return this.preparePoolUserInfo(l1LPInfo)
  }

  async getL2LPInfo(): Promise<ILpInfoResponse> {
    const L2LPContract = new ethers.Contract(
      networkService.addresses.L2LPAddress,
      L2LiquidityPoolABI,
      networkService.L2Provider
    )

    const l2LpPromiseList = this.getTokenAddressList().map(
      async ({ L1, L2 }) => {
        const tokenRes = await this.getL2TokenDetail({
          tokenAddress: L2,
          tokenAddressL1: L1,
        })

        const poolTokenInfo = await this.getPoolInfo({
          tokenAddress: L2,
          lpContract: L2LPContract,
        })
        const userTokenInfo = await this.getTokenInfo({
          tokenAddress: L2,
          lpContract: L2LPContract,
        })

        return {
          ...tokenRes,
          poolTokenInfo,
          userTokenInfo,
        }
      }
    )

    const l2LPInfo = await Promise.all(l2LpPromiseList)

    return this.preparePoolUserInfo(l2LPInfo)
  }

  async withdrawReward(
    currencyAddress: string,
    valueWeiString: BigNumberish,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const L1LPContract = new ethers.Contract(
        networkService.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        networkService.L1Provider
      )

      const L2LPContract = new ethers.Contract(
        networkService.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        networkService.L2Provider
      )

      const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? L1LPContract
        : L2LPContract
      )
        .connect(walletService.provider!.getSigner())
        .withdrawReward(valueWeiString, currencyAddress, networkService.account)
      await TX.wait()
      return TX
    } catch (error) {
      console.log('NS: withdrawReward error:', error)
      return error
    }
  }

  async withdrawLiquidity(
    currency: string,
    valueWeiString: BigNumberish,
    L1orL2Pool: LiquidityPoolLayer
  ) {
    try {
      const L1LPContract = new ethers.Contract(
        networkService.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        networkService.L1Provider
      )

      const L2LPContract = new ethers.Contract(
        networkService.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        networkService.L2Provider
      )

      const estimateGas = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? L1LPContract
        : L2LPContract
      ).estimateGas.withdrawLiquidity(
        valueWeiString,
        currency,
        walletService.account,
        { from: walletService.account }
      )

      const blockGasLimit = (await walletService.provider!.getBlock('latest'))
        .gasLimit

      const gasLimit = estimateGas.mul(2).gt(blockGasLimit)
        ? blockGasLimit
        : estimateGas.mul(2)

      const TX = await (L1orL2Pool === LiquidityPoolLayer.L1LP
        ? L1LPContract
        : L2LPContract
      )
        .connect(walletService.provider!.getSigner())
        .withdrawLiquidity(valueWeiString, currency, walletService.account, {
          gasLimit,
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
