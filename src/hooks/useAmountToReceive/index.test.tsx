import { renderHook } from '@testing-library/react-hooks'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { LAYER } from 'util/constant'
import { mockedInitialState } from 'util/tests'
import { useAmountToReceive } from './'

describe('useAmountToReceive', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  test('Should return undefined if token is not defined', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        l1FeeRateN: 1,
        l2FeeRateN: 2,
      },
      bridge: {
        ...mockedInitialState.bridge,
        tokens: null,
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })
    expect(result.current.amount).toBe('0 undefined')
  })

  test('Should calculate the amount to receive correctly for L1 Classic Bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        l1FeeRateN: 1,
        l2FeeRateN: 2,
      },
      bridge: {
        ...mockedInitialState.bridge,
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('1.0000 ETH')
  })

  test('Should calculate the amount to receive correctly for L1 Light Bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        l1FeeRateN: 1,
        l2FeeRateN: 2,
      },
      setup: {
        ...mockedInitialState,
        netLayer: LAYER.L1,
      },
      bridge: {
        ...mockedInitialState.bridge,
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.LIGHT,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('1 ETH')
  })

  test('Should calculate the amount to receive correctly for L2 Classic Bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        l1FeeRateN: 1,
        l2FeeRateN: 2,
      },
      setup: {
        ...mockedInitialState,
        netLayer: LAYER.L2,
      },
      bridge: {
        ...mockedInitialState.bridge,
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('1.0000 ETH')
  })

  test('Should calculate the amount to receive correctly for L2 LIGHT Bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        l1FeeRateN: 1,
        l2FeeRateN: 2,
      },
      setup: {
        ...mockedInitialState,
        netLayer: LAYER.L2,
      },
      bridge: {
        ...mockedInitialState.bridge,
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.LIGHT,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('1 ETH')
  })
})
