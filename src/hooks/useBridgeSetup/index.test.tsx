import { renderHook } from '@testing-library/react-hooks'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { LAYER } from 'util/constant'
import { mockedInitialState } from 'util/tests'
import useBridgeSetup from './'

jest.mock('services/networkService', () => {
  return {
    L2LPBalance: jest.fn(),
    L1LPPending: jest.fn(),
    L2LPPending: jest.fn(),
    fetchLookUpPrice: jest.fn(),
    getL1TotalFeeRate: jest.fn(),
    getExitCost: jest.fn(),
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

  xtest('Bridge Setup network is L2, but the funds will be paid out to L1. we request required info for classic briding', async () => {
    const initialState = {
      ...mockedInitialState,
      network: {
        ...mockedInitialState.network,
        activeNetwork: 'BNB',
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
        ...mockedInitialState.setup,
        netLayer: LAYER.L2,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    console.log(`initialState`, initialState)

    renderHook(() => useBridgeSetup(), {
      wrapper,
    })

    const actions = store.getActions()
    // console.log(actions);
    expect(actions).toContainEqual({ type: 'FETCH/L2ETH/BALANCE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/L2BOBA/BALANCE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/EXITFEE/REQUEST' })
    expect(actions).toContainEqual({ type: 'FETCH/CLASSICEXIT/COST/REQUEST' })
  })
})
