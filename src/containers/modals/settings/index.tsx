import Modal from 'components/modal/Modal'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from 'actions/uiAction'

import { SwitchButton } from 'components/global'
import { setActiveNetworkType } from 'actions/networkAction'
import { NETWORK_TYPE } from 'util/network/network.util'
import {
  selectActiveNetworkType,
  selectBridgeDestinationAddressAvailable,
  selectBridgeType,
} from 'selectors'
import { setBridgeDestinationAddressAvailable } from 'actions/bridgeAction'
import { SettingRowTypes } from './types'

import {
  SettingSubTitle,
  SettingTitle,
  SettingsAction,
  SettingsItem,
  SettingsText,
  SettingsWrapper,
} from './styles'
import { BRIDGE_TYPE } from '../../Bridging/BridgeTypeSelector'

interface SettingsModalProps {
  open: boolean
}

const SettingsModal: FC<SettingsModalProps> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const activeNetworkType = useSelector(selectActiveNetworkType())
  const bridgeToAddressEnable = useSelector(
    selectBridgeDestinationAddressAvailable()
  )
  const bridgeType = useSelector(selectBridgeType())

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
  const onChangeDestinationAddressAvailable = (value: boolean) => {
    dispatch(setBridgeDestinationAddressAvailable(value))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title="Settings"
      testId="settings-modal"
      transparent={false}
    >
      <SettingsWrapper>
        <SettingsItem>
          <SettingsText>
            <SettingTitle>Show Testnets</SettingTitle>
            <SettingSubTitle>
              Testnets will be available to bridge
            </SettingSubTitle>
          </SettingsText>
          <SettingsAction>
            <SwitchButton
              isActive={activeNetworkType === NETWORK_TYPE.TESTNET}
              onStateChange={(v: boolean) => onChangeNetworkType(v)}
            />
          </SettingsAction>
        </SettingsItem>
        {/* Custom destination address seems to be only available for classic bridge */}
        {bridgeType === BRIDGE_TYPE.CLASSIC ? (
          <SettingsItem>
            <SettingsText>
              <SettingTitle>Add Destination Address</SettingTitle>
              <SettingSubTitle>
                Allows you to transfer to a different address
              </SettingSubTitle>
            </SettingsText>
            <SettingsAction>
              <SwitchButton
                isActive={bridgeToAddressEnable}
                onStateChange={onChangeDestinationAddressAvailable}
              />
            </SettingsAction>
          </SettingsItem>
        ) : null}
      </SettingsWrapper>
    </Modal>
  )
}

export default SettingsModal
