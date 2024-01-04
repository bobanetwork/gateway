import {
  ConfirmModalContainer,
  SubLabel,
  SubValue,
  LightText,
  Item,
  LayerNames,
  Separator,
  WithdrawalNetworkContainer,
} from './index.styles'
import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectAmountToBridge,
  selectLookupPrice,
  selectReenterWithdrawal,
  selectTokenToBridge,
} from 'selectors'
import { amountToUsd } from 'util/amountConvert'
import useBridge from 'hooks/useBridge'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import { DEFAULT_NETWORK } from 'util/constant'
import { VerticalWithdrawalStepper } from './VerticalStepper'

interface Props {
  open: boolean
}

export const MultiStepWithdrawalModal: FC<Props> = ({ open }) => {
  const withdrawalConfig = useSelector(selectReenterWithdrawal())
  const dispatch = useDispatch<any>()
  const _token = useSelector(selectTokenToBridge()) // is undefined on network change
  const _amountToBridge = useSelector(selectAmountToBridge()) // is undefined on network change
  const [token, setToken] = useState(_token)
  const [amountToBridge, setAmountToBridge] = useState(_amountToBridge)
  const lookupPrice = useSelector(selectLookupPrice)
  const networkNames = useSelector(selectActiveNetworkName())
  const activeNetworkIcon = useSelector(selectActiveNetworkIcon())
  const icons = NETWORK_ICONS[activeNetworkIcon]
  const L1Icon = icons['L1']
  const L2Icon = icons['L2']
  const { triggerSubmit } = useBridge()

  useEffect(() => {
    if (!token) {
      setToken(_token)
    }
    if (!amountToBridge) {
      setAmountToBridge(_amountToBridge)
    }
  }, [_token, _amountToBridge])

  const handleClose = () => {
    dispatch(closeModal('bridgeMultiStepWithdrawal'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title="Withdrawal"
      transparent={false}
    >
      <ConfirmModalContainer>
        <Item>
          <SubLabel>Withdraw Amount</SubLabel>
          <SubValue>
            {amountToBridge} {token?.symbol}
            <LightText>
              {token
                ? `$${amountToUsd(amountToBridge, lookupPrice, token).toFixed(
                    2
                  )}`
                : null}
            </LightText>
          </SubValue>
        </Item>
        <WithdrawalNetworkContainer>
          <LayerNames>
            <L2Icon selected /> {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
          </LayerNames>
          <SubLabel>to</SubLabel>
          <LayerNames>
            <L1Icon selected /> {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}
          </LayerNames>
        </WithdrawalNetworkContainer>
        <Separator />

        <VerticalWithdrawalStepper
          reenterWithdrawConfig={withdrawalConfig}
          handleClose={handleClose}
          token={token}
          amountToBridge={amountToBridge}
        />
      </ConfirmModalContainer>
    </Modal>
  )
}
