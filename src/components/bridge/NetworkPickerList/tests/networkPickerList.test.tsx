import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import CustomThemeProvider from 'themes'
import { NetworkList } from '../index'

const mockStore = configureStore()

const renderNetworkList = ({ options = null }: any) => {
  return render(
    <Provider
      store={mockStore({
        ui: {
          theme: 'dark',
        },
        network: {
          activeNetworkType: 'Testnet',
        },
        networkType: 'Testnet',
        layer: 'L2',
        bridge: {
          bridgeType: 'Light',
        },
        setup: {
          accountEnabled: false,
          netLayer: 'L2',
          baseEnabled: false,
          walletAddress: '0x1e2855A0EA33d5f293E5Ba2018874FAB9a7F05B3',
        },
        ...options,
      })}
    >
      <CustomThemeProvider>
        <NetworkList close={() => null} isIndependentDestNetwork={true} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('NetworkList Component', () => {
  it('renders NetworkList correctly', () => {
    const { asFragment } = renderNetworkList({})
    expect(asFragment).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
})
