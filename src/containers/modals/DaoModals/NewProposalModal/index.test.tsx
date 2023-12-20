import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewProposalModal from './'
import { mockedInitialState } from 'util/tests'

describe('NewProposalModal', () => {
  test('Should be visible 2', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        newProposalModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NewProposalModal open={initialState.ui.newProposalModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('newproposal-dao-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        newProposalModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NewProposalModal open={initialState.ui.newProposalModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('newproposal-dao-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-newproposal-dao-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'newProposalModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <NewProposalModal open={mockedInitialState.ui.newProposalModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('delegate-dao-modal')).not.toBeInTheDocument()
  })
})
