import React from 'react'
import { render, screen } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Network, NetworkType } from 'util/network/network.util'
import CustomThemeProvider from 'themes'
import ThirdPartyBridges from '.'
import { mockedInitialState } from 'util/tests'
import useThirdPartyBridges from 'hooks/useThirdPartyBridges'

jest.mock('hooks/useThirdPartyBridges')

const mockUseThirdPartyBridges = useThirdPartyBridges as jest.MockedFunction<
  typeof useThirdPartyBridges
>

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
  beforeEach(() => {
    mockUseThirdPartyBridges.mockReturnValue({
      bridges: null,
      loading: false,
      error: null,
    })
  })

  test('should match snapshot when network is ETH Mainnet', () => {
    mockUseThirdPartyBridges.mockReturnValue({
      bridges: [
        {
          name: 'Banxa',
          icon: 'https://raw.githubusercontent.com/bobanetwork/gateway-data/main/bridges/icons/banxa.svg',
          link: 'https://boba.banxa.com/',
        },
      ],
      loading: false,
      error: null,
    })
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

  test('should render bridge list correctly', () => {
    mockUseThirdPartyBridges.mockReturnValue({
      bridges: [
        {
          name: 'Banxa',
          icon: 'https://raw.githubusercontent.com/bobanetwork/gateway-data/main/bridges/icons/banxa.svg',
          link: 'https://boba.banxa.com/',
        },
      ],
      loading: false,
      error: null,
    })
    renderThirdPartyBridges({})
    expect(screen.getAllByTestId('bridge-item').length).toBe(1)
    expect(screen.getByText('Banxa')).toBeInTheDocument()
  })
})
