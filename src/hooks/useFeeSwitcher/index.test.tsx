import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useFeeSwitcher from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockedInitialState } from 'util/tests'
import { Provider } from 'react-redux'
import networkService from 'services/networkService'

jest.mock('services/networkService', () => ({
  ...jest.requireActual('services/networkService'),
  L1NativeTokenSymbol: 'ETH',
  estimateMinL1NativeTokenForFee: jest.fn(),
  switchFee: jest.fn(),
}))

describe('useFeeSwitcher', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  beforeEach(() => {
    jest
      .spyOn(networkService, 'estimateMinL1NativeTokenForFee')
      .mockResolvedValueOnce(0.002)

    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

  test('if L2 and L1 balance tokens are empty dispatch error for wallet empty', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: true,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('BOBA')
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/ERROR/UPDATE',
      payload: 'Wallet empty - please bridge in ETH or BOBA from L1',
    })
  })

  test("if fee is payable on BOBA and targetFee is BOBA doesn't have to do anything", async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '251aa22f11731ce4',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '251aa22f11731ce4',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: true,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('BOBA')
    })

    const actions = store.getActions()
    expect(actions).toEqual([])
  })

  test("if fee is payable on ETH and targetFee is ETH doesn't have to do anything", async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '251aa22f11731ce4',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '251aa22f11731ce4',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: false,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('ETH')
    })

    const actions = store.getActions()
    expect(actions).toEqual([])
  })

  test('if fee is payable on ETH and targetFee is BOBA and boba balance is too Low should show an error', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '00',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '00',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: false,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('BOBA')
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      payload:
        'You cannot change the fee token to BOBA since your BOBA balance is below 1 BOBA. If you change fee token now, you might get stuck. Please swap some ETH for BOBA first.',
      type: 'UI/ERROR/UPDATE',
    })
  })

  test('if fee is payable on BOBA and targetFee is ETH and Eth balance is too Low should show an error', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '00',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '00',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: true,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('ETH')
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({
      payload:
        'You cannot change the fee token to ETH since your ETH balance is below 0.002. If you change fee token now, you might get stuck. Please obtain some ETH first.',
      type: 'UI/ERROR/UPDATE',
    })
  })

  test('if fee is payable on ETH and targetFee is BOBA and boba balance is enought should switchfee request', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '00',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '251aa22f11731ce4',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: false,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('BOBA')
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({ type: 'SETUP/SWITCHFEE/REQUEST' })
  })

  test('if fee is payable on BOBA and targetFee is ETH and Eth balance is enought should switchfee request', async () => {
    const initialState = {
      ...mockedInitialState,
      balance: {
        ...mockedInitialState.balance,
        layer2: [
          {
            address: '0x4200000000000000000000000000000000000006',
            addressL1: '0x0000000000000000000000000000000000000000',
            addressL2: '0x4200000000000000000000000000000000000006',
            currency: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            decimals: 18,
            balance: '251aa22f11731ce4',
          },
          {
            currency: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL1: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            addressL2: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbolL1: 'BOBA',
            symbolL2: 'BOBA',
            decimals: 18,
            name: 'Boba Token',
            redalert: false,
            balance: '00',
            layer: 'L2',
            address: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
            symbol: 'BOBA',
          },
        ],
      },
      setup: {
        ...mockedInitialState.setup,
        bobaFeeChoice: true,
      },
    }

    const store = mockStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useFeeSwitcher(), {
      wrapper,
    })

    await act(async () => {
      await result.current.switchFeeUse('ETH')
    })

    const actions = store.getActions()
    expect(actions).toContainEqual({ type: 'SETUP/SWITCHFEE/REQUEST' })
  })
})
