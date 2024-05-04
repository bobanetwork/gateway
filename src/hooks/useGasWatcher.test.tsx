/* eslint-disable */

import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import useGasWatcher from './useGasWatcher'
import configureStore from 'redux-mock-store'
import { Network, NetworkType } from 'util/network/network.util'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { fetchGasDetail } from 'services/gas.service'
import networkService from 'services/networkService'

jest.mock('services/gas.service')

jest.mock('services/networkService', () => {
  return {
    getAllAddress: jest.fn(),
    estimateL1SecurityFee: jest.fn(),
    estimateL2Fee: jest.fn(),
  }
})

let network = {
  activeNetwork: Network.ETHEREUM,
  activeNetworkType: NetworkType.MAINNET,
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
    ;(networkService.estimateL1SecurityFee as jest.Mock).mockResolvedValue(10)
    ;(networkService.estimateL2Fee as jest.Mock).mockResolvedValue(20)
  })

  test('should work as expected incase of ETHEREUM network ', async () => {
    store = mockStore({
      ui: {
        theme: 'dark',
      },
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

    await waitForNextUpdate()

    expect(result.current.gas).toEqual({
      gasL1: 100,
      gasL2: 50,
      blockL1: 110000,
      blockL2: 220000,
    })

    expect(result.current.savings.toFixed(2)).toEqual('1.33')
    store.clearActions()
  })

  test('should work as expected incase of BNB network', async () => {
    network = {
      activeNetwork: Network.BNB,
      activeNetworkType: NetworkType.MAINNET,
      activeNetworkName: {
        l1: 'Binance',
        l2: 'Boba BNB',
      },
    }

    store = mockStore({
      ui: {
        theme: 'dark',
      },
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
    await waitForNextUpdate()

    expect(result.current.gas).toEqual({
      gasL1: 100,
      gasL2: 50,
      blockL1: 110000,
      blockL2: 220000,
    })

    expect(result.current.savings).toBe(1)
    store.clearActions()
  })
  test('should work as expected when bansedEnabled is false', async () => {
    network = {
      activeNetwork: Network.BNB,
      activeNetworkType: NetworkType.MAINNET,
      activeNetworkName: {
        l1: 'Binance',
        l2: 'Boba BNB',
      },
    }

    store = mockStore({
      ui: {
        theme: 'dark',
      },
      setup: {
        baseEnabled: false,
      },
      network,
    })

    const { result } = renderHook(() => useGasWatcher(), {
      wrapper,
    })
    // validate initial state
    expect(result.current.gas).toBeUndefined()
    expect(result.current.savings).toBe(1)
    let actions = store.getActions()
    expect(actions).toEqual([])
    store.clearActions()
  })
})
