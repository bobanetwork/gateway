import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import { NetworkSelector } from '.'
import { setNetwork } from 'actions/networkAction'
import { Network, NetworkType } from 'util/network/network.util'
import { Layer } from 'util/constant'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux')
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: () => mockDispatch,
  }
})

jest.mock('actions/networkAction', () => {
  const originalModule = jest.requireActual('actions/networkAction')
  return {
    __esModule: true,
    ...originalModule,
    setNetwork: jest.fn(),
  }
})

const mockStore = configureStore([thunk])

const renderNetworkSelector = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <NetworkSelector />
      </CustomThemeProvider>
    </Provider>
  )
}

// render the network selector
// ensure that it matches the snapshot
// ensure that when clicked it triggers the setNetwork
// switch to test night by changing the store, ensure that it matches the snapshot and has correct options available
// switch bridge to light, ensure that it matches the snapshot
// ensure that when clicked it triggers the set network

describe('NetworkSelector', () => {
  let store
  beforeEach(() => {
    store = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.bridge,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        ...mockedInitialState.bridge,
        bridgeToAddressState: true,
      },
    }
  })

  test('should match snapshot when account connected to Ethereum Mainnet', async () => {
    store = mockStore({
      ...store,
    })

    const { asFragment, getByText } = renderNetworkSelector({
      store,
    })
    expect(getByText('Ethereum')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
    const header = getByText('Ethereum')
    await fireEvent.click(header)
    const binanceOption = getByText('Binance Smart Chain')
    expect(binanceOption).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
    await fireEvent.click(binanceOption)
    expect(setNetwork).toHaveBeenCalledWith({
      network: Network.BNB,
      name: 'Bnb',
      networkIcon: 'bnb',
      chainIds: undefined,
      networkType: NetworkType.MAINNET,
    })
  })

  test('should match snapshot when account connected to Boba (Sepolia)', async () => {
    store = mockStore({
      ...store,
      bridge: {
        ...store.bridge,
        bridgeType: 'LIGHT',
      },
      network: {
        ...store.network,
        activeNetworkName: {
          l1: 'ethereum',
          l2: 'boba',
        },
        activeNetwork: 'ETHEREUM',
        activeNetworkType: 'Testnet',
        activeNetworkIcon: 'ethereum',
        chainIds: { L1: '11155111', L2: '11155420' },
      },
      setup: {
        netLayer: 'L2',
      },
    })

    const { asFragment, getByText } = renderNetworkSelector({
      store,
    })
    expect(getByText('Boba (Sepolia)')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
    const header = getByText('Boba (Sepolia)')
    await fireEvent.click(header)
    const binanceOption = getByText('Optimism (Sepolia)')
    expect(binanceOption).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
    await fireEvent.click(binanceOption)
    expect(setNetwork).toHaveBeenCalledWith({
      network: Network.OPTIMISM,
      name: 'Optimism Sepolia',
      networkIcon: 'optimism',
      chainIds: undefined,
      networkType: NetworkType.TESTNET,
    })
  })
})
