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

let allAddresses: any = {}
if (networkService?.addresses) {
  allAddresses = networkService.addresses
}

const initialState = {
  poolInfo: {
    L1LP: {},
    L2LP: {},
  },
  userInfo: {
    L1LP: {
      [allAddresses.L1_ETH_Address]: {},
    },
    L2LP: {
      [allAddresses.L2_ETH_Address]: {},
    },
  },
  stakeToken: {
    symbol: 'ETH',
    currency: allAddresses.L1_ETH_Address,
    LPAddress: allAddresses.L1LPAddress,
    L1orL2Pool: 'L1LP',
  },
  withdrawToken: {
    symbol: 'ETH',
    currency: allAddresses.L1_ETH_Address,
    LPAddress: allAddresses.L1LPAddress,
    L1orL2Pool: 'L1LP',
  },
  lpBalanceWeiString: '0',
  allAddresses: {},
  withdrawPayload: null,
}

const earnReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_EARNINFO':
      return state
    case 'GET_EARNINFO_SUCCESS':
      return {
        ...state,
        poolInfo: {
          L1LP: action.payload.L1PoolInfo,
          L2LP: action.payload.L2PoolInfo,
        },
        userInfo: {
          L1LP: action.payload.L1UserInfo,
          L2LP: action.payload.L2UserInfo,
        },
      }
    case 'UPDATE_STAKE_TOKEN':
      return {
        ...state,
        stakeToken: action.payload,
      }
    case 'UPDATE_WITHDRAW_TOKEN':
      return {
        ...state,
        withdrawToken: action.payload,
      }
    case 'UPDATE_WITHDRAW_PAYLOAD':
      return {
        ...state,
        withdrawPayload: action.payload,
      }
    case 'FETCH/L1LPBALANCE/SUCCESS':
    case 'FETCH/L2LPBALANCE/SUCCESS':
      return {
        ...state,
        lpBalanceWeiString: action.payload,
      }
    case 'GET/ALL/ADDRESS/SUCCESS':
      return {
        ...state,
        allAddresses: action.payload,
      }
    case 'GET/ALL/ADDRESS/ERROR':
      return {
        ...state,
        allAddresses: {},
      }
    case 'FETCH/L1LPBALANCE/ERROR':
    case 'FETCH/L2LPBALANCE/ERROR':
      return {
        ...state,
        lpBalanceWeiString: '0',
      }
    default:
      return state
  }
}

export default earnReducer
