import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useBridgeAlerts from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'

describe('useBridgeAlerts', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  test('If bridgeType Light and token is not supported for transportation should CLEAR and PURGE alerts', async () => {
    const initialState = {
      ...mockedInitialState,
      bridge: {
        bridgeType: BRIDGE_TYPE.LIGHT,
        isTeleportationOfAssetSupported: {
          supported: false,
          minDepositAmount: 0,
          maxDepositAmount: 0,
          maxTransferAmountPerDay: 0,
          transferredAmount: 0,
        },
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'BRIDGE/ALERT/CLEAR',
      payload: { keys: ['OMG_INFO'] },
    })
    expect(actions).toContainEqual({
      type: 'BRIDGE/ALERT/PURGE',
    })
  })

  test('If bridgeType Light and token is supported for transportation & TELEPORTATION_NO_UNCONVENTIONAL_WALLETS', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.LIGHT,
        isTeleportationOfAssetSupported: {
          supported: true,
          minDepositAmount: 0,
          maxDepositAmount: 0,
          maxTransferAmountPerDay: 0,
          transferredAmount: 0,
        },
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      payload: { keys: ['TELEPORTER_ASSET_NOT_SUPPORTED'] },
      type: 'BRIDGE/ALERT/CLEAR',
    })
    expect(actions).toContainEqual({
      payload: {
        meta: 'TELEPORTATION_NO_UNCONVENTIONAL_WALLETS',
        text: "This bridge doesn't support smart-contract wallets that use a costly fallback method.",
        type: 'info',
      },
      type: 'BRIDGE/ALERT/SET',
    })
    expect(actions).toContainEqual({
      payload: { keys: ['OMG_INFO'] },
      type: 'BRIDGE/ALERT/CLEAR',
    })
    expect(actions).toContainEqual({
      type: 'BRIDGE/ALERT/PURGE',
    })
  })

  test('If bridgeType Light and amountToBridge > maxDepositAmount (Value too High)', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.LIGHT,
        amountToBridge: 2,
        isTeleportationOfAssetSupported: {
          supported: true,
          minDepositAmount: 0,
          maxDepositAmount: 1,
          maxTransferAmountPerDay: 0,
          transferredAmount: 0,
        },
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()

    expect(actions).toContainEqual({
      payload: {
        meta: 'VALUE_TOO_LARGE',
        text: 'For this asset you are allowed to bridge at maximum 0.000000000000000001 per transaction.',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('If bridgeType Light and amountToBridge < minDepositAmount (Value too Low)', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.LIGHT,
        amountToBridge: 0.5,
        isTeleportationOfAssetSupported: {
          supported: true,
          minDepositAmount: 1,
          maxDepositAmount: 0,
          maxTransferAmountPerDay: 0,
          transferredAmount: 0,
        },
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()

    expect(actions).toContainEqual({
      payload: {
        meta: 'VALUE_TOO_SMALL',
        text: 'For this asset you need to bridge at least 0.000000000000000001.',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L1 and Token and Token Symbol is not OMG should clear omg_info', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()

    expect(actions).toContainEqual({
      payload: {
        keys: ['OMG_INFO'],
      },
      type: 'BRIDGE/ALERT/CLEAR',
    })
  })

  test('L1 and Token and Token Symbol is OMG should clear omg_info', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
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
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()

    expect(actions).toContainEqual({
      payload: {
        meta: 'OMG_INFO',
        text: `The OMG Token was minted in 2017 and it does not conform to the ERC20 token standard.
        In some cases, three interactions with MetaMask are needed. If you are bridging out of a
        new wallet, it starts out with a 0 approval, and therefore, only two interactions with
        MetaMask will be needed.`,
        type: 'info',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('if Token is not defined return null', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        tokens: null,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    expect(result.current).toBeUndefined()
  })

  test('L1 and Token and Token Symbol is OMG should clear omg_info', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
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
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridgeAlerts(), {
      wrapper,
    })

    const actions = store.getActions()

    expect(actions).toContainEqual({
      payload: {
        meta: 'OMG_INFO',
        text: `The OMG Token was minted in 2017 and it does not conform to the ERC20 token standard.
        In some cases, three interactions with MetaMask are needed. If you are bridging out of a
        new wallet, it starts out with a 0 approval, and therefore, only two interactions with
        MetaMask will be needed.`,
        type: 'info',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })
})
