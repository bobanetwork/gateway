/* eslint-disable quotes */
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

import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { providers, utils } from 'ethers'

import {
  disconnectSetup,
  setBaseState,
  setEnableAccount,
} from 'actions/setupAction'
import { openModal } from 'actions/uiAction'
import store from 'store'
import { CHAIN_ID_LIST } from 'util/network/network.util'
import networkService from './networkService'
import { WC_PROJECT_ID } from 'util/constant'

export class WalletService {
  provider: any
  walletConnectProvider: any
  account: string = ''
  walletType: 'metamask' | 'walletconnect' | 'gatewallet' | null = null
  userTriggeredSwitchChain: boolean = false
  networkId: number = 1

  // Gate wallet functions.
  async connectToGateWallet() {
    try {
      await window.gatewallet.request({ method: 'eth_requestAccounts' })
      this.provider = new providers.Web3Provider(window.gatewallet, 'any')
      this.account = await this.provider.getSigner().getAddress()
      this.walletType = 'gatewallet'
      const network = await this.provider.getNetwork()
      console.log(`data`, {
        provider: this.provider,
        account: this.account,
        network,
      })
      this.networkId = network.chainId
      return true
    } catch (e) {
      console.log(`Error connecting to gatewallet: ${e}`)
      return false
    }
  }

  async disconnectGateWallet() {
    try {
      await window.gatewallet.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
      return true
    } catch (e) {
      console.log(`Error disconnecting wallet: ${e}`)
      return false
    }
  }

  async listenToGateWallet() {
    window.gatewallet.on('accountsChanged', () => {
      //reset connection
      store.dispatch(setBaseState(false))
      store.dispatch(setEnableAccount(false))
      window.location.reload()
    })

    window.gatewallet.on('chainChanged', (chainId) => {
      if (this.networkId === chainId) {
        return
      }
      if (CHAIN_ID_LIST[Number(chainId)]) {
        if (this.userTriggeredSwitchChain) {
          store.dispatch({
            type: 'SETUP/USER_TRIGGERED_CHAIN_SWITCH/SET',
            payload: true,
          })
        } else {
          store.dispatch({
            type: 'SETUP/CHAINIDCHANGED/SET',
            payload: Number(chainId),
          })
        }
        this.userTriggeredSwitchChain = false
        this.networkId = chainId
      } else {
        store.dispatch(openModal({ modal: 'UnsupportedNetwork' }))
      }
    })
  }

  // meta mask functions

