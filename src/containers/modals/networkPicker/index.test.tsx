import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NetworkPickerModal from './'
import { mockedInitialState } from 'util/tests'

describe('NetworkPickerModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        networkPicker: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NetworkPickerModal
            open={initialState.ui.networkPicker}
            destNetworkSelection={false}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('network-picker-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        networkPicker: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NetworkPickerModal
            open={initialState.ui.networkPicker}
            destNetworkSelection={false}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('network-picker-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-network-picker-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'networkPicker',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NetworkPickerModal
            open={mockedInitialState.ui.networkPicker}
            destNetworkSelection={false}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('network-picker-modal')).not.toBeInTheDocument()
  })
})
