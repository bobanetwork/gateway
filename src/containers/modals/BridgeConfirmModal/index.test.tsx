import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import BridgeConfirmModal from './'
import { ModalInterface } from '../types'
import CustomThemeProvider from '../../../themes'
import { NETWORK, NETWORK_TYPE } from '../../../util/network/network.util'

import configureStore from 'redux-mock-store'

const mockStore = configureStore([])

const store = mockStore()

const renderBridgeConfirmModal = (props: Partial<ModalInterface> = {}) => {
  const { open, ...rest } = props
  return render(
    <Provider
      store={mockStore({
        ui: {
          theme: 'dark',
        },
        setup: {
          netLayer: 'L1',
        },
        bridge: {
          bridgeType: 'CLASSIC',
          tokens: [],
        },
        network: {
          activeNetwork: NETWORK.ETHEREUM,
          activeNetworkType: NETWORK_TYPE.MAINNET,
        },
      })}
    >
      <CustomThemeProvider>
        <BridgeConfirmModal open={open || false} {...rest} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('BridgeConfirmModal', () => {
  it('Open BridgeConfirmModal', () => {
    const { getByText } = renderBridgeConfirmModal({
      open: true,
    })
    expect(getByText('Amount to bridge')).toBeInTheDocument()
  })
})
