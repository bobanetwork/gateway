import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NoMetaMaskModal from './NoMetaMaskModal'
import { mockedInitialState } from 'util/tests'

describe('NoMetaMaskModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        noMetaMaskModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NoMetaMaskModal open={initialState.ui.noMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('nometamask-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        noMetaMaskModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NoMetaMaskModal open={initialState.ui.noMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('nometamask-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-nometamask-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'noMetaMaskModal',
    })
  })

  test('Should dispatch installMetaMaskModal modal action on click Add MetaMask button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        noMetaMaskModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NoMetaMaskModal open={initialState.ui.noMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('nometamask-modal')).toBeInTheDocument()

    window.open = jest.fn()

    fireEvent.click(getByText('Add MetaMask to Chrome'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/OPEN',
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
          <NoMetaMaskModal open={mockedInitialState.ui.noMetaMaskModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('nometamask-modal')).not.toBeInTheDocument()
  })
})
