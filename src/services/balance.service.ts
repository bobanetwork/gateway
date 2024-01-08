import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import networkService from './networkService'
import walletService from './wallet.service'
import {
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L2LiquidityPoolABI,
  L2StandardERC20ABI,
} from './abi'
import orderBy from 'lodash.orderby'
import { Network } from 'util/network/network.util'
import store from 'store'
import omgxWatcherAxiosInstance from 'api/omgxWatcherAxios'

export class BalanceService {
  async getL1FeeBalance() {
    try {
      const balance = await networkService.L1Provider!.getBalance(
        walletService.account!
      )
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL1FeeBalance error:', error)
      return 0
    }
  }

  async getL2BalanceETH() {
    try {
      const balance = await networkService.L2Provider!.getBalance(
        walletService.account!
      )
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL2BalanceETH error:', error)
      return 0
    }
  }

  async getL2BalanceBOBA() {
    try {
      const ERC20Contract = new ethers.Contract(
        networkService.tokenAddresses!['BOBA'].L2,
        L2StandardERC20ABI,
        walletService.provider!.getSigner()
      )
      const balance = await ERC20Contract.balanceOf(walletService.account)
      return utils.formatEther(balance)
    } catch (error) {
      console.log('NS: getL2BalanceBOBA error:', error)
      return 0
    }
  }

  async getBalances() {
    try {
      let layer1Balances: Array<any> // TODO: define type or interface
      let layer2Balances: Array<any> // TODO: define type or interface
      if (networkService.network === Network.ETHEREUM) {
        layer1Balances = [
          {
            address: networkService.addresses.L1_ETH_Address,
            addressL2: networkService.addresses.L2_ETH_Address,
            currency: networkService.addresses.L1_ETH_Address,
            symbol: 'ETH',
            decimals: 18,
            balance: BigNumber.from('0'),
          },
        ]

        layer2Balances = [
          {
            address: networkService.addresses.L2_ETH_Address,
            addressL1: networkService.addresses.L1_ETH_Address,
            addressL2: networkService.addresses.L2_ETH_Address,
            currency: networkService.addresses.L1_ETH_Address,
            symbol: 'ETH',
            decimals: 18,
            balance: BigNumber.from('0'),
          },
        ]
      } else {
        layer1Balances = [
          {
            address: networkService.addresses.L1_ETH_Address,
            addressL2:
              networkService.addresses[
                'TK_L2' + networkService.L1NativeTokenSymbol
              ],
            currency: networkService.addresses.L1_ETH_Address,
            symbol: networkService.L1NativeTokenSymbol,
            decimals: 18,
            balance: BigNumber.from('0'),
          },
        ]

        layer2Balances = [
          {
            address: networkService.addresses.L2_ETH_Address,
            addressL1: networkService.addresses.TK_L1BOBA,
            addressL2: networkService.addresses.L2_ETH_Address,
            currency: networkService.addresses.TK_L1BOBA,
            symbol: 'BOBA',
            decimals: 18,
            balance: BigNumber.from('0'),
          },
        ]
      }

      // Always check ETH
      const layer1Balance = await networkService.L1Provider!.getBalance(
        walletService.account!
      )
      const layer2Balance = await networkService.L2Provider!.getBalance(
        walletService.account!
      )

      layer1Balances[0].balance = BigNumber.from(layer1Balance.toString())
      layer2Balances[0].balance = BigNumber.from(layer2Balance.toString())

      const state = store.getState()
      const tA = Object.values(state.tokenList)

      const tokenC = new ethers.Contract(
        networkService.addresses.L1_ETH_Address,
        L1ERC20ABI,
        networkService.L1Provider
      )

      const getERC20Balance = async (token, tokenAddress, layer, provider) => {
        const balance = await tokenC
          .attach(tokenAddress)
          .connect(provider)
          .balanceOf(walletService.account)
        return {
          ...token,
          balance: BigNumber.from(balance.toString()),
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
        if (networkService.network === Network.ETHEREUM) {
          if (token.addressL1 === networkService.addresses.L1_ETH_Address) {
            return
          }
          if (token.addressL2 === networkService.addresses.L2_ETH_Address) {
            return
          }
        } else {
          if (token.addressL1 === networkService.addresses.L1_ETH_Address) {
            return getBalancePromise.push(
              getERC20Balance(
                token,
                token.addressL2,
                'L2',
                networkService.L2Provider
              )
            )
          }
          if (token.addressL2 === networkService.addresses.L2_BOBA_Address) {
            return getBalancePromise.push(
              getERC20Balance(
                token,
                token.addressL1,
                'L1',
                networkService.L1Provider
              )
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
            getERC20Balance(
              token,
              token.addressL2,
              'L2',
              networkService.L2Provider
            )
          )
        } else {
          getBalancePromise.push(
            getERC20Balance(
              token,
              token.addressL1,
              'L1',
              networkService.L1Provider
            )
          )
          getBalancePromise.push(
            getERC20Balance(
              token,
              token.addressL2,
              'L2',
              networkService.L2Provider
            )
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

  async L2LPPending(tokenAddress: string) {
    //Placeholder return
    const sum = BigNumber.from('0')
    return sum.toString()
  }

  async L1LPPending(tokenAddress: string): Promise<string> {
    const L1pending = await omgxWatcherAxiosInstance(
      networkService.networkConfig
    ).get('get.l2.pendingexits', {})

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

  async L1LPBalance(tokenAddress: string): Promise<string> {
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

  async L2LPBalance(tokenAddress: string): Promise<string> {
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

  async L1LPLiquidity(tokenAddress: string) {
    const L1LPContract = new ethers.Contract(
      networkService.addresses.L1LPAddress,
      L1LiquidityPoolABI,
      networkService.L1Provider
    )

    try {
      const poolTokenInfo = await L1LPContract.poolInfo(tokenAddress)
      return poolTokenInfo.userDepositAmount.toString()
    } catch (error) {
      console.log('NS: L1LPLiquidity error:', error)
      return 0
    }
  }

  async L2LPLiquidity(tokenAddress: string) {
    const L2LPContract = new ethers.Contract(
      networkService.addresses.L2LPAddress,
      L2LiquidityPoolABI,
      networkService.L2Provider
    )

    try {
      const poolTokenInfo = await L2LPContract.poolInfo(tokenAddress)
      return poolTokenInfo.userDepositAmount.toString()
    } catch (error) {
      console.log('NS: L2LPLiquidity error:', error)
      return 0
    }
  }
}

const balanceService = new BalanceService()

export default balanceService
