import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SettingsModal from './'
import { mockedInitialState } from 'util/tests'

describe('NetworkPickerModal', () => {
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

  test('Should be not visible', () => {
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
