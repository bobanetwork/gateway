import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { renderHook } from '@testing-library/react-hooks'
import thunk from 'redux-thunk'
import { useBridgeCleanUp } from './'
import { mockedInitialState } from 'util/tests'
import { AnyAction } from 'redux'

describe('useBridgeCleanUp', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  test('Should cleanUp bridge', async () => {
    const store = mockStore(mockedInitialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    renderHook(() => useBridgeCleanUp(), {
      wrapper,
    })

    const actions: AnyAction[] = store.getActions()
    expect(actions).toContainEqual({
      type: 'BRIDGE/TOKEN/RESET',
    })
    expect(actions).toContainEqual({
      type: 'BRIDGE/ALERT/PURGE',
    })
    expect(actions).toContainEqual({
      type: 'BRIDGE/AMOUNT/RESET',
    })
  })
})
