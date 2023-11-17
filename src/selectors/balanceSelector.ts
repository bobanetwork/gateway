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

export const selectlayer1Balance = (state) => state.balance.layer1

export const selectlayer2Balance = (state) => state.balance.layer2

export const selectL1LPBalanceString = (state) =>
  state.balance.l1LpBalanceWeiString

export const selectL2LPBalanceString = (state) =>
  state.balance.l2LpBalanceWeiString

export const selectL1LPPendingString = (state) =>
  state.balance.l1LpPendingWeiString

export const selectL2LPPendingString = (state) =>
  state.balance.l2LpPendingWeiString

export const selectL1LPLiquidity = (state) => state.balance.l1lpLiquidity

export const selectL2LPLiquidity = (state) => state.balance.l2lpLiquidity

export const selectL1FeeRateN = (state) => state.balance.l1FeeRateN

export const selectL2FeeRateN = (state) => state.balance.l2FeeRateN

export const selectFastExitCost = (state) => state.balance.fastExitCost

export const selectClassicExitCost = (state) => state.balance.classicExitCost

export const selectFastDepositCost = (state) => state.balance.fastDepositCost

export const selectL1FeeBalance = (state) => state.balance.l1FeeBalance

export const selectL2BalanceETH = (state) => state.balance.l2BalanceETH

export const selectL2BalanceBOBA = (state) => state.balance.l2BalanceBOBA

export const selectExitFee = (state) => state.balance.exitFee

export const selectBalance = () => (state) => state.balance
