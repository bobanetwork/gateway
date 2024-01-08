import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import Earn from './Earn'
import earnService from 'services/earn.service'

jest.mock('services/balance.service', () => {
  return {
    getBalances: jest.fn(),
  }
})
jest.mock('services/earn.service', () => {
  return {
    getL1LPInfo: jest.fn(),
    getL2LPInfo: jest.fn(),
    getReward: jest.fn(),
  }
})
jest.mock('services/networkService', () => {
  return {
    getAllAddresses: jest.fn(),
  }
})

const mockStore = configureStore([thunk])

const renderEarnComponent = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CustomThemeProvider>
          <Earn />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('Earn ', () => {
  let store
  beforeEach(() => {
    // @ts-ignore
    earnService.getL1LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    earnService.getL2LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
  })

  test('should match snapshot when account is not enabled & layer is L1', () => {
    store = mockStore(mockedInitialState)
    const { asFragment } = renderEarnComponent({ store })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })

  test('should update check value on click correctly', () => {
    store = mockStore(mockedInitialState)
    renderEarnComponent({ store })

    const checkBoxBtn = screen.getByTestId('my-stake-checkbox')
    expect(checkBoxBtn).not.toBeChecked()
    fireEvent.click(checkBoxBtn)
    expect(checkBoxBtn).toBeChecked()
  })

  test('should match snapshot & trigger action when accountEnabled with layer L2 ', () => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        netLayer: 'L2',
        accountEnabled: true,
      },
    })
    const { asFragment } = renderEarnComponent({ store })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()

    const actions = store.getActions()

    expect(actions).toContainEqual({
      type: 'BALANCE/GET/REQUEST',
    })
  })

  // accountEnabled with layer L2
  test('should match snapshot on switching between tabs on L2', () => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        netLayer: 'L2',
        accountEnabled: true,
      },
    })
    const { asFragment } = renderEarnComponent({ store })

    const tabL1Btn = screen.getByTestId('tab-l1')

    fireEvent.click(tabL1Btn)

    let actions = store.getActions()

    expect(actions).toContainEqual({
      type: 'BALANCE/GET/REQUEST',
    })

    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()

    const connectBtn = screen.getByTestId('connect-btn')
    fireEvent.click(connectBtn)

    actions = store.getActions()
    expect(actions).toContainEqual({ payload: true, type: 'SETUP/CONNECT_ETH' })
  })
  test('should match snapshot on switching between tabs on L1', () => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        netLayer: 'L1',
        accountEnabled: true,
      },
    })
    const { asFragment } = renderEarnComponent({ store })

    const tabL1Btn = screen.getByTestId('tab-l2')

    fireEvent.click(tabL1Btn)

    let actions = store.getActions()

    expect(actions).toContainEqual({
      type: 'BALANCE/GET/REQUEST',
    })

    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()

    const connectBtn = screen.getByTestId('connect-btn')
    fireEvent.click(connectBtn)

    actions = store.getActions()
    expect(actions).toContainEqual({
      payload: true,
      type: 'SETUP/CONNECT_BOBA',
    })
  })

  test('should trigger actoins when basedEnabled & accountEnabled', () => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        netLayer: 'L2',
        baseEnabled: true,
        accountEnabled: true,
      },
    })
    const { asFragment } = renderEarnComponent({ store })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()

    const actions = store.getActions()

    expect(actions).toEqual([
      { type: 'GET_EARNINFO' },
      { type: 'GET/ALL/ADDRESS/REQUEST' },
      { type: 'BALANCE/GET/REQUEST' },
    ])
  })
})
