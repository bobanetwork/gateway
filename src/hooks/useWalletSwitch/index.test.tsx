import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useWalletSwitch from '.'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { LAYER } from 'util/constant'

describe('useWalletSwitch', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  test('As default accountEnabled should be null and we should set ActiveNetwork, baseState, and Enable account', async () => {
    const store = mockStore(mockedInitialState)
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

  test('When account is enabled and activeNetwork or activeNetworkType do not match, we open switch network modal', async () => {
    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.ui,
        accountEnabled: true,
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
    expect(actions).toContainEqual({
      type: 'UI/MODAL/OPEN',
      payload: 'switchNetworkModal',
    })
  })

  test('When base enabled & reconnect', async () => {
    const setReconnectMock = jest.fn()
    const useStateMock = jest.spyOn(React, 'useState')
    useStateMock.mockImplementation(() => [true, setReconnectMock])

    const initialState = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.ui,
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
