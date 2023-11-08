import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useOnboard } from '.'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import { AnyAction } from 'redux'
import networkService from 'services/networkService'

describe('useOnboard', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let store: any

  beforeEach(() => {
    store = mockStore(mockedInitialState)
  })

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )
  global.scrollTo = jest.fn()

  test('Should useOnboard & initialized enabled', async () => {
    renderHook(() => useOnboard(), {
      wrapper,
    })

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

    await act(async () => {
      const initialized = await networkService.initializeBase({
        networkGateway: mockedInitialState.network.activeNetwork,
        networkType: mockedInitialState.network.activeNetworkType,
      })

      expect(initialized).toBe('enabled')
    })

    const actions: AnyAction[] = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/BASE/SET',
      payload: true,
    })
  })

  test('Should useOnboard & initialized false', async () => {
    renderHook(() => useOnboard(), {
      wrapper,
    })

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

    await act(async () => {
      const initialized = await networkService.initializeBase({
        networkGateway: null,
        networkType: null,
      })

      expect(initialized).toBe(false)
    })

    const actions: AnyAction[] = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/BASE/SET',
      payload: false,
    })
  })
})
