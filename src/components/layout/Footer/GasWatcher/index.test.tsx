import { render } from '@testing-library/react'
import useGasWatcher from 'hooks/useGasWatcher'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import CustomThemeProvider from 'themes'
import { Network, NetworkType } from 'util/network/network.util'
import GasWatcher from '.'

const mockStore = configureStore()

jest.mock('hooks/useGasWatcher')

const mockUseGasWatcher = useGasWatcher as jest.MockedFunction<
  typeof useGasWatcher
>

const renderGasWatcher = ({ options = {} }: any) => {
  return render(
    <MemoryRouter>
      <Provider
        store={mockStore({
          ui: {
            theme: 'dark',
          },
          network: {
            activeNetwork: Network.ETHEREUM,
            activeNetworkType: NetworkType.MAINNET,
            activeNetworkName: {
              l1: 'Ethereum',
              l2: 'Boba ETH',
            },
          },
          ...options,
        })}
      >
        <CustomThemeProvider>
          <GasWatcher />
        </CustomThemeProvider>
      </Provider>
    </MemoryRouter>
  )
}

describe('Footer GasWatcher', () => {
  test('should match snapshot when gas value empty', () => {
    mockUseGasWatcher.mockReturnValue({
      gas: null,
      savings: 1,
    })
    const { asFragment } = renderGasWatcher({})
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot when gas has value', () => {
    mockUseGasWatcher.mockReturnValue({
      gas: {
        gasL1: 10,
        gasL2: 20,
        blockL1: 110000,
        blockL2: 220000,
      },
      savings: 1,
    })
    const { asFragment } = renderGasWatcher({})
    expect(asFragment()).toMatchSnapshot()
  })
})
