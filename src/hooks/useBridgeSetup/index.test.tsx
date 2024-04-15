import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useBridgeSetup from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { LAYER } from 'util/constant'

jest.mock('services/networkService', () => {
  return {
    L1LPBalance: jest.fn(),
    L2LPBalance: jest.fn(),
    L1LPPending: jest.fn(),
    L2LPPending: jest.fn(),
    L1LPLiquidity: jest.fn(),
    L2LPLiquidity: jest.fn(),
    fetchLookUpPrice: jest.fn(),
    getL1TotalFeeRate: jest.fn(),
    getL2TotalFeeRate: jest.fn(),
    getL1UserRewardFeeRate: jest.fn(),
    getL2UserRewardFeeRate: jest.fn(),
    getFastExitCost: jest.fn(),
    getExitCost: jest.fn(),
    getFastDepositCost: jest.fn(),
    getL1FeeBalance: jest.fn(),
    getL2BalanceETH: jest.fn(),
    getL2BalanceBOBA: jest.fn(),
    getExitFeeFromBillingContract: jest.fn(),
    supportedTokens: [
      'USDT',
      'DAI',
      'USDC',
      'WBTC',
      'REP',
      'BAT',
      'ZRX',
      'SUSHI',
      'LINK',
      'UNI',
      'BOBA',
      'xBOBA',
      'OMG',
      'FRAX',
      'FXS',
      'DODO',
      'UST',
      'BUSD',
      'BNB',
      'FTM',
      'MATIC',
      'UMA',
      'DOM',
      'OLO',
      'WAGMIv0',
      'WAGMIv1',
      'WAGMIv2',
      'WAGMIv2-Oolong',
      'WAGMIv3',
      'WAGMIv3-Oolong',
      'CGT',
    ],
  }
})

