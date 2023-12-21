import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useDisconnect from '.'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { setChainIdChanged } from 'actions/setupAction'

describe('useDisconnect', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore(mockedInitialState)
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  test('Should Disconnect', async () => {
    const { result } = renderHook(() => useDisconnect(), {
      wrapper,
    })
    await act(async () => {
      await result.current.disconnect()
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/DISCONNECT',
    })
  })

  test('Should switch chain and Disconnect', async () => {
    const { result } = renderHook(() => useDisconnect(), {
      wrapper,
    })

    store.dispatch(setChainIdChanged(2) as any)

    await act(async () => {
      await result.current.disconnect()
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/CHAINIDCHANGED/SET',
      payload: 2,
    })

    expect(actions).toContainEqual({
      type: 'SETUP/DISCONNECT',
    })
  })
})
