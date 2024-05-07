import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import WalletSelectorModal from './'
import { mockedInitialState } from 'util/tests'

describe('WalletSelectorModal', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

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

    expect(queryByTestId('walletselector-modal')).toBeInTheDocument()
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

    expect(getByTestId('walletselector-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-walletselector-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'walletSelectorModal',
    })
  })

  test('Should not be visible', () => {
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

    expect(queryByTestId('walletselector-modal')).not.toBeInTheDocument()
  })

  test('If Metamask is installed and click on connect to metamask should it tigger connect to metamask', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        walletSelectorModal: true,
      },
    }

    const windows = window as any

    windows.ethereum = {
      request: jest.fn(),
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId, getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <WalletSelectorModal open={initialState.ui.walletSelectorModal} />
        </CustomThemeProvider>
      </Provider>
    )

    fireEvent.click(getByTestId('metamask-link'))
    expect(windows.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })
  })

  test('If Metamask is not installed and click on connect to metamask should show the install metamask button', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        walletSelectorModal: true,
      },
    }

    const windows = window as any

    windows.ethereum = undefined

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId, getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <WalletSelectorModal open={initialState.ui.walletSelectorModal} />
        </CustomThemeProvider>
      </Provider>
    )

    fireEvent.click(getByTestId('metamask-link'))

    expect(queryByTestId('metamask-is-not-installed')).toBeInTheDocument()
  })
})