describe('useBridgeSetup', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  test('Bridge Setup network is L2, but the funds will be paid out to L1. we request required info for classic briding', async () => {
    const initialState = {
      ...mockedInitialState,
      bridge: {
        ...mockedInitialState.bridge,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            currency: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
            addressL1: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
            addressL2: '0xe1e2ec9a85c607092668789581251115bcbd20de',
            symbolL1: 'OMG',
            symbolL2: 'OMG',
            decimals: 18,
            name: 'OMGToken',
            redalert: false,
            balance: '12f36952259fa2ac',
            layer: 'L2',
            address: '0xe1e2ec9a85c607092668789581251115bcbd20de',
            symbol: 'OMG',
            amount: 0,
            toWei_String: 0,
          },
        ],
      },
      setup: {
        ...mockedInitialState,
        netLayer: LAYER.L2,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeSetup(), {
      wrapper,
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({ type: 'FETCH/L2ETH/BALANCE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/L2BOBA/BALANCE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/EXITFEE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/CLASSICEXIT/COST/REQUEST' })
  })

  test('Bridge LookupPrice should get prices when tokenList and supportedTokens are defined', async () => {
    const initialState = {
      ...mockedInitialState,
      tokenList: {
        '0x0000000000000000000000000000000000000000': {
          currency: '0x0000000000000000000000000000000000000000',
          addressL1: '0x0000000000000000000000000000000000000000',
          addressL2: '0x4200000000000000000000000000000000000023',
          symbolL1: 'ETH',
          symbolL2: 'ETH',
          decimals: 18,
          name: 'ETH',
          redalert: false,
        },
        '0xdac17f958d2ee523a2206206994597c13d831ec7': {
          currency: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          addressL1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          addressL2: '0x5de1677344d3cb0d7d465c10b72a8f60699c062d',
          symbolL1: 'USDT',
          symbolL2: 'USDT',
          decimals: 6,
          name: 'Tether USD',
          redalert: false,
        },
        '0x6b175474e89094c44da98b954eedeac495271d0f': {
          currency: '0x6b175474e89094c44da98b954eedeac495271d0f',
          addressL1: '0x6b175474e89094c44da98b954eedeac495271d0f',
          addressL2: '0xf74195bb8a5cf652411867c5c2c5b8c2a402be35',
          symbolL1: 'DAI',
          symbolL2: 'DAI',
          decimals: 18,
          name: 'Dai Stablecoin',
          redalert: false,
        },
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
          currency: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          addressL1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          addressL2: '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
          symbolL1: 'USDC',
          symbolL2: 'USDC',
          decimals: 6,
          name: 'USD Coin',
          redalert: false,
        },
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
          currency: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          addressL1: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          addressL2: '0xdc0486f8bf31df57a952bcd3c1d3e166e3d9ec8b',
          symbolL1: 'WBTC',
          symbolL2: 'WBTC',
          decimals: 8,
          name: 'Wrapped BTC',
          redalert: false,
        },
        '0x221657776846890989a759ba2973e427dff5c9bb': {
          currency: '0x221657776846890989a759ba2973e427dff5c9bb',
          addressL1: '0x221657776846890989a759ba2973e427dff5c9bb',
          addressL2: '0x8b5b1e971862015bc058234fc11ce6c4a4c536dd',
          symbolL1: 'REPv2',
          symbolL2: 'REPv2',
          decimals: 18,
          name: 'Reputation',
          redalert: false,
        },
        '0x0d8775f648430679a709e98d2b0cb6250d2887ef': {
          currency: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
          addressL1: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
          addressL2: '0xc0c16df1ee7dcefb88c55003c49f57aa416a3578',
          symbolL1: 'BAT',
          symbolL2: 'BAT',
          decimals: 18,
          name: 'Basic Attention Token',
          redalert: false,
        },
        '0xe41d2489571d322189246dafa5ebde1f4699f498': {
          currency: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          addressL1: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          addressL2: '0xf135f13db3b114107dcb0b32b6c9e10fff5a6987',
          symbolL1: 'ZRX',
          symbolL2: 'ZRX',
          decimals: 18,
          name: '0x Protocol Token',
          redalert: false,
        },
        '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': {
          currency: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
          addressL1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
          addressL2: '0x5ffccc55c0d2fd6d3ac32c26c020b3267e933f1b',
          symbolL1: 'SUSHI',
          symbolL2: 'SUSHI',
          decimals: 18,
          name: 'SushiToken',
          redalert: false,
        },
        '0x514910771af9ca656af840dff83e8264ecf986ca': {
          currency: '0x514910771af9ca656af840dff83e8264ecf986ca',
          addressL1: '0x514910771af9ca656af840dff83e8264ecf986ca',
          addressL2: '0xd5d5030831ee83e22a2c9a5cf99931a50c676433',
          symbolL1: 'LINK',
          symbolL2: 'LINK',
          decimals: 18,
          name: 'ChainLink Token',
          redalert: false,
        },
        '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': {
          currency: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          addressL1: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          addressL2: '0xdbde1347fed5dc03c74059010d571a16417d307e',
          symbolL1: 'UNI',
          symbolL2: 'UNI',
          decimals: 18,
          name: 'Uniswap',
          redalert: false,
        },
        '0x42bbfa2e77757c645eeaad1655e0911a7553efbc': {
          currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
          addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
          addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
          symbolL1: 'BOBA',
          symbolL2: 'BOBA',
          decimals: 18,
          name: 'Boba Token',
          redalert: false,
        },
        '0xd26114cd6ee289accf82350c8d8487fedb8a0c07': {
          currency: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
          addressL1: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
          addressL2: '0xe1e2ec9a85c607092668789581251115bcbd20de',
          symbolL1: 'OMG',
          symbolL2: 'OMG',
          decimals: 18,
          name: 'OMGToken',
          redalert: false,
        },
        '0x853d955acef822db058eb8505911ed77f175b99e': {
          currency: '0x853d955acef822db058eb8505911ed77f175b99e',
          addressL1: '0x853d955acef822db058eb8505911ed77f175b99e',
          addressL2: '0xab2af3a98d229b7daed7305bb88ad0ba2c42f9ca',
          symbolL1: 'FRAX',
          symbolL2: 'FRAX',
          decimals: 18,
          name: 'Frax',
          redalert: false,
        },
        '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0': {
          currency: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
          addressL1: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
          addressL2: '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00',
          symbolL1: 'FXS',
          symbolL2: 'FXS',
          decimals: 18,
          name: 'Frax Share',
          redalert: false,
        },
        '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd': {
          currency: '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
          addressL1: '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
          addressL2: '0x572c5b5bf34f75fb62c39b9bfe9a75bb0bb47984',
          symbolL1: 'DODO',
          symbolL2: 'DODO',
          decimals: 18,
          name: 'DODO bird',
          redalert: false,
        },
        '0xa47c8bf37f92abed4a126bda807a7b7498661acd': {
          currency: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
          addressL1: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
          addressL2: '0xe5ef1407928ebce28a6f1a0759251b7187fea726',
          symbolL1: 'UST',
          symbolL2: 'UST',
          decimals: 18,
          name: 'Wrapped UST Token',
          redalert: false,
        },
        '0x4fabb145d64652a948d72533023f6e7a623c7c53': {
          currency: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
          addressL1: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
          addressL2: '0x352f2fdf653a194b42e3311f869237c66309b69e',
          symbolL1: 'BUSD',
          symbolL2: 'BUSD',
          decimals: 18,
          name: 'Binance USD',
          redalert: false,
        },
        '0xb8c77482e45f1f44de1745f52c74426c631bdd52': {
          currency: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
          addressL1: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
          addressL2: '0x68ac1623acf9eb9f88b65b5f229fe3e2c0d5789e',
          symbolL1: 'BNB',
          symbolL2: 'BNB',
          decimals: 18,
          name: 'BNB',
          redalert: false,
        },
        '0x4e15361fd6b4bb609fa63c81a2be19d873717870': {
          currency: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
          addressL1: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
          addressL2: '0x841979bbc06be7bfe28d9faddac1a73e1fb495c1',
          symbolL1: 'FTM',
          symbolL2: 'FTM',
          decimals: 18,
          name: 'Fantom Token',
          redalert: false,
        },
        '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': {
          currency: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
          addressL1: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
          addressL2: '0x26b664736217407e0fa252b4578db23b1e3819f3',
          symbolL1: 'MATIC',
          symbolL2: 'MATIC',
          decimals: 18,
          name: 'Matic Token',
          redalert: false,
        },
        '0x04fa0d235c4abf4bcf4787af4cf447de572ef828': {
          currency: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
          addressL1: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
          addressL2: '0x780f33ad21314d9a1ffb6867fe53d48a76ec0d16',
          symbolL1: 'UMA',
          symbolL2: 'UMA',
          decimals: 18,
          name: 'UMA Voting Token v1',
          redalert: false,
        },
        '0xef5fa9f3dede72ec306dfff1a7ea0bb0a2f7046f': {
          currency: '0xef5fa9f3dede72ec306dfff1a7ea0bb0a2f7046f',
          addressL1: '0xef5fa9f3dede72ec306dfff1a7ea0bb0a2f7046f',
          addressL2: '0xf56fbec7823260d7510d63b63533153b58a01921',
          symbolL1: 'DOM',
          symbolL2: 'DOM',
          decimals: 18,
          name: 'Domination Finance Token',
          redalert: false,
        },
        '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a': {
          currency: '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a',
          addressL1: '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a',
          addressL2: '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a',
          symbolL1: 'CGT',
          symbolL2: 'CGT',
          decimals: 18,
          name: 'Curio Governance Token',
          redalert: false,
        },
        olo: {
          currency: 'olo',
          addressL1: 'olo',
          addressL2: '0x5008f837883ea9a07271a1b5eb0658404f5a9610',
          symbolL1: 'OLO',
          symbolL2: 'OLO',
          decimals: 18,
          name: 'OolongSwap Token',
          redalert: false,
        },
        '0xce055ea4f29ffb8bf35e852522b96ab67cbe8197': {
          currency: '0xce055ea4f29ffb8bf35e852522b96ab67cbe8197',
          addressL1: 'wagmiv1',
          addressL2: '0xce055ea4f29ffb8bf35e852522b96ab67cbe8197',
          symbolL1: 'WAGMIv1',
          symbolL2: 'WAGMIv1',
          decimals: 18,
          name: 'Boba WAGMI v1 Option',
          redalert: false,
        },
        '0x76b5908ecd0ae3db23011ae96b7c1f803d63136c': {
          currency: '0x76b5908ecd0ae3db23011ae96b7c1f803d63136c',
          addressL1: 'wagmiv2',
          addressL2: '0x76b5908ecd0ae3db23011ae96b7c1f803d63136c',
          symbolL1: 'WAGMIv2',
          symbolL2: 'WAGMIv2',
          decimals: 18,
          name: 'Boba WAGMI v2 Option',
          redalert: false,
        },
        '0x8493c4d9cd1a79be0523791e3331c78abb3f9672': {
          currency: '0x8493c4d9cd1a79be0523791e3331c78abb3f9672',
          addressL1: 'wagmiv0',
          addressL2: '0x8493c4d9cd1a79be0523791e3331c78abb3f9672',
          symbolL1: 'WAGMIv0',
          symbolL2: 'WAGMIv0',
          decimals: 18,
          name: 'Boba WAGMI v0 Option',
          redalert: false,
        },
        '0x5747a93c87943a9567c6db00b38f1e78bf14b7c0': {
          currency: '0x5747a93c87943a9567c6db00b38f1e78bf14b7c0',
          addressL1: 'xboba',
          addressL2: '0x5747a93c87943a9567c6db00b38f1e78bf14b7c0',
          symbolL1: 'xBOBA',
          symbolL2: 'xBOBA',
          decimals: 18,
          name: 'xBOBA Token',
          redalert: false,
        },
        '0xc6158b1989f89977bcc3150fc1f2eb2260f6cabe': {
          currency: '0xc6158b1989f89977bcc3150fc1f2eb2260f6cabe',
          addressL1: 'wagmiv3',
          addressL2: '0xc6158b1989f89977bcc3150fc1f2eb2260f6cabe',
          symbolL1: 'WAGMIv3',
          symbolL2: 'WAGMIv3',
          decimals: 18,
          name: 'Boba WAGMI v3 Option',
          redalert: false,
        },
        '0x70bf3c5b5d80c4fece8bde0fce7ef38b688463d4': {
          currency: '0x70bf3c5b5d80c4fece8bde0fce7ef38b688463d4',
          addressL1: 'wagmiv3-oolong',
          addressL2: '0x70bf3c5b5d80c4fece8bde0fce7ef38b688463d4',
          symbolL1: 'WAGMIv3-Oolong',
          symbolL2: 'WAGMIv3-Oolong',
          decimals: 18,
          name: 'Boba WAGMI v3 Oolong Option',
          redalert: false,
        },
        '0x49a3e4a1284829160f95ee785a1a5ffe2dd5eb1d': {
          currency: '0x49a3e4a1284829160f95ee785a1a5ffe2dd5eb1d',
          addressL1: 'wagmiv2-oolong',
          addressL2: '0x49a3e4a1284829160f95ee785a1a5ffe2dd5eb1d',
          symbolL1: 'WAGMIv2-Oolong',
          symbolL2: 'WAGMIv2-Oolong',
          decimals: 18,
          name: 'Boba WAGMI v2 Oolong Option',
          redalert: false,
        },
      },
      bridge: {
        ...mockedInitialState.bridge,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            currency: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
            addressL1: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
            addressL2: '0xe1e2ec9a85c607092668789581251115bcbd20de',
            symbolL1: 'OMG',
            symbolL2: 'OMG',
            decimals: 18,
            name: 'OMGToken',
            redalert: false,
            balance: '12f36952259fa2ac',
            layer: 'L2',
            address: '0xe1e2ec9a85c607092668789581251115bcbd20de',
            symbol: 'OMG',
            amount: 0,
            toWei_String: 0,
          },
        ],
      },
      setup: {
        ...mockedInitialState,
        accountEnabled: true,
        netLayer: LAYER.L2,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeSetup(), {
      wrapper,
    })

    await act(async () => {
      await result.current.getLookupPrice()
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({ type: 'PRICE/GET/REQUEST' })
  })
})
