import { BigNumber, ethers } from 'ethers'
import { L1ERC20ABI } from 'services/abi'

import { Network } from 'util/network/network.util'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import store from 'store'
import orderBy from 'lodash.orderby'

export const Balances = async () => {
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
