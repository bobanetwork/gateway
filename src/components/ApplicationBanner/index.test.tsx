import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockLocalStorage, mockedInitialState } from 'util/tests'
import ApplicationBanner from '.'
import { bannerAlerts } from './data'

jest.mock('./data', () => ({
  bannerAlerts: jest.fn(),
}))

const mockbannerAlerts = bannerAlerts as jest.MockedFunction<
  typeof bannerAlerts
>

const mockStore = configureStore([thunk])

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const renderApplicationBanner = () => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <BrowserRouter>
        <CustomThemeProvider>
          <ApplicationBanner />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('ApplicationBanner', () => {
  beforeEach(() => {
    // @ts-ignore
    mockbannerAlerts.mockImplementation(() => [
      {
        key: 'message-1',
        type: 'warning',
        canClose: true,
        Component: () => (
          <p>
            Message update 1 <a href="/update">CLICK HERE</a>
          </p>
        ),
      },
      {
        key: 'message-2',
        type: 'warning',
        canClose: true,
        message: 'message two goes here',
      },
    ])
  })

  test('should match snapshot when empty alerts', () => {
    mockbannerAlerts.mockImplementation(() => [])
    const { asFragment } = renderApplicationBanner()
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot when alerts are enable', () => {
    const { asFragment } = renderApplicationBanner()
    expect(asFragment()).toMatchSnapshot()
  })

  test('should update localstorage and ui on clicking close', () => {
    renderApplicationBanner()
    const closeBtn = screen.getByTestId(`close-icon-message-1`)
    expect(closeBtn).toBeVisible()
    fireEvent.click(closeBtn)
    expect(localStorage.getItem(`appBanner__message-1`)).toEqual(
      JSON.stringify(true)
    )
    expect(screen.getAllByTestId('banner-item').length).toEqual(1)
  })
})
