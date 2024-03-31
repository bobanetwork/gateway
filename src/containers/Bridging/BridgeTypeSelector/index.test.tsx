import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Network, NetworkType } from 'util/network/network.util'
import CustomThemeProvider from 'themes'
import BridgeTypeSelector, { BRIDGE_TYPE } from '.'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'

const mockStore = configureStore([thunk])

const renderBridgeTypeSelector = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <BridgeTypeSelector />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('Bridge Type Selector', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      ...mockedInitialState,
    })
  })

  test('should match snapshot when connect to MAINNET and trigger class bridge as default', () => {
    const { asFragment } = renderBridgeTypeSelector({ store })
    expect(asFragment()).toMatchSnapshot()
    const actions = store.getActions()
    expect(actions).toEqual([
      { payload: 'CLASSIC', type: 'BRIDGE/TYPE/SELECT' },
    ])
  })

  test('should match snapshot when connect to TESTNET and update test correctly on click', () => {
    store = mockStore({
      ...mockedInitialState,
      network: {
        activeNetwork: Network.ETHEREUM,
        activeNetworkType: NetworkType.TESTNET,
      },
    })

    const { asFragment } = renderBridgeTypeSelector({ store })
    expect(asFragment()).toMatchSnapshot()
    const lightBtn = screen.getByTestId('light-btn')

    fireEvent.click(lightBtn)
    const actions = store.getActions()
    expect(actions).toEqual([
      {
        payload: 'CLASSIC',
        type: 'BRIDGE/TYPE/SELECT',
      },
      {
        payload: 'LIGHT',
        type: 'BRIDGE/TYPE/SELECT',
      },
    ])
  })

  test('should update state on click of each tab', () => {
    renderBridgeTypeSelector({ store })
    const classicBtn = screen.getByTestId('classic-btn')
    const lightBtn = screen.getByTestId('light-btn')
    const thirdPartyBtn = screen.getByTestId('third-party-btn')

    fireEvent.click(classicBtn)
    fireEvent.click(lightBtn)
    fireEvent.click(thirdPartyBtn)
    const actions = store.getActions()
    expect(actions).toEqual([
      {
        payload: 'CLASSIC',
        type: 'BRIDGE/TYPE/SELECT',
      },
      {
        payload: 'CLASSIC',
        type: 'BRIDGE/TYPE/SELECT',
      },
      {
        payload: 'LIGHT',
        type: 'BRIDGE/TYPE/SELECT',
      },
      {
        payload: 'THIRD_PARTY',
        type: 'BRIDGE/TYPE/SELECT',
      },
    ])
  })
})
