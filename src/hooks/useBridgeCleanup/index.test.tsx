import React from 'react'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { renderHook, act } from '@testing-library/react-hooks'
import configureMockStore from 'redux-mock-store'
import useBridgeCleanup from './'

import { mockedInitialState } from 'util/tests'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore(mockedInitialState)
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>
describe('useBridgeCleanup', () => {
  it('should reset token, purge alert, and reset bridge amount', () => {
    const { result } = renderHook(() => useBridgeCleanup(), {
      wrapper,
    })

    expect(store.getActions()).toEqual([
      { type: 'BRIDGE/TOKEN/RESET' }, // resetToken()
      { type: 'BRIDGE/ALERT/PURGE' }, // purgeBridgeAlert()
      { type: 'BRIDGE/AMOUNT/RESET' }, // resetBridgeAmount()
    ])
  })
})
