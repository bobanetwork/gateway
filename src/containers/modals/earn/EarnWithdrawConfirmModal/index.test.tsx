import React from 'react'
import {
  render,
  fireEvent,
  getByLabelText,
  act,
  waitFor,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import CustomThemeProvider from 'themes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import EarnWithdrawConfirmModal from './'
import { mockedInitialState } from 'util/tests'
import { BrowserRouter } from 'react-router-dom'
import earnService from 'services/earn.service'

jest.mock('services/earn.service', () => {
  return {
    withdrawLiquidity: jest.fn(),
    getL1LPInfo: jest.fn(),
    getL2LPInfo: jest.fn(),
    withdrawReward: jest.fn(),
    getAllAddresses: jest.fn(),
  }
})

const renderModal = ({
  store,
  initialState,
}: {
  initialState: any
  store: any
}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CustomThemeProvider>
          <EarnWithdrawConfirmModal
            open={initialState.ui.EarnWithdrawConfirmModal}
          />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('EarnWithdrawConfirmModal', () => {
  test('Should be visible', () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawConfirmModal: true,
      },
      earn: {
        withdrawPayload: {
          currency: '0xtokenaddressgoes-here',
          amountToWithdrawWei: '40000000000000',
          L1orL2Pool: 'L1LP',
          symbol: 'ETH',
        },
      },
    }
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { queryByTestId } = renderModal({ initialState, store })

    expect(queryByTestId('earnwithdrawconfirmmodal-modal')).toBeInTheDocument()
  })

  test('Should dispatch close modal action on click close button', async () => {
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawConfirmModal: true,
      },
      earn: {
        withdrawPayload: {
          currency: '0xtokenaddressgoes-here',
          amountToWithdrawWei: '40000000000000',
          L1orL2Pool: 'L1LP',
          symbol: 'ETH',
        },
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = renderModal({ initialState, store })

    expect(getByTestId('earnwithdrawconfirmmodal-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('close-modal-earnwithdrawconfirmmodal-modal'))

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/MODAL/CLOSE',
      payload: 'EarnWithdrawConfirmModal',
    })
  })

  test('Should dispatch sequence of actions on confirm with sucess', async () => {
    // @ts-ignore
    earnService.getL1LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    earnService.getL2LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    earnService.withdrawLiquidity.mockImplementation(() =>
      Promise.resolve(true)
    )
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawConfirmModal: true,
      },
      earn: {
        withdrawPayload: {
          currency: '0xtokenaddressgoes-here',
          amountToWithdrawWei: '40000000000000',
          L1orL2Pool: 'L1LP',
          symbol: 'ETH',
        },
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = renderModal({ initialState, store })

    expect(getByTestId('earnwithdrawconfirmmodal-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('confirm-btn'))
    await waitFor(() => {
      const actions = store.getActions()
      expect(actions).toEqual([
        { type: 'EARN/WITHDRAW/REQUEST' },
        { type: 'EARN/WITHDRAW/SUCCESS', payload: true },
        {
          type: 'UI/MODAL/OPEN',
          payload: 'EarnWithdrawModalSuccess',
          token: undefined,
          fast: undefined,
          tokenIndex: undefined,
          lock: undefined,
          proposalId: undefined,
          selectionLayer: undefined,
          destNetworkSelection: undefined,
        },
        { type: 'GET_EARNINFO' },
        { type: 'UI/MODAL/CLOSE', payload: 'EarnWithdrawConfirmModal' },
      ])
    })
  })
  test('Should dispatch sequence of actions on confirm with sucess', async () => {
    // @ts-ignore
    earnService.getL1LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    earnService.getL2LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    earnService.withdrawLiquidity.mockImplementation(() =>
      Promise.resolve(false)
    )
    const initialState = {
      ...mockedInitialState,
      ui: {
        ...mockedInitialState.ui,
        EarnWithdrawConfirmModal: true,
      },
      earn: {
        withdrawPayload: {
          currency: '0xtokenaddressgoes-here',
          amountToWithdrawWei: '40000000000000',
          L1orL2Pool: 'L1LP',
          symbol: 'ETH',
        },
      },
    }

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore(initialState)

    const { getByTestId } = renderModal({ initialState, store })

    expect(getByTestId('earnwithdrawconfirmmodal-modal')).toBeInTheDocument()

    fireEvent.click(getByTestId('confirm-btn'))
    await waitFor(() => {
      const actions = store.getActions()
      expect(actions).toEqual([
        { type: 'EARN/WITHDRAW/REQUEST' },
        { type: 'UI/ERROR/UPDATE', payload: 'Failed to withdraw ETH' },
        { type: 'UI/MODAL/CLOSE', payload: 'EarnWithdrawConfirmModal' },
      ])
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
      queryByTestId('earnwithdrawconfirmmodal-modal')
    ).not.toBeInTheDocument()
  })
})
