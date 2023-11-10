import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import Home from '.'

const mockStore = configureStore([thunk])

const renderHomeComponent = () => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('Home ', () => {
  test('should match snapshot', () => {
    window.scrollTo = jest.fn()
    const { asFragment } = renderHomeComponent()
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
})
