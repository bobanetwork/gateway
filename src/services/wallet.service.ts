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
  walletType: 'metamask' | 'walletconnect' | null = null
  userTriggeredSwitchChain: boolean = false
  networkId: number = 1

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
        if (!this.userTriggeredSwitchChain) {
          store.dispatch({
            type: 'SETUP/CHAINIDCHANGED/SET',
            payload: Number(chainId),
          })
        } else {
          store.dispatch({
            type: 'SETUP/USER_TRIGGERED_CHAIN_SWITCH/SET',
            payload: true,
          })
        }
        this.userTriggeredSwitchChain = false
        this.networkId = chainId
      } else {
        store.dispatch(openModal('UnsupportedNetwork'))
      }
    })
  }

  async addTokenToMetaMask(token: any) {
    const { address, symbol, decimals, logoURI, chain } = token
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image: logoURI,
            chainId: chain,
          },
        },
      })
      return true
    } catch (error) {
      console.log(`Error adding token to MM: ${error}`)
      return false
    }
  }

  // wallet connect functions

  async connectWalletConnect() {
    try {
      this.walletConnectProvider = await EthereumProvider.init({
        projectId: WC_PROJECT_ID as string,
        showQrModal: true,
        chains: [networkService.networkConfig['L1'].chainId],
        optionalChains: [1, 5, 56, 97], // only ETH, BNB (mainnet/testnet)
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

    this.walletConnectProvider.on('disconnect', (res: any) => {
      store.dispatch(disconnectSetup())
      this.resetValues()
    })

    this.walletConnectProvider.on('chainChanged', (chainId) => {
      store.dispatch({ type: 'SETUP/CHAINIDCHANGED/SET', payload: chainId })
    })
  }

  // switching chain
  async switchChain(chainId: any, chainInfo: any) {
    const provider =
      this.walletType === 'metamask'
        ? window.ethereum
        : this.walletConnectProvider
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      return true
    } catch (error: any) {
      if (error.code === 4902 || this.walletType === 'walletconnect') {
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
          console.log(`Error adding chain: ${addError}`)
          return false
        }
      } else {
        console.log(`Error switching chain: ${error?.message}`)
        return false
      }
    }
  }

  // trigger connect to MM / WC

  async connect(type: 'metamask' | 'walletconnect') {
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
    if (this.walletType === 'metamask') {
      this.listenToMetaMask()
    }
    if (this.walletType === 'walletconnect') {
      this.listenWalletConnect()
    }
  }

  resetValues(): void {
    this.walletConnectProvider = null
    this.provider = null
    this.account = ''
    this.walletType = null
    store.dispatch({ type: 'SETUP/CHAINIDCHANGED/RESET' })
  }
}

const walletService = new WalletService()

export default walletService
