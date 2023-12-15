import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import TransferPendingModal from './'
import { mockedInitialState } from 'util/tests'

describe('TransferPendingModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        transferPendingModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <TransferPendingModal open={initialState.ui.transferPendingModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('transferpending-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        transferPendingModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <TransferPendingModal open={initialState.ui.transferPendingModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('transferpending-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-transferpending-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'transferPendingModal',
    })
  })

  test('Should not be visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <TransferPendingModal
            open={mockedInitialState.ui.transferPendingModal}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('transferpending-modal')).not.toBeInTheDocument()
  })
})
