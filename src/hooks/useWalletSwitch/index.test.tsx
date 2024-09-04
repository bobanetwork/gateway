import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import useWalletSwitch from '.'

describe('useWalletSwitch', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  describe('When accountEnabled is falsy', () => {
    test('Should set baseState, activenetwork, enableAccount when activeNetwork changes', async () => {
      const store = mockStore({
        ...mockedInitialState,
        network: {
          ...mockedInitialState.network,
          network: 'BNB',
          networkIcon: 'bnb',
          networkType: 'Mainnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()

      expect(actions).toEqual([
        { type: 'NETWORK/SET/ACTIVE' },
        { payload: false, type: 'SETUP/BASE/SET' },
        { payload: false, type: 'SETUP/ACCOUNT/SET' },
      ])
    })
    test('Should set baseState, activenetwork, enableAccount when activeNetworkType changes', async () => {
      const store = mockStore({
        ...mockedInitialState,
        network: {
          ...mockedInitialState.network,
          network: 'ETHEREUM',
          networkIcon: 'ethereum',
          networkType: 'Testnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()

      expect(actions).toEqual([
        { type: 'NETWORK/SET/ACTIVE' },
        { payload: false, type: 'SETUP/BASE/SET' },
        { payload: false, type: 'SETUP/ACCOUNT/SET' },
      ])
    })
    test('Should not update state when activeNetwork/activeNetworkType not changes', async () => {
      const store = mockStore({
        ...mockedInitialState,
        network: {
          ...mockedInitialState.network,
          network: 'ETHEREUM',
          networkIcon: 'ethereum',
          networkType: 'Mainnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
      renderHook(() => useWalletSwitch(), {
        wrapper,
      })
      const actions = store.getActions()
      expect(actions).toEqual([])
    })
  })
  describe('When accountEnabled is truthy', () => {
    test('Should open switchNetworkModal when activeNetwork changes', async () => {
      const store = mockStore({
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          accountEnabled: true,
        },
        network: {
          ...mockedInitialState.network,
          network: 'BNB',
          networkIcon: 'bnb',
          networkType: 'Mainnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()

      expect(actions).toEqual([
        {
          destNetworkSelection: undefined,
          fast: undefined,
          lock: undefined,
          payload: 'switchNetworkModal',
          proposalId: undefined,
          selectionLayer: undefined,
          token: undefined,
          tokenIndex: undefined,
          type: 'UI/MODAL/OPEN',
        },
      ])
    })
    test('Should open switchNetworkModal when activeNetworkType changes', async () => {
      const store = mockStore({
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          accountEnabled: true,
        },
        network: {
          ...mockedInitialState.network,
          network: 'ETHEREUM',
          networkIcon: 'ethereum',
          networkType: 'Testnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()

      expect(actions).toEqual([
        {
          destNetworkSelection: undefined,
          fast: undefined,
          lock: undefined,
          payload: 'switchNetworkModal',
          proposalId: undefined,
          selectionLayer: undefined,
          token: undefined,
          tokenIndex: undefined,
          type: 'UI/MODAL/OPEN',
        },
      ])
    })
    test('Should not update state when activeNetwork / activeNetworkType not changed', async () => {
      const store = mockStore({
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          accountEnabled: true,
        },
        network: {
          ...mockedInitialState.network,
          network: 'ETHEREUM',
          networkIcon: 'ethereum',
          networkType: 'Mainnet',
          name: {},
        },
      })
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
      renderHook(() => useWalletSwitch(), {
        wrapper,
      })
      const actions = store.getActions()
      expect(actions).toEqual([])
    })
  })

  describe('Should trigger connect when base enabled & reconnect', () => {
    test('should dispatch connectETH on layer L1', async () => {
      const setReconnectMock = jest.fn()
      const useStateMock = jest.spyOn(React, 'useState')
      useStateMock.mockImplementation(() => [true, setReconnectMock])

      const initialState = {
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          baseEnabled: true,
        },
      }

      const store = mockStore(initialState)
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()
      expect(actions).toEqual([
        { payload: true, type: 'SETUP/CONNECT_ETH' },
        { type: 'NETWORK/SET/ACTIVE' },
        { payload: false, type: 'SETUP/BASE/SET' },
        { payload: false, type: 'SETUP/ACCOUNT/SET' },
      ])
    })
    test('should dispatch connectBOBA on layer L2', async () => {
      const setReconnectMock = jest.fn()
      const useStateMock = jest.spyOn(React, 'useState')
      useStateMock.mockImplementation(() => [true, setReconnectMock])

      const initialState = {
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          netLayer: 'L2',
          baseEnabled: true,
        },
      }

      const store = mockStore(initialState)
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()
      expect(actions).toEqual([
        { payload: true, type: 'SETUP/CONNECT_BOBA' },
        { type: 'NETWORK/SET/ACTIVE' },
        { payload: false, type: 'SETUP/BASE/SET' },
        { payload: false, type: 'SETUP/ACCOUNT/SET' },
      ])
    })
    test('should dispatch connect on layer is not L1 or L2', async () => {
      const setReconnectMock = jest.fn()
      const useStateMock = jest.spyOn(React, 'useState')
      useStateMock.mockImplementation(() => [true, setReconnectMock])

      const initialState = {
        ...mockedInitialState,
        setup: {
          ...mockedInitialState.setup,
          netLayer: null,
          baseEnabled: true,
        },
      }

      const store = mockStore(initialState)
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )

      renderHook(() => useWalletSwitch(), {
        wrapper,
      })

      const actions = store.getActions()
      expect(actions).toEqual([
        { payload: true, type: 'SETUP/CONNECT' },
        { type: 'NETWORK/SET/ACTIVE' },
        { payload: false, type: 'SETUP/BASE/SET' },
        { payload: false, type: 'SETUP/ACCOUNT/SET' },
      ])
    })
  })
})
