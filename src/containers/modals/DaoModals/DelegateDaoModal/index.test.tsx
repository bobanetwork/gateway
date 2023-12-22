import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import DelegateDaoModal from './'
import { mockedInitialState } from 'util/tests'

describe('DelegateDaoModal', () => {
  test('Should be visible 2', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        delegateDaoModal: true,
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <DelegateDaoModal open={initialState.ui.delegateDaoModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('delegate-dao-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        delegateDaoModal: true,
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <DelegateDaoModal open={initialState.ui.delegateDaoModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(getByTestId('delegate-dao-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-delegate-dao-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'delegateDaoModal',
    })
  })

  test('Should be not visible', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(mockedInitialState)

    const { queryByTestId } = render(
      <Provider store={store}>
        <CustomThemeProvider>
          <DelegateDaoModal open={mockedInitialState.ui.delegateDaoModal} />
        </CustomThemeProvider>
      </Provider>
    )

    expect(queryByTestId('delegate-dao-modal')).not.toBeInTheDocument()
  })
})
