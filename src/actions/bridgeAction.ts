/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import store from 'store'
import { BigNumberish } from 'ethers'
import { createAction } from './createAction'
import { bridgeService } from 'services'

export interface IBridgeAltert {
  meta: string
  type: string
  text: string
}

export const resetToken = () => (dispatch) =>
  dispatch({ type: 'BRIDGE/TOKEN/RESET' })

export const updateToken = (payload?) => (dispatch) =>
  dispatch({ type: 'BRIDGE/TOKEN/UPDATE', payload })

export const setBridgeType = (type) => (dispatch) =>
  dispatch({ type: 'BRIDGE/TYPE/SELECT', payload: type })

export const setBridgeDestinationAddress = (payload: string) => (dispatch) =>
  dispatch({
    type: 'BRIDGE/DESTINATION_ADDRESS/SET',
    payload,
  })

export const resetBridgeDestinationAddress = () => (dispatch) =>
  dispatch({ type: 'BRIDGE/DESTINATION_ADDRESS/RESET' })

// updates value indicating wether the 'to address' field should be available
export const setBridgeDestinationAddressAvailable =
  (payload: boolean) => (dispatch) =>
    dispatch({
      type: 'BRIDGE/DESTINATION_ADDRESS_AVAILABLE/SET',
      payload,
    })

export const setBridgeAlert = (payload: IBridgeAltert) => (dispatch) =>
  dispatch({ type: 'BRIDGE/ALERT/SET', payload })

export const clearBridgeAlert = (payload: { keys: string[] }) => (dispatch) =>
  dispatch({ type: 'BRIDGE/ALERT/CLEAR', payload })

export const purgeBridgeAlert = (payload?) => (dispatch) =>
  dispatch({ type: 'BRIDGE/ALERT/PURGE', payload })

export const setAmountToBridge = (payload?) => (dispatch) =>
  dispatch({ type: 'BRIDGE/AMOUNT/SET', payload })

export const resetBridgeAmount = () => (dispatch) =>
  dispatch({ type: 'BRIDGE/AMOUNT/RESET' })

export const setTeleportationOfAssetSupported =
  (payload: boolean) => (dispatch) =>
    dispatch({
      type: 'BRIDGE/TELEPORTER/TOKEN_SUPPORTED',
      payload,
    })

export const setTeleportationDisburserBalance =
  (payload: string) => (dispatch) =>
    dispatch({
      type: 'BRIDGE/TELEPORTER/DISBURSER_BALANCE',
      payload,
    })

export const setTeleportationDestChainId =
  (payload: BigNumberish) => (dispatch) =>
    dispatch({
      type: 'BRIDGE/TELEPORTER/DEST_CHAIN_ID',
      payload,
    })

export const setReenterWithdrawalConfig = (payload: any) => (dispatch) =>
  dispatch({
    type: 'BRIDGE/REENTER/WITHDRAWAL',
    payload,
  })

export const setFetchDepositTxBlock = (payload?) => {
  store.dispatch({ type: 'BRIDGE/DEPOSIT_TX/BLOCK', payload })
}

// bridging Actions

export const depositNativeAnchorage = (payload) =>
  createAction('DEPOSIT_ANCHORAGE/CREATE', () => {
    return bridgeService.anchorageDepositNative(payload)
  })

export const depositErc20Anchorage = (payload) =>
  createAction('DEPOSIT/CREATE', () =>
    bridgeService.anchorageDepositERC20(payload)
  )

export const depositErc20AnchorageOptimism = (payload) =>
  createAction('DEPOSIT/CREATE', () =>
    bridgeService.anchorageDepositERC20Optimism(payload)
  )

export const withdrawNativeTokenAnchorage = (payload) =>
  createAction('WITHDRAW_NATIVE_ANCHORAGE/CREATE', () => {
    return bridgeService.anchorageWithdrawNativeToken(payload)
  })

export const withdrawErc20TokenAnchorage = (payload) =>
  createAction('WITHDRAW_ERC20_ANCHORAGE/CREATE', () => {
    return bridgeService.anchorageWithdrawErc20Token(payload)
  })

export const handleProveWithdrawal = (payload) =>
  createAction('PROVE_WITHDRAWAL/CREATE', () => {
    return bridgeService.prooveTransactionWithdrawal(payload)
  })

export const claimWithdrawal = (payload) =>
  createAction('CLAIM_WITHDRAWAL/CREATE', () => {
    return bridgeService.finalizeTransactionWithdrawal(payload)
  })
