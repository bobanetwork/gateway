/* eslint-disable */

import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { mockedInitialState } from 'util/tests'

import networkService from 'services/networkService'
import { lightBridgeService } from 'services/teleportation.service'

import { bridgeService } from 'services'
import useBridge from '.'

jest.mock('services/bridge/bridge.services', () => {
  return {
    anchorageDepositERC20: jest.fn(),
  }
})

jest.mock('services/teleportation.service', () => {
  return {
    deposit: jest.fn(),
    getLightBridgeAddress: jest.fn(),
  }
})

jest.mock('services/networkService', () => {
  return {
    getAllAddresses: jest.fn(),
    approveERC20: jest.fn(),
    depositErc20: jest.fn(),
    depositETHL2: jest.fn(),
    exitBOBA: jest.fn(),
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
      network: {
        ...mockedInitialState.network,
        activeNetwork: 'BNB',
      },
      bridge: {
        ...mockedInitialState.bridge,
        destChainIdTeleportation: 0,
        bridgeType: 'LIGHT',
      },
    })

    renderHook(() => useBridge(), { wrapper })

    expect(console.error).toHaveBeenCalled()

    const actions = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/ERROR/UPDATE',
      payload: 'Failed to get destination chain id',
    })
  })

  describe('Layer 1', () => {
    xdescribe('Classic Bridge', () => {
      beforeEach(() => {
        ;(networkService.depositETHL2 as jest.Mock).mockResolvedValue({
          message: 'success!',
        })
        ;(networkService.depositErc20 as jest.Mock).mockResolvedValue({
          message: 'success!',
        })
        ;(bridgeService.anchorageDepositERC20 as jest.Mock).mockResolvedValue({
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
        store = mockStore({
          ...store,
          network: {
            ...store.network,
            activeNetwork: 'BNB',
          },
        })

        const { result } = renderHook(() => useBridge(), { wrapper })

        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect(
          (networkService.depositETHL2 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.depositETHL2 as jest.Mock).mock.calls[0][0]
        ).toEqual({ recipient: '', value_Wei_String: '1255000000000000000' })

        expect(actions).toEqual(successActionsClassic)
      })

      test('should trigger depositETHL2 correctly with reciepent address', async () => {
        store = mockStore({
          ...store,
          network: {
            ...store.network,
            activeNetwork: 'BNB',
          },
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
          (networkService.depositETHL2 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.depositETHL2 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          recipient: '0xcRECEIPENTTOADDRESS',
          value_Wei_String: '1255000000000000000',
        })
        expect(actions).toEqual(successActionsClassic)
      })

      test('should invoke depositErc20 correctly and reset state on success', async () => {
        store = mockStore({
          ...store,
          network: {
            ...store.network,
            activeNetwork: 'BNB',
          },
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
          (networkService.depositErc20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.depositErc20 as jest.Mock).mock.calls[0][0]
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
          network: {
            ...store.network,
            activeNetwork: 'BNB',
          },
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
          (networkService.depositErc20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.depositErc20 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          currency: '0x0000000000000000000000000000000000000006',
          currencyL2: '0x0000000000000000000000000000000000000032',
          recipient: '0xcRECEIPENTTOADDRESS',
          value_Wei_String: '1255000000000000000',
        })
        expect(actions).toEqual(successActionsClassic)
      })

      test('should invoke anchorageDepositERC20 correctly and reset state on success', async () => {
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
          (bridgeService.anchorageDepositERC20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgeService.anchorageDepositERC20 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          recipient: '',
          L1DepositAmountWei: '1255000000000000000',
          currency: '0x0000000000000000000000000000000000000006',
          currencyL2: '0x0000000000000000000000000000000000000032',
        })
        expect(prevActions).toEqual(successActionsClassic)
      })

      test('should trigger anchorageDepositERC20 correctly with reciepent address', async () => {
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
          (bridgeService.anchorageDepositERC20 as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (bridgeService.anchorageDepositERC20 as jest.Mock).mock.calls[0][0]
        ).toEqual({
          currency: '0x0000000000000000000000000000000000000006',
          currencyL2: '0x0000000000000000000000000000000000000032',
          recipient: '0xcRECEIPENTTOADDRESS',
          L1DepositAmountWei: '1255000000000000000',
        })

        expect(actions).toEqual(successActionsClassic)
      })
    })

    xdescribe('Light Bridge Teleporter', () => {
      beforeEach(() => {
        ;(
          lightBridgeService.getLightBridgeAddress as jest.Mock
        ).mockReturnValue({
          lightBridgeAddr: 'lightBridgeAddr',
        })
        ;(networkService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(lightBridgeService.deposit as jest.Mock).mockResolvedValue({
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
        expect((lightBridgeService.deposit as jest.Mock).mock.calls[0]).toEqual(
          [
            'L1',
            '0x0000000000000000000000000000000000000000',
            '1255000000000000000',
            'ethereum',
          ]
        )
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
          (lightBridgeService.getLightBridgeAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'lightBridgeAddr',
          undefined,
        ])
        expect(actions).toEqual(successActionsFast)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly, trigger actions on error', async () => {
        ;(networkService.approveERC20 as jest.Mock).mockRejectedValue(true)
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
          (lightBridgeService.getLightBridgeAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'lightBridgeAddr',
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
      ;(networkService.exitBOBA as jest.Mock).mockResolvedValue({
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
      // @note enable test once anchorage based exit enabled.
      xtest('should trigger exitBoba correctly and reset state on success', async () => {
        store = mockStore(store)
        const { result } = renderHook(() => useBridge(), { wrapper })
        let actions = store.getActions()
        await result.current.triggerSubmit()
        expect((networkService.exitBOBA as jest.Mock).mock.calls).toHaveLength(
          1
        )
        expect((networkService.exitBOBA as jest.Mock).mock.calls[0]).toEqual([
          '0x0000000000000000000000000000000000000000',
          '1255000000000000000',
        ])
        expect(actions).toEqual([
          {
            destNetworkSelection: undefined,
            fast: undefined,
            lock: undefined,
            payload: 'bridgeInProgress',
            proposalId: undefined,
            selectionLayer: undefined,
            token: undefined,
            tokenIndex: undefined,
            type: 'UI/MODAL/OPEN',
          },
          {
            type: 'EXIT/CREATE/REQUEST',
          },
          {
            payload: 'bridgeInProgress',
            type: 'UI/MODAL/CLOSE',
          },
        ])
      })
    })
    xdescribe('Light Bridge Teleporter', () => {
      beforeEach(() => {
        ;(
          lightBridgeService.getLightBridgeAddress as jest.Mock
        ).mockReturnValue({
          lightBridgeAddr: 'lightBridgeAddr',
        })
        ;(networkService.approveERC20 as jest.Mock).mockResolvedValue(true)
        ;(lightBridgeService.deposit as jest.Mock).mockResolvedValue({
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
        expect((lightBridgeService.deposit as jest.Mock).mock.calls[0]).toEqual(
          [
            'L2',
            '0x0000000000000000000000000000000000000000',
            '1255000000000000000',
            'ethereum',
          ]
        )
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
          (lightBridgeService.getLightBridgeAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'lightBridgeAddr',
          undefined,
        ])
        expect(actions).toEqual(successActionsFast)
      })
      test('should trigger  approveERC20 and depositWithTeleporter correctly, trigger actions on error', async () => {
        ;(networkService.approveERC20 as jest.Mock).mockRejectedValue(true)
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
          (lightBridgeService.getLightBridgeAddress as jest.Mock).mock.calls
        ).toHaveLength(1)
        expect(
          (networkService.approveERC20 as jest.Mock).mock.calls[0]
        ).toEqual([
          '1255000000000000000',
          '0x0000000000000000000000000000000000000006',
          'lightBridgeAddr',
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
