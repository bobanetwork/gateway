import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import Earn from './Earn'

const mockStore = configureStore([thunk])

const renderEarnComponent = () => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <BrowserRouter>
        <CustomThemeProvider>
          <Earn />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('Earn ', () => {
  test('should match snapshot', () => {
    window.scrollTo = jest.fn()
    const { asFragment } = renderEarnComponent()
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
})
