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

import networkService from 'services/networkService'
import { createAction } from './createAction'
import store from 'store'

export const setEnableAccount = (enabled) => (dispatch) =>
  dispatch({ type: 'SETUP/ACCOUNT/SET', payload: enabled })

export const setBaseState = (enabled) => (dispatch) =>
  dispatch({ type: 'SETUP/BASE/SET', payload: enabled })

export const setLayer = (layer) => (dispatch) =>
  dispatch({ type: 'SETUP/LAYER/SET', payload: layer })

export const setWalletAddress = (account) => (dispatch) =>
  dispatch({ type: 'SETUP/WALLETADDRESS/SET', payload: account })

export const switchFee = (targetFee) =>
  createAction('SETUP/SWITCHFEE', () => networkService.switchFee(targetFee))

export const doSwapToken = () =>
  createAction('SETUP/GETETH', () => networkService.swapToken())

export const addBobaFee = async (bobaFee) => {
  store.dispatch({ type: 'BOBAFEE/ADD/SUCCESS', payload: bobaFee })
}

export const setConnectETH = (state) => (dispatch) =>
  dispatch({ type: 'SETUP/CONNECT_ETH', payload: state })

export const setConnectBOBA = (state) => (dispatch) =>
  dispatch({ type: 'SETUP/CONNECT_BOBA', payload: state })

export const setConnect = (state) => (dispatch) =>
  dispatch({ type: 'SETUP/CONNECT', payload: state })

export const setChainIdChanged = (state) => (dispatch) =>
  dispatch({ type: 'SETUP/CHAINIDCHANGED/SET', payload: state })

export const disconnectSetup = () => (dispatch) =>
  dispatch({ type: 'SETUP/DISCONNECT' })
