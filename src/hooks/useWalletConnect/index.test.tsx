import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useWalletConnect } from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import networkService from 'services/networkService'
import { LAYER } from 'util/constant'

jest.mock('services/networkService', () => ({
  ...jest.requireActual('services/networkService'),
  initializeAccount: jest.fn(),
  walletService: jest.fn(),
  switchChain: jest.fn(),
  addTokenList: jest.fn(),
}))

describe('useWalletConnect', () => {
  let useSelectorMock

  beforeEach(() => {
    useSelectorMock = jest.fn()
  })

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  test('Layer L1/L2 should triggerInit if accountEnable is false and baseEnabled is true', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: false,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce('nometamask')

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'noMetaMaskModal',
    })
  })

  test('Layer L1/L2 should triggerInit if accountEnable is true and baseEnabled is true but chain has been changed', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce('nometamask')

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'noMetaMaskModal',
    })
  })

  test('triggerInit should Open No Metamask Modal when intialized === nometamask', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce('nometamask')

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'noMetaMaskModal',
    })
  })

  test('triggerInit should Open Wrong Network Modal when intialized === wrongnetwork', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce('wrongnetwork')

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'wrongNetworkModal',
    })
  })

  test('triggerInit should Set account enabled False when intialized === false', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest.spyOn(networkService, 'initializeAccount').mockResolvedValueOnce(false)

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'SETUP/ACCOUNT/SET',
      payload: false,
    })
  })

  test('triggerInit should Close wrong network modal , setLayer , setEnabledAccout, setWalletAddress and addTooken when initialized === L1 or L2', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce(LAYER.L1)

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(6)
    const expectedActions = [
      { payload: 'wrongNetworkModal', type: 'UI/MODAL/CLOSE' },
      { payload: 'L1', type: 'SETUP/LAYER/SET' },
      { payload: true, type: 'SETUP/ACCOUNT/SET' },
      { payload: undefined, type: 'SETUP/WALLETADDRESS/SET' },
      { type: 'TOKENLIST/GET/REQUEST' },
    ]
    expect(actions).toEqual(expectedActions)
  })

  test('triggerInit should return false when intialized is not defined', async () => {
    useSelectorMock.mockReturnValueOnce(false)

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        userTriggeredChainSwitch: true,
        netLayer: LAYER.L1,
      },
    }

    jest
      .spyOn(networkService, 'initializeAccount')
      .mockResolvedValueOnce(undefined)

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(0)
  })

  test('connectBOBARequest should tigger doConnectToLayer(L2), reset chain Connection and open walletSelectorModal when provider is not defined', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        connectBOBA: true,
      },
    }

    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(3)
    const expectedActions = [
      { payload: false, type: 'SETUP/CONNECT' },
      { payload: false, type: 'SETUP/CONNECT_ETH' },
      { payload: 'walletSelectorModal', type: 'UI/MODAL/OPEN' },
    ]
    expect(actions).toEqual(expectedActions)
  })

  test('connectETHRequest should tigger doConnectToLayer(L1), reset chain Connection and open walletSelectorModal', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        baseEnabled: true,
        accountEnabled: true,
        connectETH: true,
      },
    }
    const store = mockStore(initialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )

    await act(async () => {
      renderHook(() => useWalletConnect(), {
        wrapper,
      })
    })

    const actions = store.getActions()
    expect(actions).toHaveLength(3)
    const expectedActions = [
      { payload: false, type: 'SETUP/CONNECT' },
      { payload: false, type: 'SETUP/CONNECT_ETH' },
      { payload: 'walletSelectorModal', type: 'UI/MODAL/OPEN' },
    ]
    expect(actions).toEqual(expectedActions)
  })
})
