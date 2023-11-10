import { render } from '@testing-library/react'
import React from 'react'
import CustomThemeProvider from 'themes'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import BridgeTypeSelector from '../BridgeTypeSelector'

const mockStore = configureStore()

const renderBrdigeTypeSelector = ({ options = null }: any) => {
  return render(
    <Provider
      store={mockStore({
        ui: {
          theme: 'dark',
        },
        network: {
          networkType: 'Mainnet',
        },
        bridge: {
          bridgeType: 'LIGHT',
        },
        setup: {
          accountEnabled: false,
          netLayer: true,
          baseEnabled: false,
          walletAddress: '0x1e2855A0EA33d5f293E5Ba2018874FAB9a7F05B3',
        },
        ...options,
      })}
    >
      <CustomThemeProvider>
        <BridgeTypeSelector></BridgeTypeSelector>
      </CustomThemeProvider>
    </Provider>
  )
}

describe('Testing BridgeTypeSelector', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 7, 24))
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test('Test BridgeTypeSelector renders', () => {
    const { asFragment } = renderBrdigeTypeSelector({})
    expect(asFragment()).toMatchSnapshot()
  })
})
