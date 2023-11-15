import Modal from 'components/modal/Modal'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from 'actions/uiAction'

import { SwitchButton } from 'components/global'
import { setActiveNetworkType } from 'actions/networkAction'
import { NetworkType } from 'util/network/network.util'
import {
  selectActiveNetworkType,
  selectBridgeDestinationAddressAvailable,
} from 'selectors'
import { setBridgeDestinationAddressAvailable } from 'actions/bridgeAction'
import { ModalInterface } from '../types'
import { SettingRowTypes } from './types'

import {
  SettingSubTitle,
  SettingTitle,
  SettingsAction,
  SettingsItem,
  SettingsText,
  SettingsWrapper,
} from './styles'

const SettingsModal: FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const activeNetworkType = useSelector(selectActiveNetworkType())
  const bridgeToAddressEnable = useSelector(
    selectBridgeDestinationAddressAvailable()
  )

  const handleClose = () => {
    dispatch(closeModal('settingsModal'))
  }

  const onChangeNetworkType = (value: boolean) => {
    dispatch(
      setActiveNetworkType({
        networkType: value ? NetworkType.TESTNET : NetworkType.MAINNET,
      })
    )
  }
  const onChangeDestinationAddressAvailable = (value: boolean) => {
    dispatch(setBridgeDestinationAddressAvailable(value))
  }

  const SettingRow: React.FC<SettingRowTypes> = ({
    title,
    subTitle,
    isActive,
    onStateChange,
  }) => {
    return (
      <SettingsItem>
        <SettingsText>
          <SettingTitle>{title}</SettingTitle>
          <SettingSubTitle>{subTitle}</SettingSubTitle>
        </SettingsText>
        <SettingsAction>
          <SwitchButton isActive={isActive} onStateChange={onStateChange} />
        </SettingsAction>
      </SettingsItem>
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Settings"
      transparent={false}
      testId="settings-modal"
    >
      <SettingsWrapper>
        <SettingRow
          title="Show Testnets"
          subTitle="Testnets will be available to bridge"
          isActive={activeNetworkType === NetworkType.TESTNET}
          onStateChange={(v) => onChangeNetworkType(v)}
        />
        <SettingRow
          title="Add Destination Address"
          subTitle="Allows you to transfer to a different address"
          isActive={bridgeToAddressEnable}
          onStateChange={onChangeDestinationAddressAvailable}
        />
      </SettingsWrapper>
    </Modal>
  )
}

export default SettingsModal
