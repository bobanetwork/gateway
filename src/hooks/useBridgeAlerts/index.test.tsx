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
      payload: {
        keys: [
          'TELEPORTER_ASSET_NOT_SUPPORTED',
          'VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT',
          'VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT',
          'MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED',
        ],
      },
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

    expect(actions).toContainEqual([
      {
        payload: {
          keys: [
            'TELEPORTER_ASSET_NOT_SUPPORTED',
            'VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT',
            'VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT',
            'MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED',
          ],
        },
        type: 'BRIDGE/ALERT/CLEAR',
      },
      {
        payload: {
          meta: 'TELEPORTATION_NO_UNCONVENTIONAL_WALLETS',
          text: "This bridge doesn't support smart-contract wallets that use a costly fallback method.",
          type: 'info',
        },
        type: 'BRIDGE/ALERT/SET',
      },
      { payload: { keys: ['OMG_INFO'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: undefined, type: 'BRIDGE/ALERT/PURGE' },
    ])
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

    expect(actions).toContainEqual([
      {
        payload: {
          keys: [
            'TELEPORTER_ASSET_NOT_SUPPORTED',
            'VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT',
            'VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT',
            'MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED',
          ],
        },
        type: 'BRIDGE/ALERT/CLEAR',
      },
      {
        payload: {
          meta: 'TELEPORTATION_NO_UNCONVENTIONAL_WALLETS',
          text: "This bridge doesn't support smart-contract wallets that use a costly fallback method.",
          type: 'info',
        },
        type: 'BRIDGE/ALERT/SET',
      },
      { payload: { keys: ['OMG_INFO'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: undefined, type: 'BRIDGE/ALERT/PURGE' },
    ])
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

  test('L1 and Token and Token Symbol is OMG should set OMG_INFO', async () => {
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

  test('L1 and Token and Token Symbol is not OMG should clear OMG_INFO', async () => {
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
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '56d0cb871570',
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
      type: 'BRIDGE/ALERT/CLEAR',
      payload: { keys: ['OMG_INFO'] },
    })
  })

  test('L1 and Token and Token Symbol is not OMG and overMax bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        amountToBridge: 1,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: 0,
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

    expect(actions).toContainEqual([
      { payload: { keys: ['OMG_INFO'] }, type: 'BRIDGE/ALERT/CLEAR' },
      {
        payload: {
          keys: ['VALUE_BALANCE_TOO_LARGE', 'VALUE_BALANCE_TOO_SMALL'],
        },
        type: 'BRIDGE/ALERT/CLEAR',
      },
      {
        payload: {
          meta: 'VALUE_BALANCE_TOO_LARGE',
          text: 'Value too large: the value must be smaller than 0.00000',
          type: 'error',
        },
        type: 'BRIDGE/ALERT/SET',
      },
      { payload: { keys: ['FAST_EXIT_ERROR'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: { keys: ['FAST_DEPOSIT_ERROR'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: undefined, type: 'BRIDGE/ALERT/PURGE' },
    ])
  })

  test('L1 and Token and Token Symbol is not OMG and tooLow bridge', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        amountToBridge: -1.0,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '0.0',
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

    expect(actions).toContainEqual([
      { payload: { keys: ['OMG_INFO'] }, type: 'BRIDGE/ALERT/CLEAR' },
      {
        payload: {
          keys: ['VALUE_BALANCE_TOO_LARGE', 'VALUE_BALANCE_TOO_SMALL'],
        },
        type: 'BRIDGE/ALERT/CLEAR',
      },
      {
        payload: {
          meta: 'VALUE_BALANCE_TOO_SMALL',
          text: 'Value too small: the value must be greater than 0',
          type: 'error',
        },
        type: 'BRIDGE/ALERT/SET',
      },
      { payload: { keys: ['FAST_EXIT_ERROR'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: { keys: ['FAST_DEPOSIT_ERROR'] }, type: 'BRIDGE/ALERT/CLEAR' },
      { payload: undefined, type: 'BRIDGE/ALERT/PURGE' },
    ])
  })

  test('L2 and BridgeType is not Light & exitFee is bigger than Boba Balance should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
      },
      balance: {
        ...mockedInitialState.balance,
        exitFee: 0.1,
        l2BalanceBOBA: 0.01,
      },
      bridge: {
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '0.0',
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
        meta: 'FAST_EXIT_ERROR',
        text: 'Insufficient BOBA balance to cover xChain message relay. You need at least 0.1 BOBA',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L2 and BridgeType is not Light & ethCost is bigger than free Balance & is not using feeUseBoba should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: false,
      },
      balance: {
        ...mockedInitialState.balance,
        fastExitCost: 0.1,
        l2BalanceETH: 0.1,
        l2BalanceBOBA: 0.1,
      },
      bridge: {
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '0.0',
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
        meta: 'FAST_EXIT_ERROR',
        text: 'ETH balance too low to cover gas',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L2 and BridgeType is not Light & ethCost is bigger than free Balance & is using feeUseBoba should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: true,
      },
      balance: {
        ...mockedInitialState.balance,
        fastExitCost: 0.1,
        l2BalanceETH: 0.1,
        l2BalanceBOBA: 0.1,
      },
      bridge: {
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '0.0',
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
        meta: 'FAST_EXIT_ERROR',
        text: 'ETH balance too low. Even if you pay in BOBA, you still need to maintain a minimum ETH balance in your wallet',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L2 and BridgeType is not Light & ethCost is bigger than free Balance & is using feeUseBoba and token is BOBA should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: true,
        bobaFeePriceRatio: 0.1,
      },
      balance: {
        ...mockedInitialState.balance,
        exitFee: 0.5,
        fastExitCost: 1,
        l2BalanceETH: 2,
        l2BalanceBOBA: 1,
      },
      bridge: {
        amountToBridge: 1,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '00',
            layer: 'L1',
            address: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            symbol: 'BOBA',
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
        meta: 'FAST_EXIT_ERROR',
        text: 'Insufficient BOBA balance to conver Boba Amount, Exit Fee and Relay fee.',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L2 and BridgeType is not Light & ethCost is bigger than free Balance & is not using feeUseBoba and token is ETH and freeBlanace is bigger than total value should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: false,
      },
      balance: {
        ...mockedInitialState.balance,
        fastExitCost: 0.1,
        l2BalanceETH: 5,
        l2BalanceBOBA: 0.1,
      },
      bridge: {
        amountToBridge: 2,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: 1e18,
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
        meta: 'FAST_EXIT_ERROR',
        text: 'Insufficient ETH balance to cover ETH Amount and Exit fee.',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('L2 and BridgeType is not Light & ethCost is bigger than free Balance & is using feeUseBoba and token is ETH and freeBlanace is bigger than total value should error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: true,
      },
      balance: {
        ...mockedInitialState.balance,
        exitFee: 0.2,
        fastExitCost: 1,
        l2BalanceETH: 1,
        l2BalanceBOBA: 2,
      },
      bridge: {
        amountToBridge: 2,
        bridgeType: BRIDGE_TYPE.CLASSIC,
        tokens: [
          {
            address: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: 1e18,
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
        meta: 'FAST_EXIT_ERROR',
        text: 'ETH balance too low. Even if you pay in BOBA, you still need to maintain a minimum ETH balance in your wallet',
        type: 'error',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })

  test('If active network is not ethereum and bridgeType is Third Party show error', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
        netLayer: 'L2',
        bobaFeeChoice: true,
      },
      network: {
        ...mockedInitialState.network,
        activeNetwork: 'BNB',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.THIRD_PARTY,
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
        meta: 'THIRD_PARTY_BRIDGE_ALERT',
        text: 'There are no third party bridges available for BNB at the moment. To view third party bridges for other networks, select another network in the Classic Tab.',
        type: 'info',
      },
      type: 'BRIDGE/ALERT/SET',
    })
  })
})
