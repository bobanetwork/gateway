import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import TransactionSuccessModal from './'
import { mockedInitialState } from 'util/tests'
import { BrowserRouter } from 'react-router-dom'

describe('TransactionSuccessModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        transactionSuccess: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <TransactionSuccessModal
              open={initialState.ui.transactionSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(queryByTestId('transactionSuccess-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        transactionSuccess: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <TransactionSuccessModal
              open={initialState.ui.transactionSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(getByTestId('transactionSuccess-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-transactionSuccess-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'transactionSuccess',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <TransactionSuccessModal
              open={mockedInitialState.ui.transactionSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(queryByTestId('transactionSuccess-modal')).not.toBeInTheDocument()
  })
})
