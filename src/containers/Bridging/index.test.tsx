import { render } from '@testing-library/react'
import useBridgeAlerts from 'hooks/useBridgeAlerts'
import useBridgeCleanup from 'hooks/useBridgeCleanup'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { NETWORK, NETWORK_TYPE } from 'util/network/network.util'
import Bridging from '.'
import { BRIDGE_TYPE } from './BridgeTypeSelector'
import { mockedInitialState } from 'util/tests'

const mockStore = configureStore([thunk])

jest.mock('hooks/useBridgeAlerts')
jest.mock('hooks/useBridgeCleanup')

const mockUseBridgeAlerts = useBridgeAlerts as jest.MockedFunction<
  typeof useBridgeAlerts
>
const mockUseBridgeCleanup = useBridgeCleanup as jest.MockedFunction<
  typeof useBridgeCleanup
>

const renderBridging = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <Bridging />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('Bridging Component', () => {
  let store: any

  beforeEach(() => {
    store = mockStore(mockedInitialState)
  })

  test('should match snapshot on when bridge type is CLASSIC', () => {
    const { asFragment } = renderBridging({ store })
    expect(asFragment()).toMatchSnapshot()
    expect(mockUseBridgeAlerts).toHaveBeenCalled()
    expect(mockUseBridgeCleanup).toHaveBeenCalled()
  })

  test('should match snapshot on when bridge type is THIRD_PARTY', () => {
    store = mockStore({
      ...mockedInitialState,
      bridge: {
        ...mockedInitialState.bridge,
        bridgeType: BRIDGE_TYPE.THIRD_PARTY,
      },
    })

    const { asFragment } = renderBridging({ store })
    expect(asFragment()).toMatchSnapshot()
  })
})
