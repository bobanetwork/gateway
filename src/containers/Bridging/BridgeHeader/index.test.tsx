import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { NETWORK, NETWORK_TYPE } from 'util/network/network.util'
import CustomThemeProvider from 'themes'
import BridgeHeader from '.'
import thunk from 'redux-thunk'

const mockStore = configureStore([thunk])

const renderBridgeHeader = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <BridgeHeader />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('BridgeHeader', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      ui: {
        theme: 'dark',
      },
      network: {
        activeNetwork: NETWORK.ETHEREUM,
        activeNetworkType: NETWORK_TYPE.MAINNET,
      },
    })
  })

  test('should match snapshot when connected to Mainnet', () => {
    const { asFragment } = renderBridgeHeader({ store })
    expect(asFragment()).toMatchSnapshot()
  })

  test('should open setting modal on click of gear icon', () => {
    renderBridgeHeader({ store })
    const settingIcon = screen.getByTestId('setting-btn')
    fireEvent.click(settingIcon)
    const actions = store.getActions()
    expect(actions).toEqual([
      {
        destNetworkSelection: undefined,
        fast: undefined,
        lock: undefined,
        payload: 'settingsModal',
        proposalId: undefined,
        selectionLayer: undefined,
        token: undefined,
        tokenIndex: undefined,
        type: 'UI/MODAL/OPEN',
      },
    ])
  })

  test('should open tooltip with correct info', async () => {
    renderBridgeHeader({ store })
    const tooltipBtn = screen.getByTestId('tooltip-btn')
    fireEvent.mouseEnter(tooltipBtn)
    expect(await screen.findByText('Classic Bridge')).toBeInTheDocument()
    expect(await screen.findByText('Fast Bridge')).toBeInTheDocument()
  })

  test('should match snapshot when connected to TESTNET', async () => {
    store = mockStore({
      ui: {
        theme: 'light',
      },
      network: {
        activeNetwork: NETWORK.ETHEREUM,
        activeNetworkType: NETWORK_TYPE.TESTNET,
      },
    })
    const { asFragment } = renderBridgeHeader({ store })
    expect(asFragment()).toMatchSnapshot()

    const tooltipBtn = screen.getByTestId('tooltip-btn')
    fireEvent.mouseEnter(tooltipBtn)
    expect(await screen.findByText('Classic Bridge')).toBeInTheDocument()
    expect(await screen.findByText('Fast Bridge')).toBeInTheDocument()
    expect(await screen.findByText('Light Bridge')).toBeInTheDocument()
  })
})
