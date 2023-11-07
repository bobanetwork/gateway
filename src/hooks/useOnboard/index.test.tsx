import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useOnboard } from '.'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import networkService from 'services/networkService'
import { AnyAction } from 'redux'

describe('useOnboard', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore(mockedInitialState)

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )
  global.scrollTo = jest.fn()
  networkService.initializeBase = jest.fn()

  test('Should useOnboard & initialized base ', async () => {
    renderHook(() => useOnboard(), {
      wrapper,
    })

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

    const initialized = await networkService.initializeBase({
      networkGateway: mockedInitialState.network.activeNetwork,
      networkType: mockedInitialState.network.activeNetworkType,
    })

    expect(networkService.initializeBase).toHaveBeenCalledWith({
      networkGateway: mockedInitialState.network.activeNetwork,
      networkType: mockedInitialState.network.activeNetworkType,
    })

    if (!initialized) {
      const actions: AnyAction[] = store.getActions()
      expect(actions).toContainEqual({
        type: 'SETUP/BASE/SET',
        payload: false,
      })
    }
    if (initialized === 'enabled') {
      const actions: AnyAction[] = store.getActions()
      expect(actions).toContainEqual({
        type: 'SETUP/BASE/SET',
        payload: true,
      })
    }
  })
})
