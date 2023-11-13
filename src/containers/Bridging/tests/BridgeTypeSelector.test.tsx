import { render } from '@testing-library/react'
import React from 'react'
import CustomThemeProvider from 'themes'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import BridgeTypeSelector from '../BridgeTypeSelector'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'

const mockStore = configureStore([thunk])

const renderBridgeTypeSelector = ({ options = null }: any) => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <CustomThemeProvider>
        <BridgeTypeSelector></BridgeTypeSelector>
      </CustomThemeProvider>
    </Provider>
  )
}

describe('Testing BridgeTypeSelector', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 7, 24))
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test('Test BridgeTypeSelector renders', () => {
    const { asFragment } = renderBridgeTypeSelector({})
    expect(asFragment()).toMatchSnapshot()
  })
})