  async connectToMetaMask() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.provider = new providers.Web3Provider(window.ethereum, 'any')
      this.account = await this.provider.getSigner().getAddress()
      this.walletType = 'metamask'
      const network = await this.provider.getNetwork()
      this.networkId = network.chainId
      return true
    } catch (e) {
      console.log(`Error connecting to metamask: ${e}`)
      return false
    }
  }

  async disconnectMetaMask() {
    try {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
      return true
    } catch (e) {
      console.log(`Error disconnecting wallet: ${e}`)
      return false
    }
  }

  async listenToMetaMask() {
    window.ethereum.on('accountsChanged', () => {
      //reset connection
      store.dispatch(setBaseState(false))
      store.dispatch(setEnableAccount(false))
      window.location.reload()
    })

    window.ethereum.on('chainChanged', (chainId) => {
      if (this.networkId === chainId) {
        return
      }
      if (CHAIN_ID_LIST[Number(chainId)]) {
        if (this.userTriggeredSwitchChain) {
          store.dispatch({
            type: 'SETUP/USER_TRIGGERED_CHAIN_SWITCH/SET',
            payload: true,
          })
        } else {
          store.dispatch({
            type: 'SETUP/CHAINIDCHANGED/SET',
            payload: Number(chainId),
          })
        }
        this.userTriggeredSwitchChain = false
        this.networkId = chainId
      } else {
        store.dispatch(openModal({ modal: 'UnsupportedNetwork' }))
      }
    })
  }

  // wallet connect functions

  async connectWalletConnect() {
    try {
      this.walletConnectProvider = await EthereumProvider.init({
        projectId: WC_PROJECT_ID as string,
        showQrModal: true,
        chains: [networkService.networkConfig!['L1'].chainId],
        optionalChains: [1, 5, 56, 97], // only ETH, BNB (mainnet/testnet),
        metadata: {
          name: 'Boba Gateway',
          url: 'https://gateway.boba.network',
          description:
            'Boba Gateway - Boba Network Gateway, facilitating effortless token bridging between Layer 1 (L1) and Layer 2 (L2) networks, featuring Staking, DAO, and Earn functionalities.',
          icons: ['https://gateway.boba.network/favicon.png'],
        },
      })
      await this.walletConnectProvider.connect()
      this.provider = new providers.Web3Provider(
        this.walletConnectProvider,
        'any'
      )
      this.account = await this.provider.getSigner().getAddress()
      this.walletType = 'walletconnect'
      return true
    } catch (e) {
      console.log(`Error connecting WalletConnect: ${e}`)
      return false
    }
  }

  async disconnectWalletConnect() {
    try {
      await this.walletConnectProvider.disconnect()
      return true
    } catch (e) {
      console.log(`Error Disconnect WalletConnect: ${e}`)
      return false
    }
  }

  async listenWalletConnect() {
    this.walletConnectProvider.on('accountsChanged', (accounts) => {
      if (
        utils.getAddress(this.account as string) !==
        utils.getAddress(accounts[0])
      ) {
        window.location.reload()
      }
    })

    this.walletConnectProvider.on('disconnect', () => {
      store.dispatch(disconnectSetup())
      this.resetValues()
    })

    this.walletConnectProvider.on('chainChanged', (chainId) => {
      store.dispatch({ type: 'SETUP/CHAINIDCHANGED/SET', payload: chainId })
    })
  }

  // switching chain
  async switchChain(chainId: any, chainInfo: any) {
    this.userTriggeredSwitchChain = true
    let provider
    if (this.walletType === 'metamask') {
      provider = window.ethereum
    } else if (this.walletType === 'gatewallet') {
      provider = window.gatewallet
    } else {
      provider = this.walletConnectProvider
    }

    if (!provider) {
      return false
    }

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      return true
    } catch (error: any) {
      if (
        error.code === 4902 ||
        error.code === 4001 ||
        this.walletType === 'walletconnect'
      ) {
        try {
          if (this.walletType === 'walletconnect') {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }],
            })
          } else {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [chainInfo, this.account],
            })
          }
          return true
        } catch (addError) {
          console.log(`Error adding chain:`, addError)
          return false
        }
      } else {
        console.log(`Error switching chain:`, error)
        return false
      }
    }
  }

  // trigger connect to MM / WC

  async connect(type: 'metamask' | 'walletconnect' | 'gatewallet') {
    if (type === 'gatewallet') {
      return this.connectToGateWallet()
    }
    if (type === 'metamask') {
      return this.connectToMetaMask()
    }
    if (type === 'walletconnect') {
      return this.connectWalletConnect()
    }
  }

  // trigger disconnect from MM / WC
  async disconnect() {
    let result = false
    if (this.walletType === 'metamask') {
      result = await this.disconnectMetaMask()
    } else if (this.walletType === 'walletconnect') {
      result = await this.disconnectWalletConnect()
    }
    this.resetValues()
    return result
  }

  bindProviderListeners(): void {
    if (this.walletType === 'gatewallet') {
      this.listenToGateWallet()
    }
    if (this.walletType === 'metamask') {
      this.listenToMetaMask()
    }
    if (this.walletType === 'walletconnect') {
      this.listenWalletConnect()
    }
  }

  resetValues(): void {
    this.walletConnectProvider = null
    this.provider = undefined
    this.account = ''
    this.walletType = null
    store.dispatch({ type: 'SETUP/CHAINIDCHANGED/RESET' })
  }
}

const walletService = new WalletService()

export default walletService
