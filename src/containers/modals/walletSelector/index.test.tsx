import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import WalletSelectorModal from './WalletSelectorModal'
import { mockedInitialState } from 'util/tests'

describe('NetworkPickerModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        walletSelectorModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <WalletSelectorModal open={initialState.ui.walletSelectorModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('walletSelector-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        walletSelectorModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <WalletSelectorModal open={initialState.ui.walletSelectorModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('walletSelector-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-walletSelector-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'walletSelectorModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <WalletSelectorModal
            open={mockedInitialState.ui.walletSelectorModal}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('walletSelector-modal')).not.toBeInTheDocument()
  })
})
