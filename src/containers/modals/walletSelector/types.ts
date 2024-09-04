export interface WalletInterface {
  onClick: () => void
  iconSrc: string
  title: string
  showArrow?: boolean
  testid: string
}

export type WalletType = 'metamask' | 'walletconnect' | 'gatewallet'
