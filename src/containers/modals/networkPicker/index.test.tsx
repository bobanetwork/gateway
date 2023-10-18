import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import NetworkPickerModal from './'
import { ModalInterface } from '../types'
import CustomThemeProvider from '../../../themes'
import { NETWORK, NETWORK_TYPE } from '../../../util/network/network.util'

import configureStore from 'redux-mock-store'

const mockStore = configureStore([])

const store = mockStore()

const renderNetworkPickerModal = (props: Partial<ModalInterface> = {}) => {
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
        <NetworkPickerModal open={open || false} {...rest} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('NetworkPickerModal', () => {
  it('Open NetworkPickerModal', () => {
    const { getByText } = renderNetworkPickerModal({
      open: true,
    })
    expect(getByText('Select Network')).toBeInTheDocument()
    expect(getByText('Network Names')).toBeInTheDocument()
  })
})
