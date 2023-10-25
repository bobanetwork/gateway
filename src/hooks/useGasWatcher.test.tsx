/* eslint-disable */

import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import useGasWatcher from './useGasWatcher'
import configureStore from 'redux-mock-store'
import { NETWORK, NETWORK_TYPE } from 'util/network/network.util'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { fetchGasDetail } from 'services/gas.service'
import networkService from 'services/networkService'
import verifierService from 'services/verifier.service'

jest.mock('services/gas.service')

jest.mock('services/verifier.service')

jest.mock('services/networkService', () => {
  return {
    getAllAddress: jest.fn(),
    estimateL1SecurityFee: jest.fn(),
    estimateL2Fee: jest.fn(),
  }
})

let network = {
  activeNetwork: NETWORK.ETHEREUM,
  activeNetworkType: NETWORK_TYPE.MAINNET,
  activeNetworkName: {
    l1: 'Ethereum',
    l2: 'Boba ETH',
  },
}
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
let store

// create wrapper to pass to hooks.
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>

describe('UseGasWatcher', () => {
  beforeEach(() => {
    // mock services functions.
    ;(fetchGasDetail as jest.Mock).mockResolvedValue({
      gasL1: 100,
      gasL2: 50,
      blockL1: 110000,
      blockL2: 220000,
    })
    ;(verifierService.getVerifierStatus as jest.Mock).mockResolvedValue(322232)
    ;(networkService.estimateL1SecurityFee as jest.Mock).mockResolvedValue(10)
    ;(networkService.estimateL2Fee as jest.Mock).mockResolvedValue(20)
  })

  test('should work as expected incase of ETHEREUM network ', async () => {
    store = mockStore({
      ui: {
        theme: 'dark',
      },
      verifier: {},
      setup: {
        baseEnabled: true,
      },
      network,
    })

    const { result, waitForNextUpdate } = renderHook(() => useGasWatcher(), {
      wrapper,
    })
    // validate initial state
    expect(result.current.gas).toBeUndefined()
    expect(result.current.savings).toBe(1)
    expect(result.current.verifierStatus).toEqual({})
    let actions = store.getActions()

    expect(actions).toEqual([
      { type: 'VERIFIER/GET/REQUEST' },
      { type: 'VERIFIER/GET/REQUEST' },
    ])

    await waitForNextUpdate()

    expect(result.current.gas).toEqual({
      gasL1: 100,
      gasL2: 50,
      blockL1: 110000,
      blockL2: 220000,
    })

    expect(result.current.savings.toFixed(2)).toEqual('1.33')
    expect(result.current.verifierStatus).toEqual({})

    actions = store.getActions()
    expect(actions).toEqual([
      { type: 'VERIFIER/GET/REQUEST' },
      { type: 'VERIFIER/GET/REQUEST' },
      { type: 'VERIFIER/GET/SUCCESS', payload: 322232 },
      { type: 'VERIFIER/GET/SUCCESS', payload: 322232 },
    ])
    store.clearActions()
  })

  test('should work as expected incase of BNB network', async () => {
    network = {
      activeNetwork: NETWORK.BNB,
      activeNetworkType: NETWORK_TYPE.MAINNET,
      activeNetworkName: {
        l1: 'Binance',
        l2: 'Boba BNB',
      },
    }

    store = mockStore({
      ui: {
        theme: 'dark',
      },
      verifier: {},
      setup: {
        baseEnabled: true,
      },
      network,
    })

    const { result, waitForNextUpdate } = renderHook(() => useGasWatcher(), {
      wrapper,
    })
    // validate initial state
    expect(result.current.gas).toBeUndefined()
    expect(result.current.savings).toBe(1)
    expect(result.current.verifierStatus).toEqual({})
    let actions = store.getActions()
    expect(actions).toEqual([
      { type: 'VERIFIER/RESET' },
      { type: 'VERIFIER/RESET' },
    ])

    await waitForNextUpdate()

    expect(result.current.gas).toEqual({
      gasL1: 100,
      gasL2: 50,
      blockL1: 110000,
      blockL2: 220000,
    })

    expect(result.current.savings).toBe(1)
    expect(result.current.verifierStatus).toEqual({})

    actions = store.getActions()
    expect(actions).toEqual([
      { type: 'VERIFIER/RESET' },
      { type: 'VERIFIER/RESET' },
    ])
    store.clearActions()
  })
})
