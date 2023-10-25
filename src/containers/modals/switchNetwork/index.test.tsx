import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SwitchNetworkModal from './SwitchNetworkModal'
import { mockedInitialState } from 'util/tests'

describe('SwitchNetworkModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        switchNetworkModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SwitchNetworkModal open={initialState.ui.switchNetworkModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('switch-network-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        switchNetworkModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SwitchNetworkModal open={initialState.ui.switchNetworkModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('switch-network-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-switch-network-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'switchNetworkModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <SwitchNetworkModal open={mockedInitialState.ui.switchNetworkModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('switch-network-modal')).not.toBeInTheDocument()
  })
})
