import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import InstallMetaMaskModal from './InstallMetaMaskModal'
import { mockedInitialState } from 'util/tests'

describe('InstallMetaMaskModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        installMetaMaskModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <InstallMetaMaskModal open={initialState.ui.installMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('installMetamask-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        installMetaMaskModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <InstallMetaMaskModal open={initialState.ui.installMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('installMetamask-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-installMetamask-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'installMetaMaskModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <InstallMetaMaskModal
            open={mockedInitialState.ui.installMetaMaskModal}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('installMetamask-modal')).not.toBeInTheDocument()
  })
})
