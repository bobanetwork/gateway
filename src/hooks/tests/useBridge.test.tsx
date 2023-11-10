import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import useBridge from '../useBridge'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { mockedInitialState } from '../../util/tests'
import thunk from 'redux-thunk'

describe('useBridge hook test', () => {
  it('should fulfill the useBridge hook with the triggerSubmit function', async () => {
    const mockStore = configureMockStore([thunk])
    const store = mockStore({
      ...mockedInitialState,
      bridge: {
        destChainIdTeleportation: '420',
        tokens: [{ '': '' }],
      },
    })
    const expectedActions = ['UI/MODAL/OPEN', 'UI/MODAL/CLOSE']
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useBridge(), { wrapper })
    expect(result.current.triggerSubmit).toBeDefined()
    expect(typeof result.current.triggerSubmit).toBe('function')
    await act(async () => {
      await result.current.triggerSubmit()
    })
    const actions = store.getActions()
    expect(actions.length).toBeGreaterThanOrEqual(2)
    expect(actions[0].type).toEqual(expectedActions[0])
    expect(actions[1].type).toEqual(expectedActions[1])
  })
})
