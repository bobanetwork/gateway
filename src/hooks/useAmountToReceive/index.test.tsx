import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useAmountToReceive } from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { LAYER } from 'util/constant'

describe('useAmountToReceive', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

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

  test('Should calculate the amount to receive correctly for L1 Fast Bridge', async () => {
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
        bridgeType: BRIDGE_TYPE.FAST,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('0.980 ETH')
  })

  test('Should calculate the amount to receive correctly for L1 MultiBridge Bridge', async () => {
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
        bridgeType: BRIDGE_TYPE.MULTI_BRIDGE,
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

  test('Should calculate the amount to receive correctly for L2 Fast Bridge', async () => {
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
        bridgeType: BRIDGE_TYPE.FAST,
      },
    }
    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useAmountToReceive(), {
      wrapper,
    })

    expect(result.current.amount).toBe('0.990 ETH')
  })

  test('Should calculate the amount to receive correctly for L2 MultiBridge Bridge', async () => {
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
        bridgeType: BRIDGE_TYPE.MULTI_BRIDGE,
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
