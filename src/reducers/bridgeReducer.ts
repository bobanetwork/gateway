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

import { BigNumberish } from 'ethers'
import { IBridgeAltert } from '../actions/bridgeAction'

type Token = {
  symbol: string
  decimals: number
  address: string
  addressL2: string
  amount?: BigNumberish
  toWei_String?: BigNumberish
}

interface IBridgeReducerState {
  tokens: Token[]
  bridgeType: string
  destChainIdTeleportation?: number
  multiBridgeMode: boolean
  bridgeToAddressState: boolean
  bridgeDestinationAddress: string
  amountToBridge: number
  destChainIdBridge: number
  isFetchTxBlockNumber: boolean
  teleportationDisburserBalance: BigNumberish
  isTeleportationOfAssetSupported: {
    supported: boolean
    minDepositAmount: number
    maxDepositAmount: number
    maxTransferAmountPerDay: number
    transferTimestampCheckPoint: number
    transferredAmount: number
  }
  withdrawalConfig: any // TODO type once finalized
  alerts: IBridgeAltert[]
}

const initialState: IBridgeReducerState = {
  tokens: [],
  bridgeType: 'CLASSIC',
  destChainIdTeleportation: undefined,
  multiBridgeMode: false,
  bridgeToAddressState: false,
  bridgeDestinationAddress: '',
  amountToBridge: 0,
  destChainIdBridge: 0,
  isFetchTxBlockNumber: false,
  teleportationDisburserBalance: 0,
  isTeleportationOfAssetSupported: {
    supported: false,
    minDepositAmount: 0,
    maxDepositAmount: 0,
    maxTransferAmountPerDay: 0,
    transferTimestampCheckPoint: 0,
    transferredAmount: 0,
  },
  withdrawalConfig: null,
  alerts: [],
}

const bridgeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'BRIDGE/TYPE/SELECT':
      return {
        ...state,
        bridgeType: action.payload,
      }

    case 'BRIDGE/TOKEN/RESET':
      return {
        ...state,
        tokens: [],
        multiBridgeMode: false,
      }

    case 'BRIDGE/TOKEN/SELECT':
      return {
        ...state,
        tokens: [
          ...state.tokens,
          {
            ...action.payload,
            amount: 0,
            toWei_String: 0,
          },
        ],
      }

    case 'BRIDGE/TOKEN/UPDATE': {
      const newTokens = [...state.tokens]
      const { token, tokenIndex } = action.payload
      newTokens[tokenIndex] = {
        ...token,
        amount: 0,
        toWei_String: 0,
      }

      return { ...state, tokens: newTokens }
    }

    case 'BRIDGE/TOKEN/REMOVE': {
      const tokens = [...state.tokens]
      tokens.splice(action.payload, 1)

      return { ...state, tokens }
    }

    case 'BRIDGE/MODE/CHANGE':
      return { ...state, multiBridgeMode: action.payload }

    case 'BRIDGE/DESTINATION_ADDRESS/SET':
      return {
        ...state,
        bridgeDestinationAddress: action.payload,
      }

    case 'BRIDGE/DESTINATION_ADDRESS/RESET':
      return {
        ...state,
        bridgeDestinationAddress: '',
      }

    case 'BRIDGE/DESTINATION_ADDRESS_AVAILABLE/SET':
      return {
        ...state,
        bridgeToAddressState: action.payload,
      }

    case 'BRIDGE/TOKEN/AMOUNT/CHANGE': {
      const newTokens = [...state.tokens]
      const { index, amount, toWei_String } = action.payload
      newTokens[index] = {
        ...newTokens[index],
        amount,
        toWei_String,
      }
      return { ...state, tokens: newTokens }
    }

    case 'BRIDGE/ALERT/SET': {
      const isFound = state.alerts.find(
        (alert) => alert.meta === action.payload.meta
      )
      if (state.alerts.length && isFound) {
        return { ...state }
      }

      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      }
    }

    case 'BRIDGE/ALERT/CLEAR': {
      const filterAlerts = state.alerts.filter(
        (alert) => !action.payload.keys.includes(alert.meta)
      )
      return { ...state, alerts: filterAlerts }
    }

    case 'BRIDGE/ALERT/PURGE': {
      return { ...state, alerts: [] }
    }

    case 'BRIDGE/AMOUNT/SET': {
      return { ...state, amountToBridge: action.payload }
    }
    case 'BRIDGE/AMOUNT/RESET': {
      return { ...state, amountToBridge: 0 }
    }
    case 'BRIDGE/DEPOSIT_TX/BLOCK': {
      return { ...state, isFetchTxBlockNumber: action.payload }
    }
    case 'BRIDGE/TELEPORTER/TOKEN_SUPPORTED': {
      return { ...state, isTeleportationOfAssetSupported: action.payload }
    }

    case 'BRIDGE/TELEPORTER/DEST_CHAIN_ID':
      return {
        ...state,
        destChainIdTeleportation: action.payload,
      }

    case 'BRIDGE/REENTER/WITHDRAWAL': {
      return {
        ...state,
        withdrawalConfig: action.payload,
      }
    }

    case 'DEPOSIT/TELEPORTATION/DISBURSER_BALANCE/SUCCESS': {
      return {
        ...state,
        teleportationDisburserBalance: action.payload,
      }
    }

    default:
      return state
  }
}

export default bridgeReducer
