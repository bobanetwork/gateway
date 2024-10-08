import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import networkService from 'services/networkService'
import { mockedInitialState } from 'util/tests'
import { useOnboard } from '.'

describe('useOnboard', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore(mockedInitialState)

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )
  global.scrollTo = jest.fn()

  test('Should useOnboard & initialized enabled', async () => {
    const mockInitializeBase = jest.spyOn(networkService, 'initializeBase')
    mockInitializeBase.mockImplementation(async () => {
      return 'enabled'
    })

    renderHook(() => useOnboard(), {
      wrapper,
    })

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

    const initialized = await networkService.initializeBase({
      networkGateway: mockedInitialState.network.activeNetwork,
      networkType: mockedInitialState.network.activeNetworkType,
    })

    expect(initialized).toBe('enabled')

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/BASE/SET',
      payload: true,
    })

    mockInitializeBase.mockRestore()
  })

  test('Should useOnboard & initialized false', async () => {
    const mockInitializeBase = jest.spyOn(networkService, 'initializeBase')
    mockInitializeBase.mockImplementation(
      async ({ networkGateway, networkType }) => {
        if (networkGateway === 'null' && networkType === 'null') {
          return false
        }
      }
    )

    renderHook(() => useOnboard(), {
      wrapper,
    })

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

    // Simulate networkService.initializeBase with specific arguments
    const initialized = await networkService.initializeBase({
      networkGateway: 'null',
      networkType: 'null',
    })

    expect(initialized).toBe(false)

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'SETUP/BASE/SET',
      payload: false,
    })

    mockInitializeBase.mockRestore()
  })
})
