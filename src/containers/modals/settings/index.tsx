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
  selectBridgeType,
} from 'selectors'
import { setBridgeDestinationAddressAvailable } from 'actions/bridgeAction'
import { SettingDropDownRowTypes, SettingRowTypes } from './types'

import {
  SettingsAction,
  SettingsItem,
  SettingsText,
  SettingSubTitle,
  SettingsWrapper,
  SettingTitle,
} from './styles'
import { BRIDGE_TYPE } from '../../Bridging/BridgeTypeSelector'
import { isDevBuild } from '../../../util/constant'
import { Dropdown, IDropdownProps } from '../../../components/global/dropdown'

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

  const onChangeNetworkType = (value: NetworkType) => {
    dispatch(
      setActiveNetworkType({
        networkType: value,
      })
    )
  }
  const onChangeDestinationAddressAvailable = (value: boolean) => {
    dispatch(setBridgeDestinationAddressAvailable(value))
  }

  const SettingDropDownRow: React.FC<
    SettingDropDownRowTypes & IDropdownProps
  > = ({ title, subTitle, onItemSelected, items, defaultItem, error }) => {
    return (
      <SettingsItem>
        <SettingsText>
          <SettingTitle>{title}</SettingTitle>
          <SettingSubTitle>{subTitle}</SettingSubTitle>
        </SettingsText>
        <SettingsAction>
          <Dropdown
            onItemSelected={onItemSelected}
            error={error}
            minWidth={'75px'}
            items={items}
            defaultItem={defaultItem}
          />
        </SettingsAction>
      </SettingsItem>
    )
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
      minHeight="180px"
      title="Settings"
      testId="settings-modal"
      transparent={false}
    >
      <SettingsWrapper>
        {isDevBuild() ? (
          <SettingDropDownRow
            title="Switch Networks"
            subTitle="Other networks will be available to bridge"
            error={false}
            items={[
              { value: NetworkType.MAINNET, label: 'Mainnets' },
              { value: NetworkType.TESTNET, label: 'Testnets' },
              { value: NetworkType.LOCAL, label: 'Local' },
            ]}
            defaultItem={{ value: NetworkType.MAINNET, label: 'Mainnets' }}
            onItemSelected={(v) => onChangeNetworkType(v.value as NetworkType)}
          />
        ) : (
          <SettingRow
            title="Show Testnets"
            subTitle="Testnets will be available to bridge"
            isActive={activeNetworkType === NetworkType.TESTNET}
            onStateChange={(v) =>
              onChangeNetworkType(v ? NetworkType.TESTNET : NetworkType.MAINNET)
            }
          />
        )}
        {/* Custom destination address seems to be only available for classic bridge */}
        {bridgeType === BRIDGE_TYPE.CLASSIC ? (
          <SettingRow
            title="Add Destination Address"
            subTitle="Allows you to transfer to a different address"
            isActive={bridgeToAddressEnable}
            onStateChange={onChangeDestinationAddressAvailable}
          />
        ) : null}
      </SettingsWrapper>
    </Modal>
  )
}

export default SettingsModal
