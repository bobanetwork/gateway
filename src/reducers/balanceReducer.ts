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

interface IBalanceReducerState {
  layer1: []
  layer2: []
  classicExitCost: string
  fastDepositBatchCost: string
  l2BalanceETH: number
  l2BalanceBOBA: number
  exitFee: string
}

const initialState: IBalanceReducerState = {
  layer1: [],
  layer2: [],
  classicExitCost: '',
  fastDepositBatchCost: '',
  l2BalanceETH: 0,
  l2BalanceBOBA: 0,
  exitFee: '',
}

const balanceReducer = (state: IBalanceReducerState = initialState, action) => {
  switch (action.type) {
    case 'BALANCE/GET/SUCCESS':
      const { layer1, layer2 } = action.payload
      console.log(`layer2`, layer2)
      console.log(`layer1`, layer1)
      return {
        ...state,
        layer1,
        layer2,
      }
    case 'FETCH/CLASSICEXIT/COST/SUCCESS':
      return {
        ...state,
        classicExitCost: action.payload,
      }
    case 'FETCH/L2ETH/BALANCE/SUCCESS':
      return {
        ...state,
        l2BalanceETH: Number(action.payload),
      }
    case 'FETCH/L2BOBA/BALANCE/SUCCESS':
      return {
        ...state,
        l2BalanceBOBA: Number(action.payload),
      }
    case 'FETCH/EXITFEE/SUCCESS':
      return {
        ...state,
        exitFee: action.payload,
      }
    case 'BALANCE/L1/RESET':
      return {
        ...state,
        l2FeeBalance: '',
        l2BalanceETH: 0,
        l2BalanceBOBA: 0,
        exitFee: '',
      }
    default:
      return state
  }
}

export default balanceReducer
