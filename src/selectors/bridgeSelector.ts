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

export const selectTokenToBridge = () => (state) => state.bridge.tokens?.[0]

export const selectBridgeType = () => (state) => state.bridge.bridgeType

export const selectDestChainIdTeleportation = () => (state) =>
  state.bridge?.destChainIdTeleportation

export const selectBridgeDestinationAddress = () => (state) =>
  state.bridge.bridgeDestinationAddress

export const selectBridgeDestinationAddressAvailable = () => (state) =>
  state.bridge.bridgeToAddressState

export const selectAmountToBridge = () => (state) => state.bridge.amountToBridge

export const selectBridgeAlerts = () => (state) => state.bridge.alerts

export const selectIsFetchTxBlockNumber = () => (state) =>
  state.bridge.isFetchTxBlockNumber

export const selectIsTeleportationOfAssetSupported = () => (state) =>
  state.bridge.isTeleportationOfAssetSupported

export const selectTeleportationDisburserBalance = () => (state) =>
  state.bridge.teleportationDisburserBalance

export const selectReenterWithdrawalConfig = () => (state) =>
  state.bridge.withdrawalConfig
