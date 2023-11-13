import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useNetwork from '.'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { LAYER } from 'util/constant'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'

describe('useSwitchChain', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  let originalConsoleWarn
  let consoleOutput

  beforeAll(() => {
    originalConsoleWarn = console.warn
    console.warn = (message) => {
      if (consoleOutput === undefined) {
        consoleOutput = []
      }
      consoleOutput.push(message)
    }
  })

  test('If account is not enable should open walletSelectorModal', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: null,
      },
    }
    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useNetwork(), {
      wrapper,
    })

    result.current.switchChain()

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'walletSelectorModal',
    })
  })

  test('if account enabled && layer is L2 , should connect to L1', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: LAYER.L2,
      },
    }
    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useNetwork(), {
      wrapper,
    })

    result.current.switchChain()

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/CONNECT_ETH',
      payload: true,
    })
  })

  test('if account enabled && layer is L1 , should connect to L2', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: LAYER.L1,
      },
    }
    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useNetwork(), {
      wrapper,
    })

    result.current.switchChain()

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/CONNECT_BOBA',
      payload: true,
    })
  })

  test('if account enabled && bridgeType is Light should SetNetwork', async () => {
    const initialState = {
      ...mockedInitialState,
      bridge: {
        ...mockedInitialState.bridge,
        destChainIdTeleportation: 1,
        bridgeType: BRIDGE_TYPE.LIGHT,
      },
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: LAYER.L1,
      },
    }
    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useNetwork(), {
      wrapper,
    })

    result.current.switchChain()

    const actions = store.getActions()
    expect(actions).toContainEqual({
      payload: {
        chainIds: 1,
        name: 'Ethereum',
        network: 'ETHEREUM',
        networkIcon: 'ethereum',
        networkType: 'Mainnet',
      },
      type: 'NETWORK/SET',
    })
    expect(actions).toContainEqual({
      payload: '1',
      type: 'BRIDGE/TELEPORTER/DEST_CHAIN_ID',
    })
  })

  test('if account enabled && bridgeType is Light && unsuported network', async () => {
    const initialState = {
      ...mockedInitialState,
      bridge: {
        ...mockedInitialState.bridge,
        bridgeType: BRIDGE_TYPE.LIGHT,
      },
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: LAYER.L1,
      },
    }
    const consoleWarnSpy = jest.spyOn(console, 'warn')

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useNetwork(), {
      wrapper,
    })

    result.current.switchChain()
    expect(consoleOutput).toEqual(['Unknown destination chain id: '])
  })
})
