import React from 'react'
import { render, screen } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Network, NetworkType } from 'util/network/network.util'
import CustomThemeProvider from 'themes'
import ThirdPartyBridges from '.'
import { mockedInitialState } from 'util/tests'

const mockStore = configureStore()

const renderThirdPartyBridges = ({ options = {} }: any) => {
  return render(
    <Provider
      store={mockStore({
        ...mockedInitialState,
        ...options,
      })}
    >
      <CustomThemeProvider>
        <ThirdPartyBridges />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('3rd Party Bridges', () => {
  test('should match snapshot when network is ETH Mainnet', () => {
    const { asFragment } = renderThirdPartyBridges({})
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot when network is BNB Mainnet', () => {
    const { asFragment } = renderThirdPartyBridges({
      options: {
        network: {
          activeNetwork: Network.BNB,
          activeNetworkType: NetworkType.MAINNET,
        },
      },
    })
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot when network is TESTNET', () => {
    const { asFragment } = renderThirdPartyBridges({
      options: {
        network: {
          activeNetwork: Network.ETHEREUM,
          activeNetworkType: NetworkType.TESTNET,
        },
      },
    })
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render icons correctly for light mode', () => {
    const { asFragment } = renderThirdPartyBridges({
      options: {
        ui: {
          theme: 'light',
        },
      },
    })
    expect(asFragment()).toMatchSnapshot()

    expect(screen.getAllByAltText('light-logo', { exact: false }).length).toBe(
      3
    )
  })

  test('should render bridge list correctly', () => {
    renderThirdPartyBridges({})
    expect(screen.getAllByTestId('bridge-item').length).toBe(8)
    expect(screen.getByText('Banxa')).toBeInTheDocument()
    expect(screen.getByText('BoringDAO')).toBeInTheDocument()
    expect(screen.getByText('Celer')).toBeInTheDocument()
    expect(screen.getByText('Chainswap')).toBeInTheDocument()
    expect(screen.getByText('Rango Exchange')).toBeInTheDocument()
    expect(screen.getByText('Rubic Exchange')).toBeInTheDocument()
    expect(screen.getByText('Synapse')).toBeInTheDocument()
    expect(screen.getByText('Via Protocol')).toBeInTheDocument()
  })
})
