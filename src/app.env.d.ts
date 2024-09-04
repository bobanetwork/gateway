/// <reference types="react-scripts" />
import type { MetaMaskInpageProvider } from '@metamask/providers'
import { ExternalProvider } from '@ethersproject/providers'

declare global {
  interface Window {
    ethereum?: ExternalProvider | MetaMaskInpageProvider
    gatewallet?: ExternalProvider | MetaMaskInpageProvider
  }
}
