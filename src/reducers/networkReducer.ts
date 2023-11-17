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

import { Network, NetworkType } from 'util/network/network.util'

/**
 * network : ethereum, bnb
 * networkType : mainnet, testnet.
 **/

/**
 * NOTE:
 * 3. enable switch once selected !== current.
 * 4. on selection dispatch event.
 * 5. on switch click dispatch event. and reload.
 */

interface INetworkReducerState {
  network: Network
  networkIcon: string
  networkType: NetworkType
  name: {}
  activeNetworkIcon: string
  activeNetwork: Network
  activeNetworkType: NetworkType
  activeNetworkName: {}
}

const initialState: INetworkReducerState = {
  network: Network.ETHEREUM,
  networkIcon: 'ethereum',
  networkType: NetworkType.MAINNET,
  name: {},
  activeNetworkIcon: 'ethereum',
  activeNetwork: Network.ETHEREUM,
  activeNetworkType: NetworkType.MAINNET,
  activeNetworkName: {},
}

const networkReducer = (state: INetworkReducerState = initialState, action) => {
  switch (action.type) {
    case 'NETWORK/SET': {
      const { network, networkType, networkIcon, chainIds, name } =
        action.payload
      return {
        ...state,
        network,
        chainIds,
        networkIcon,
        networkType,
        name,
      }
    }
    case 'NETWORK/SET_TYPE/ACTIVE': {
      const { networkType } = action.payload
      return {
        ...state,
        networkType,
        activeNetworkType: networkType,
      }
    }
    case 'NETWORK/SET/ACTIVE': {
      const {
        network: activeNetwork,
        // networkType: activeNetworkType,
        networkIcon: activeNetworkIcon,
        name: activeNetworkName,
      } = state
      return {
        ...state,
        activeNetwork,
        // activeNetworkType,
        activeNetworkIcon,
        activeNetworkName,
      }
    }
    default:
      return state
  }
}

export default networkReducer
