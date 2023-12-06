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

import networkService, { EPoolLayer } from 'services/networkService'
import transactionService from 'services/transaction.service'
import { createAction } from './createAction'
import { BigNumberish } from 'ethers'

export const fetchBalances = () =>
  createAction('BALANCE/GET', () => networkService.getBalances())

export const addTokenList = () =>
  createAction('TOKENLIST/GET', () => networkService.addTokenList())

export const fetchTransactions = () =>
  createAction('TRANSACTION/GETALL', () => transactionService.getTransactions())

export const fetchSevens = () =>
  createAction('SEVENS/GETALL', () => transactionService.getSevens())

export const fetchFastExits = () =>
  createAction('FASTEXITS/GETALL', () => transactionService.getFastExits())

export const exitBOBA = (token: string, value: BigNumberish) =>
  createAction('EXIT/CREATE', () => networkService.exitBOBA(token, value))

//SWAP RELATED
export const depositL1LP = (currency: string, value: BigNumberish) =>
  createAction('DEPOSIT/CREATE', () =>
    networkService.depositL1LP(currency, value)
  )

export const isTeleportationOfAssetSupported = (
  layer: string,
  asset: string,
  destChainId: string
) =>
  createAction('DEPOSIT/TELEPORTATION/TOKEN_SUPPORTED', () =>
    networkService.isTeleportationOfAssetSupported(layer, asset, destChainId)
  )

export const depositWithLightBridge = (
  layer: string,
  currency: string,
  value: BigNumberish,
  destChainId: BigNumberish
) =>
  createAction('DEPOSIT/CREATE', () =>
    networkService.depositWithTeleporter(layer, currency, value, destChainId)
  )

//SWAP RELATED - Depositing into the L2LP triggers the swap-exit
export const depositL2LP = (token: string, value: BigNumberish) =>
  createAction('EXIT/CREATE', () => networkService.depositL2LP(token, value))

//CLASSIC DEPOSIT ETH
export const depositETHL2 = (payload) =>
  createAction('DEPOSIT/CREATE', () => {
    return networkService.depositETHL2(payload)
  })

//DEPOSIT ERC20
export const depositErc20 = (payload) =>
  createAction('DEPOSIT/CREATE', () => networkService.depositErc20(payload))

// FIXME: move this earn related actions.
export const getReward = (
  currencyAddress: string,
  value_Wei_String: BigNumberish,
  L1orL2Pool: EPoolLayer
) =>
  createAction('EARN/HARVEST', () =>
    networkService.getReward(currencyAddress, value_Wei_String, L1orL2Pool)
  )

export const withdrawLiquidity = (
  currencyAddress: string,
  value_Wei_String: string,
  L1orL2Pool: EPoolLayer
) =>
  createAction('EARN/WITHDRAW', () =>
    networkService.withdrawLiquidity(
      currencyAddress,
      value_Wei_String,
      L1orL2Pool
    )
  )

export const approveERC20 = (
  value: BigNumberish,
  currency: string,
  approveContractAddress: string,
  contractABI?
) =>
  createAction('APPROVE/CREATE', () =>
    networkService.approveERC20(
      value,
      currency,
      approveContractAddress,
      contractABI
    )
  )

export const transfer = (
  recipient: string,
  value: BigNumberish,
  currency: string
) =>
  createAction('TRANSFER/CREATE', () =>
    networkService.transfer(recipient, value, currency)
  )

export const fetchLookUpPrice = (params) =>
  createAction('PRICE/GET', () => networkService.fetchLookUpPrice(params))

export const clearLookupPrice = () => (dispatch) =>
  dispatch({ type: 'LOOKUP/PRICE/CLEAR' })

export const getAllAddresses = () =>
  createAction('GET/ALL/ADDRESS', () => networkService.getAllAddresses())

/********************************/
/******ONE GATEWAY ACTIONS *****/
/********************************/
/**
 * @param payload: {network: ethereum, bnb, networkType
 * @param networkType:  MAINNET, TESTNET
 */
export const setNetwork = (payload) => (dispatch) =>
  dispatch({ type: 'NETWORK/SET', payload })

// to update the active network.
export const setActiveNetwork = () => (dispatch) =>
  dispatch({ type: 'NETWORK/SET/ACTIVE' })

export const setActiveNetworkType = (payload) => (dispatch) =>
  dispatch({ type: 'NETWORK/SET_TYPE/ACTIVE', payload })
