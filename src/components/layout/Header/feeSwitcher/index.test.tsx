import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import FeeSwitcher from '.'
import useFeeSwitcher from 'hooks/useFeeSwitcher'

jest.mock('hooks/useFeeSwitcher')
jest.mock('services/networkService', () => {
  return {
    getAllAddress: jest.fn(),
    getBalances: jest.fn(),
  }
})

const mockUseFeeSwticher = useFeeSwitcher as jest.Mock

const mockStore = configureStore([thunk])

const renderFeeSwitcher = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <FeeSwitcher />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('FeeSwitcher', () => {
  let store
  beforeEach(() => {
    store = {
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.bridge,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        ...mockedInitialState.bridge,
        bridgeToAddressState: true,
      },
    }

    mockUseFeeSwticher.mockImplementation(() => {
      return {
        switchFeeUse: jest.fn(),
      }
    })
  })

  test('should match snapshot when account is enabled ', () => {
    store = mockStore({
      ...store,
    })

    const { asFragment } = renderFeeSwitcher({
      store,
    })
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when account is not enabled ', () => {
    store = mockStore({
      ...store,
      setup: {
        ...store.setup,
        accountEnabled: false,
      },
    })

    const { asFragment } = renderFeeSwitcher({
      store,
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
