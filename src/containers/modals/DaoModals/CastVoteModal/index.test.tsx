import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CastVoteModal from './'
import { mockedInitialState } from 'util/tests'

describe('CastVoteModal', () => {
  test('Should be visible 2', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        castVoteModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <CastVoteModal open={initialState.ui.castVoteModal} proposalId={5} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('castvote-proposal-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        castVoteModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <CastVoteModal open={initialState.ui.castVoteModal} proposalId={5} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('network-picker-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-network-picker-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'castVoteModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <CastVoteModal
            open={mockedInitialState.ui.castVoteModal}
            proposalId={5}
          />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('castvote-proposal-modal')).not.toBeInTheDocument()
  })
})
