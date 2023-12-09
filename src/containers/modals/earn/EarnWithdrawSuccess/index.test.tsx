import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import EarnWithdrawModalSuccessModal from './'
import { mockedInitialState } from 'util/tests'
import { BrowserRouter } from 'react-router-dom'

describe('EarnWithdrawModalSuccessModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawModalSuccess: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId, getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <EarnWithdrawModalSuccessModal
              open={initialState.ui.EarnWithdrawModalSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(queryByTestId('earnwithdrawmodalsuccess-modal')).toBeInTheDocument()
    fireEvent.click(getByTestId('close-btn'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'EarnWithdrawModalSuccess',
    })
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawModalSuccess: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <EarnWithdrawModalSuccessModal
              open={initialState.ui.EarnWithdrawModalSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(getByTestId('earnwithdrawmodalsuccess-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-earnwithdrawmodalsuccess-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'EarnWithdrawModalSuccess',
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
            <EarnWithdrawModalSuccessModal
              open={mockedInitialState.ui.EarnWithdrawModalSuccess}
            />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    )

    expect(
      queryByTestId('earnwithdrawmodalsuccess-modal')
    ).not.toBeInTheDocument()
  })
})
