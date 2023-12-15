import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import EarnWithdrawModalSuccessModal from './'
import { mockedInitialState } from 'util/tests'
import { BrowserRouter } from 'react-router-dom'

const renderModal = ({
  initialState,
  store,
}: {
  initialState: any
  store: any
}) => {
  return render(
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
}

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

    const { queryByTestId, getByTestId } = renderModal({ initialState, store })

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

    const { getByTestId } = renderModal({ initialState, store })

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

    const { queryByTestId } = renderModal({
      initialState: mockedInitialState,
      store,
    })

    expect(
      queryByTestId('earnwithdrawmodalsuccess-modal')
    ).not.toBeInTheDocument()
  })
})
