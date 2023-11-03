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

const initialState = {
  layer1: [],
  layer2: [],
  l2FeeRate: {},
  l2ETHFeeRateN: {},
  classicExitCost: '',
  altL1DepositCost: '',
  l2BalanceETH: 0,
  l2BalanceBOBA: 0,
  l2lpETHLiquidity: '',
  gas: {},
  userAndL2LPBlanceBatch: {},
  exitFee: '',
}

function balanceReducer(state = initialState, action) {
  switch (action.type) {
    case 'BALANCE/GET/SUCCESS':
      const { layer1, layer2 } = action.payload
      return {
        ...state,
        layer1,
        layer2
      }
    case 'FETCH/L2FEERATE/ETH/SUCCESS':
      return {
        ...state,
        l2ETHFeeRateN: action.payload
      }
    case 'FETCH/FASTEXIT/COST/SUCCESS':
      return {
        ...state,
        fastExitCost: action.payload
      }
    case 'FETCH/CLASSICEXIT/COST/SUCCESS':
      return {
        ...state,
        classicExitCost: action.payload
      }
    case 'FETCH/ALTL1DEPOSIT/COST/SUCCESS':
      return {
        ...state,
        altL1DepositCost: action.payload
      }
    case 'FETCH/L2ETH/BALANCE/SUCCESS':
      return {
        ...state,
        l2BalanceETH: Number(action.payload)
      }
    case 'FETCH/L2BOBA/BALANCE/SUCCESS':
      return {
        ...state,
        l2BalanceBOBA: Number(action.payload)
      }
    case 'FETCH/USER/L2LP/BALANCE/BATCH/SUCCESS':
      return {
        ...state,
        userAndL2LPBlanceBatch: action.payload
      }
    case 'FETCH/EXITFEE/SUCCESS':
      return {
        ...state,
        exitFee: action.payload
      }
    case 'BALANCE/L1/RESET':
      return {
        ...state,
        l2BalanceETH: 0,
        l2BalanceBOBA: 0,
        exitFee: '',
      }
    case 'BALANCE/L2/RESET':
      return {
        ...state,
        l2FeeRate: ''
      }
    default:
      return state
  }
}

export default balanceReducer
