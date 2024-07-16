import { generateAvatarURL } from '@cfx-kit/wallet-avatar'
import React from 'react'

import useDisconnect from 'hooks/useDisconnect'
import networkService from 'services/networkService'
import truncate from 'truncate-middle'
import Copy from 'assets/images/icons/copy.svg'
import Disconnect from 'assets/images/icons/disconnect.svg'
import { WalletAddressDropdown } from './style'

interface Props {}

const CopyOption = () => ({
  value: 'copy',
  label: 'Copy Address',
  imgSrc: Copy,
})

const DisconnectOption = () => ({
  value: 'disconnect',
  label: 'Disconnect',
  imgSrc: Disconnect,
})

export const WalletAddress = ({}: Props) => {
  const { disconnect } = useDisconnect()

  const onCopyAddress = () => {
    navigator.clipboard.writeText(networkService.account as string)
  }
  const onDisconnect = () => {
    disconnect()
  }

  const onItemsSelected = (value: string) => {
    if (value === 'copy') {
      onCopyAddress()
    } else {
      onDisconnect()
    }
  }

  const profile = generateAvatarURL(networkService.account as string)
  const profileOption = {
    value: 'address',
    label: truncate(networkService.account!, 6, 4, '...'),
    imgSrc: profile,
    imgType: 'img',
  }

  return (
    <WalletAddressDropdown
      items={[CopyOption(), DisconnectOption()]}
      defaultItem={profileOption}
      onItemSelected={(option: any) => onItemsSelected(option.value)}
      setSelectedOnClick={false}
      error={true}
      includeArrow={false}
      testId="address"
    />
  )
}
