import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import BridgeAction from '.'

const mockStore = configureStore([thunk])

const renderBridgeAction = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <BridgeAction />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('BridgeAction', () => {
  let store

  describe('AccountEnabled is true', () => {
    let alerts = [
      { text: 'alert1', type: 'info' },
      { text: 'alert2', type: 'info' },
    ]
    beforeEach(() => {
      store = mockStore({
        ...mockedInitialState,
        bridge: {
          ...mockedInitialState.bridge,
          alerts,
        },
        setup: {
          ...mockedInitialState.bridge,
          accountEnabled: true,
        },
      })
    })

    test('should match snapshot', () => {
      const { asFragment } = renderBridgeAction({
        store,
      })
      expect(asFragment()).toMatchSnapshot()
    })

    test('should trigger bridgeConfirmModal on click of bridge', () => {
      renderBridgeAction({ store })
      const bridgeBtn = screen.getByTestId('bridge-btn')
      fireEvent.click(bridgeBtn)
      const actions = store.getActions()
      expect(actions).toEqual([
        {
          destNetworkSelection: undefined,
          fast: undefined,
          lock: undefined,
          payload: 'bridgeConfirmModal',
          proposalId: undefined,
          selectionLayer: undefined,
          token: undefined,
          tokenIndex: undefined,
          type: 'UI/MODAL/OPEN',
        },
      ])
    })

    test('should not invoke bridgeConfirmModal on click of bridge when bridge action disabled', () => {
      alerts = [{ type: 'error', text: 'wrong' }]
      store = mockStore({
        ...mockedInitialState,
        bridge: {
          ...mockedInitialState.bridge,
          alerts,
        },
        setup: {
          ...mockedInitialState.bridge,
          accountEnabled: true,
        },
      })
      renderBridgeAction({ store })
      const bridgeBtn = screen.getByTestId('bridge-btn')
      fireEvent.click(bridgeBtn)
      const actions = store.getActions()
      expect(actions).toEqual([])
    })
  })

  describe('AccountEnabled is false', () => {
    beforeEach(() => {
      store = mockStore({
        ...mockedInitialState,
        bridge: {
          ...mockedInitialState.bridge,
        },
        setup: {
          ...mockedInitialState.bridge,
          accountEnabled: false,
        },
      })
    })

    test('should match snapshot', () => {
      const { asFragment } = renderBridgeAction({
        store,
      })
      expect(asFragment()).toMatchSnapshot()
    })

    test('should trigger connect action on click of connect wallet', () => {
      renderBridgeAction({ store })
      const connectBtn = screen.getByTestId('connect-btn')
      fireEvent.click(connectBtn)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'SETUP/CONNECT', payload: true }])
    })
  })
})
