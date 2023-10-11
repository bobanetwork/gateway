import Modal from 'components/modal/Modal'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from 'actions/uiAction'
import {
  SettingSubTitle,
  SettingTitle,
  SettingsAction,
  SettingsItem,
  SettingsText,
  SettingsWrapper,
} from './styles'
import { SwitchButton } from 'components/global'
import { setActiveNetworkType } from 'actions/networkAction'
import { NETWORK_TYPE } from 'util/network/network.util'
import { selectActiveNetworkType, selectBridgeToAddressState } from 'selectors'
import { setBridgeToAddress } from 'actions/bridgeAction'
import { ModalInterface } from '../types'
import { SettingRowTypes } from './types'

const SettingsModal: FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const activeNetworkType = useSelector(selectActiveNetworkType())
  const bridgeToAddressEnable = useSelector(selectBridgeToAddressState())

  const handleClose = () => {
    dispatch(closeModal('settingsModal'))
  }

  const onChangeNetworkType = (value: boolean) => {
    dispatch(
      setActiveNetworkType({
        networkType: value ? NETWORK_TYPE.TESTNET : NETWORK_TYPE.MAINNET,
      })
    )
  }

  const onChangeDestinationAddress = (value: boolean) => {
    dispatch(setBridgeToAddress(value))
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
    >
      <SettingsWrapper>
        <SettingRow
          title="Show Testnets"
          subTitle="Testnets will be available to bridge"
          isActive={activeNetworkType === NETWORK_TYPE.TESTNET}
          onStateChange={(v) => onChangeNetworkType(v)}
        />
        <SettingRow
          title="Add Destination Address"
          subTitle="Allows you to transfer to a different address"
          isActive={bridgeToAddressEnable}
          onStateChange={onChangeDestinationAddress}
        />
        <SettingsItem></SettingsItem>
      </SettingsWrapper>
    </Modal>
  )
}

export default SettingsModal
