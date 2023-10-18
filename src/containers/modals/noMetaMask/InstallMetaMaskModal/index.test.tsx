import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import InstallMetaMaskModal from './InstallMetaMaskModal'
import { ModalInterface } from '../../types'
import CustomThemeProvider from '../../../../themes'
import { NETWORK, NETWORK_TYPE } from '../../../../util/network/network.util'

import configureStore from 'redux-mock-store'

const mockStore = configureStore([])

const store = mockStore()

const renderInstallMetaMaskModal = (props: Partial<ModalInterface> = {}) => {
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
        network: {
          activeNetwork: NETWORK.ETHEREUM,
          activeNetworkType: NETWORK_TYPE.MAINNET,
        },
      })}
    >
      <CustomThemeProvider>
        <InstallMetaMaskModal open={open || false} {...rest} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('InstallMetaMaskModal', () => {
  it('Open InstallMetaMaskModal', () => {
    const { getByText } = renderInstallMetaMaskModal({
      open: true,
    })
    expect(getByText('Install the MetaMask extension')).toBeInTheDocument()
  })
})
