import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { NETWORK, NETWORK_TYPE } from 'util/network/network.util'
import CustomThemeProvider from 'themes'
import BridgeTypeSelector from '.'
import thunk from 'redux-thunk'
import { BRIDGE_TYPE } from 'util/constant'

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
      ui: {
        theme: 'dark',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.CLASSIC_BRIDGE,
      },
      network: {
        activeNetwork: NETWORK.ETHEREUM,
        activeNetworkType: NETWORK_TYPE.MAINNET,
      },
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
      ui: {
        theme: 'dark',
      },
      bridge: {
        bridgeType: BRIDGE_TYPE.CLASSIC_BRIDGE,
      },
      network: {
        activeNetwork: NETWORK.ETHEREUM,
        activeNetworkType: NETWORK_TYPE.TESTNET,
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
    const fastBtn = screen.getByTestId('fast-btn')
    const thirdPartyBtn = screen.getByTestId('third-party-btn')

    fireEvent.click(classicBtn)
    fireEvent.click(fastBtn)
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
        payload: 'FAST',
        type: 'BRIDGE/TYPE/SELECT',
      },
      {
        payload: 'THIRD_PARTY',
        type: 'BRIDGE/TYPE/SELECT',
      },
    ])
  })
})
