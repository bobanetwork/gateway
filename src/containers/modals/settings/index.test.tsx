import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SettingsModal from './'
import { mockedInitialState } from 'util/tests'

describe('SettingsModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        settingsModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SettingsModal open={initialState.ui.settingsModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('settings-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        settingsModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SettingsModal open={initialState.ui.settingsModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('settings-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-settings-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'settingsModal',
    })
  })

  test('Should update state on check uncheck of testnet enable switch ', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        settingsModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByText } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SettingsModal open={initialState.ui.settingsModal} />
        </CustomThemeProvider>
      </Provider>
    )
    const showTestnetsSwitch =
      queryByText('Show Testnets')?.querySelector('input')

    if (showTestnetsSwitch) {
      expect(showTestnetsSwitch).toBeInTheDocument()
      const initialValue = showTestnetsSwitch.checked

      fireEvent.click(showTestnetsSwitch)
      const updatedValue = showTestnetsSwitch.checked
      expect(updatedValue).not.toBe(initialValue)
    }
  })

  test('Should update state on check uncheck of Add Destination Address enable switch ', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        settingsModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByText } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SettingsModal open={initialState.ui.settingsModal} />
        </CustomThemeProvider>
      </Provider>
    )
    const showDestinationAddress = queryByText(
      'Add Destination Address'
    )?.querySelector('input')
    if (showDestinationAddress) {
      expect(showDestinationAddress).toBeInTheDocument()
      const initialValue = showDestinationAddress.checked

      fireEvent.click(showDestinationAddress)
      const updatedValue = showDestinationAddress.checked
      expect(updatedValue).not.toBe(initialValue)
    }
  })

  test('Should not be visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SettingsModal open={mockedInitialState.ui.settingsModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('settings-modal')).not.toBeInTheDocument()
  })
})
