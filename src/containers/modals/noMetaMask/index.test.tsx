import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import NoMetaMaskModal from './NoMetaMaskModal'
import { ModalInterface } from '../types'
import CustomThemeProvider from '../../../themes'
import { NETWORK, NETWORK_TYPE } from '../../../util/network/network.util'

import configureStore from 'redux-mock-store'

const mockStore = configureStore([])

const store = mockStore()

const renderNoMetamaskModal = (props: Partial<ModalInterface> = {}) => {
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
        <NoMetaMaskModal open={open || false} {...rest} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('NoMetamaskModal', () => {
  it('Open NoMetamaskModal', () => {
    const { getByText } = renderNoMetamaskModal({
      open: true,
    })
    expect(getByText('Add MetaMask to Chrome')).toBeInTheDocument()
  })
})
