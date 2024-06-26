import { render, screen } from '@testing-library/react'
import React from 'react'
import GasWatcher from '.'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureStore from 'redux-mock-store'
import { Network, NetworkType } from 'util/network/network.util'
import useGasWatcher from 'hooks/useGasWatcher'

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
