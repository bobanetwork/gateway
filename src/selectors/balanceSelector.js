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

export function selectlayer1Balance (state) {
  return state.balance.layer1
}

export function selectlayer2Balance (state) {
  return state.balance.layer2
}

export function selectAccountData (state) {
  return state.balance.accountData
}

export function selectL1LPLiquidity (state) {
  return state.balance.l1lpLiquidity
}

export function selectL2LPLiquidity (state) {
  return state.balance.l2lpLiquidity
}

export function selectL1FeeRate (state) {
  return state.balance.l1FeeRate
}

export function selectL2FeeRate (state) {
  return state.balance.l2FeeRate
}

export function selectL1FeeRateN (state) {
  return state.balance.l1FeeRateN
}

export function selectL2FeeRateN (state) {
  return state.balance.l2FeeRateN
}

export function selectFastExitCost (state) {
  return state.balance.fastExitCost
}

export function selectClassicExitCost (state) {
  return state.balance.classicExitCost
}

export function selectAltL1DepositCost(state) {
  return state.balance.altL1DepositCost
}

export function selectL1FeeBalance (state) {
  return state.balance.l1FeeBalance
}

export function selectL2BalanceETH (state) {
  return state.balance.l2BalanceETH
}

export function selectL2BalanceBOBA (state) {
  return state.balance.l2BalanceBOBA
}

export function selectUserAndL2LPBalanceBatch (state) {
  return state.balance.userAndL2LPBlanceBatch
}

export function selectExitFee (state) {
  return state.balance.exitFee
}

export const selectBalance = () => (state) => state.balance

