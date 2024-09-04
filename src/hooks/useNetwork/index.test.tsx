import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import useNetwork from '.'

describe('useNetwork', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore(mockedInitialState)
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  test('Should Set Network', async () => {
    renderHook(() => useNetwork(), {
      wrapper,
    })

    const expectedAction = {
      type: 'NETWORK/SET',
      payload: {
        chainIds: { L1: '1', L2: '288' },
        name: { l1: 'Ethereum', l2: 'Boba ETH' },
        network: 'ETHEREUM',
        networkIcon: 'ethereum',
      },
    }

    const actions = store.getActions()
    expect(actions).toEqual([expectedAction])
  })
})
