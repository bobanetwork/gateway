/* eslint-disable */

import React from 'react'
import { Provider } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { mockedInitialState } from 'util/tests'

import networkService from 'services/networkService'

import useBridge from '.'
import teleportationService from 'services/teleportation.service'
import bridgingService from 'services/bridging.service'

const L1LPAddress = 'L1LPAddress'

jest.mock('services/networkService', () => {
  return {
    getAllAddresses: jest.fn(),
  }
})

jest.mock('services/bridging.service', () => {
  return {
    approveERC20: jest.fn(),
    depositErc20: jest.fn(),
    depositETHToL2: jest.fn(),
    depositL1LP: jest.fn(),
    depositL2LP: jest.fn(),
    exitBOBA: jest.fn(),
  }
})

jest.mock('services/teleportation.service', () => {
  return {
    depositWithTeleporter: jest.fn(),
    getTeleportationAddress: jest.fn(),
  }
})

jest.mock('services/fee.service', () => {
  return {
    estimateL1SecurityFee: jest.fn(),
    estimateL2Fee: jest.fn(),
  }
})

jest.mock('services/balance.service', () => {
  return {
    getL2BalanceBOBA: jest.fn(),
  }
})

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
let store

const successActionsFast = [
  {
    type: 'UI/MODAL/OPEN',
    payload: 'bridgeInProgress',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'APPROVE/CREATE/REQUEST' },
  { type: 'APPROVE/CREATE/SUCCESS', payload: true },
  { type: 'DEPOSIT/CREATE/REQUEST' },
  { type: 'DEPOSIT/CREATE/SUCCESS', payload: { message: 'success!' } },
  { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
  {
    type: 'UI/MODAL/OPEN',
    payload: 'transactionSuccess',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'BRIDGE/TOKEN/RESET' },
  { type: 'BRIDGE/ALERT/PURGE', payload: undefined },
  { type: 'BRIDGE/AMOUNT/RESET' },
]

const successActionsLight = [
  {
    type: 'UI/MODAL/OPEN',
    payload: 'bridgeInProgress',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'DEPOSIT/CREATE/REQUEST' },
  { type: 'DEPOSIT/CREATE/SUCCESS', payload: { message: 'success!' } },
  { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
  {
    type: 'UI/MODAL/OPEN',
    payload: 'transactionSuccess',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'BRIDGE/TOKEN/RESET' },
  { type: 'BRIDGE/ALERT/PURGE', payload: undefined },
  { type: 'BRIDGE/AMOUNT/RESET' },
]

const successActionsClassic = [
  {
    type: 'UI/MODAL/OPEN',
    payload: 'bridgeInProgress',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'DEPOSIT/CREATE/REQUEST' },
  { type: 'DEPOSIT/CREATE/SUCCESS', payload: { message: 'success!' } },
  { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
  {
    type: 'UI/MODAL/OPEN',
    payload: 'transactionSuccess',
    token: undefined,
    fast: undefined,
    tokenIndex: undefined,
    lock: undefined,
    proposalId: undefined,
    selectionLayer: undefined,
    destNetworkSelection: undefined,
  },
  { type: 'BRIDGE/TOKEN/RESET' },
  { type: 'BRIDGE/ALERT/PURGE', payload: undefined },
  { type: 'BRIDGE/AMOUNT/RESET' },
]

// create wrapper to pass to hooks.
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>

describe('UseBridge Hooks', () => {
  test('Should throw error on light bridge when destination chain id not matched', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      return
    })
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })

    store = mockStore({
      ...mockedInitialState,
      bridge: {
        ...mockedInitialState.bridge,
        destChainIdTeleportation: 0,
        bridgeType: 'LIGHT',
      },
    })

    renderHook(() => useBridge(), { wrapper })

    expect(console.error).toHaveBeenCalled()

    const actions = store.getActions()
    expect(actions).toEqual([
      {
        type: 'UI/ERROR/UPDATE',
        payload: 'Failed to get destination chain id',
      },
    ])
  })

  describe('Layer 1', () => {
    describe('Classic Bridge', () => {
      beforeEach(() => {
        ;(bridgingService.depositETHToL2 as jest.Mock).mockResolvedValue({
          message: 'success!',
        })
        ;(bridgingService.depositErc20 as jest.Mock).mockResolvedValue({
          message: 'success!',
        })

        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L1',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'CLASSIC',
          },
        }
      })
      test('should invoke depositETHL2 correctly and reset state on success', async () => {
        store = mockStore(store)

        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (bridgingService.depositETHToL2 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.depositETHToL2 as jest.Mock).mock.calls[0][0]
        ).toEqual({ recipient: '', value_Wei_String: '1255000000000000000' })

        expect(actions).toEqual(successActionsClassic)
      })

      test('should trigger depositETHL2 correctly with reciepent address', async () => {
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            bridgeToAddressState: true,
            bridgeDestinationAddress: '0xcRECEIPENTTOADDRESS',
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (bridgingService.depositETHToL2 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.depositETHToL2 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          recipient: '0xcRECEIPENTTOADDRESS',
          value_Wei_String: '1255000000000000000',
        })
        expect(actions).toEqual(successActionsClassic)
      })

      test('should invoke depositErc20 correctly and reset state on success', async () => {
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let prevActions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (bridgingService.depositErc20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.depositErc20 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          recipient: '',
          value_Wei_String: '1255000000000000000',
          currency: '0x0000000000000000000000000000000000000006',
          currencyL2: '0x0000000000000000000000000000000000000032',
        })
        expect(prevActions).toEqual(successActionsClassic)
      })

      test('should trigger depositErc20 correctly with reciepent address', async () => {
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            bridgeToAddressState: true,
            bridgeDestinationAddress: '0xcRECEIPENTTOADDRESS',
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (bridgingService.depositErc20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.depositErc20 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          currency: '0x0000000000000000000000000000000000000006',
          currencyL2: '0x0000000000000000000000000000000000000032',
          recipient: '0xcRECEIPENTTOADDRESS',
          value_Wei_String: '1255000000000000000',
        })
        expect(actions).toEqual(successActionsClassic)
      })
    })
    describe('Fast Bridge', () => {
      beforeEach(() => {
        ;(networkService.getAllAddresses as jest.Mock).mockReturnValue({
          L1LPAddress,
        })
        ;(bridgingService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(bridgingService.depositL1LP as jest.Mock).mockResolvedValue({
          message: 'success!',
        })

        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L1',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'FAST',
          },
        }
      })

      test('should trigger approveERC20 and DepositL1LP correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (networkService.getAllAddresses as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L1LPAddress',
          undefined,
        ])
        expect(
          (bridgingService.depositL1LP as jest.Mock).mock.calls[0]
        ).toEqual([
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
        ])
        expect(actions).toEqual(successActionsFast)
      })

      test('should work correclty and reset state should be triggered on error', async () => {
        store = mockStore(store)
        ;(bridgingService.approveERC20 as jest.Mock).mockRejectedValue(true)
        ;(bridgingService.depositL1LP as jest.Mock).mockResolvedValue({
          message: 'success!',
        })

        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (networkService.getAllAddresses as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L1LPAddress',
          undefined,
        ])
        expect(
          (bridgingService.depositL1LP as jest.Mock).mock.calls
        ).toHaveLength(0)

        expect(actions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'APPROVE/CREATE/REQUEST' },
          {
            type: 'UI/ERROR/UPDATE',
            payload: 'Failed to approve amount or user rejected signature',
          },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
        ])

        store.clearActions()

        // reject value from deposit l1lp.
        ;(bridgingService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(bridgingService.depositL1LP as jest.Mock).mockRejectedValue(true)

        const nextActions = store.getActions()
        await result.current.triggerSubmit()

        expect(
          (networkService.getAllAddresses as jest.Mock).mock.calls
        ).toHaveLength(2)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L1LPAddress',
          undefined,
        ])
        expect(
          (bridgingService.depositL1LP as jest.Mock).mock.calls[0]
        ).toEqual([
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
        ])

        expect(nextActions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'APPROVE/CREATE/REQUEST' },
          { type: 'APPROVE/CREATE/SUCCESS', payload: true },
          { type: 'DEPOSIT/CREATE/REQUEST' },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
        ])
      })
    })

    describe('Light Bridge Teleporter', () => {
      beforeEach(() => {
        ;(
          teleportationService.getTeleportationAddress as jest.Mock
        ).mockReturnValue({
          teleportationAddr: 'teleportationAddr',
        })
        ;(bridgingService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(
          teleportationService.depositWithTeleporter as jest.Mock
        ).mockResolvedValue({
          message: 'success!',
        })

        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L1',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'LIGHT',
          },
        }
      })

      test('should trigger depositWithTeleporter correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.depositWithTeleporter as jest.Mock).mock
            .calls[0]
        ).toEqual([
          'L1',
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
          'ethereum',
        ])
        expect(actions).toEqual(successActionsLight)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly and reset state on success', async () => {
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            destChainIdTeleportation: 1,
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.getTeleportationAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'teleportationAddr',
          undefined,
        ])
        expect(actions).toEqual(successActionsFast)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly, trigger actions on error', async () => {
        ;(bridgingService.approveERC20 as jest.Mock).mockRejectedValue(true)
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            destChainIdTeleportation: 1,
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.getTeleportationAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'teleportationAddr',
          undefined,
        ])
        expect(actions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'APPROVE/CREATE/REQUEST' },
          {
            type: 'UI/ERROR/UPDATE',
            payload: 'Failed to approve amount or user rejected signature',
          },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
        ])
      })
    })
  })

  describe('Layer 2', () => {
    describe('Classic Bridge', () => {
      ;(bridgingService.exitBOBA as jest.Mock).mockResolvedValue({
        message: 'success!',
      })
      ;(bridgingService.depositL2LP as jest.Mock).mockResolvedValue({
        message: 'success!',
      })

      beforeEach(() => {
        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L2',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'CLASSIC',
          },
        }
      })
      test('should trigger exitBoba correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })
        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect((bridgingService.exitBOBA as jest.Mock).mock.calls).toHaveLength(
          1
        )
        expect((bridgingService.exitBOBA as jest.Mock).mock.calls[0]).toEqual([
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
        ])
        expect(actions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'EXIT/CREATE/REQUEST' },
          { type: 'EXIT/CREATE/SUCCESS', payload: undefined },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
          {
            type: 'UI/MODAL/OPEN',
            payload: 'transactionSuccess',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'BRIDGE/TOKEN/RESET' },
          { type: 'BRIDGE/ALERT/PURGE', payload: undefined },
          { type: 'BRIDGE/AMOUNT/RESET' },
        ])
      })
    })
    describe('Fast Bridge', () => {
      beforeEach(() => {
        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L2',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'FAST',
          },
        }
      })

      test('should triggerFastExit correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })
        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (bridgingService.depositL2LP as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.depositL2LP as jest.Mock).mock.calls[0]
        ).toEqual([
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
        ])
        expect(actions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'EXIT/CREATE/REQUEST' },
          { type: 'EXIT/CREATE/SUCCESS', payload: undefined },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
          {
            type: 'UI/MODAL/OPEN',
            payload: 'transactionSuccess',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'BRIDGE/TOKEN/RESET' },
          { type: 'BRIDGE/ALERT/PURGE', payload: undefined },
          { type: 'BRIDGE/AMOUNT/RESET' },
        ])
      })
    })

    describe('Light Bridge Teleporter', () => {
      beforeEach(() => {
        ;(
          teleportationService.getTeleportationAddress as jest.Mock
        ).mockReturnValue({
          teleportationAddr: 'teleportationAddr',
        })
        ;(bridgingService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(
          teleportationService.depositWithTeleporter as jest.Mock
        ).mockResolvedValue({
          message: 'success!',
        })

        store = {
          ...mockedInitialState,
          setup: {
            ...mockedInitialState.setup,
            netLayer: 'L2',
          },
          bridge: {
            ...mockedInitialState.bridge,
            bridgeType: 'LIGHT',
          },
        }
      })

      test('should trigger depositWithTeleporter correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.depositWithTeleporter as jest.Mock).mock
            .calls[0]
        ).toEqual([
          'L2',
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
          'ethereum',
        ])
        expect(actions).toEqual(successActionsLight)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly and reset state on success', async () => {
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            destChainIdTeleportation: 1,
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.getTeleportationAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'teleportationAddr',
          undefined,
        ])
        expect(actions).toEqual(successActionsFast)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly, trigger actions on error', async () => {
        ;(bridgingService.approveERC20 as jest.Mock).mockRejectedValue(true)
        store = mockStore({
          ...store,
          bridge: {
            ...store.bridge,
            destChainIdTeleportation: 1,
            tokens: [
              {
                symbol: 'BOBA',
                decimals: 18,
                address: '0x0000000000000000000000000000000000000006',
                addressL2: '0x0000000000000000000000000000000000000032',
              },
            ],
          },
        })
        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (teleportationService.getTeleportationAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgingService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'teleportationAddr',
          undefined,
        ])
        expect(actions).toEqual([
          {
            type: 'UI/MODAL/OPEN',
            payload: 'bridgeInProgress',
            token: undefined,
            fast: undefined,
            tokenIndex: undefined,
            lock: undefined,
            proposalId: undefined,
            selectionLayer: undefined,
            destNetworkSelection: undefined,
          },
          { type: 'APPROVE/CREATE/REQUEST' },
          {
            type: 'UI/ERROR/UPDATE',
            payload: 'Failed to approve amount or user rejected signature',
          },
          { type: 'UI/MODAL/CLOSE', payload: 'bridgeInProgress' },
        ])
      })
    })
  })
})
