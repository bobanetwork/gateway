import { closeModal, openError } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import { TokenInfo } from 'containers/history/tokenInfo'
import { utils } from 'ethers'
import useLookupPrice from 'hooks/useLookupPrice'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectAmountToBridge,
  selectReenterWithdrawalConfig,
  selectTokenToBridge,
} from 'selectors'
import { amountToUsd } from 'util/amountConvert'
import { DEFAULT_NETWORK } from 'util/constant'
import { setReenterWithdrawalConfig } from '../../../actions/bridgeAction'
import {
  ConfirmModalContainer,
  Item,
  LayerNames,
  LightText,
  Separator,
  SubLabel,
  SubValue,
  WithdrawalNetworkContainer,
} from './index.styles'
import { VerticalStepper } from './VerticalStepper'

interface Props {
  open: Boolean
  isNewTx: Boolean
}

export const MultiStepWithdrawalModal: FC<Props> = ({ open, isNewTx }) => {
  const withdrawalConfig = useSelector(selectReenterWithdrawalConfig())
  const dispatch = useDispatch<any>()
  const _token = useSelector(selectTokenToBridge()) // is undefined on network change
  const _amountToBridge = useSelector(selectAmountToBridge()) // is undefined on network change
  const [token, setToken] = useState(_token)
  const [amountToBridge, setAmountToBridge] = useState(_amountToBridge)

  const networkNames = useSelector(selectActiveNetworkName())
  const activeNetworkIcon = useSelector(selectActiveNetworkIcon())
  const icons = NETWORK_ICONS[activeNetworkIcon]
  const L1Icon = icons['L1']
  const L2Icon = icons['L2']

  const { lookupPrice } = useLookupPrice()

  useEffect(() => {
    if (!token) {
      setToken(_token)
    }
    if (!amountToBridge) {
      setAmountToBridge(_amountToBridge)
    }

    if (!isNewTx && withdrawalConfig && withdrawalConfig.amount) {
      let withdrawalToken = withdrawalConfig.token?.toLowerCase()
      // Since the contract previously emitted the event with LEGACY_ERC20_TOKEN,
      // we now need to utilize the following logic to accurately retrieve ETH token data for
      // all transactions made before the contract update.
      if (
        withdrawalToken === '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000' &&
        Number(withdrawalConfig.timeStamp) < 1714546800
      ) {
        withdrawalToken = '0x4200000000000000000000000000000000000006'
      }
      const token =
        TokenInfo[withdrawalConfig.originChainId.toString()]?.[withdrawalToken]
      if (!token) {
        dispatch(openError('Invalid token!'))
        handleClose()
      } else {
        const amount = utils
          .formatUnits(withdrawalConfig.amount, token ? token?.decimals : 18)
          .toString()
        setAmountToBridge(amount)
        setToken({ ...token, address: withdrawalConfig.token })
      }
    }
  }, [_token, _amountToBridge, withdrawalConfig, isNewTx])

  const handleClose = () => {
    dispatch(setReenterWithdrawalConfig(null))
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

        <VerticalStepper
          reenterWithdrawConfig={isNewTx ? null : withdrawalConfig}
          handleClose={handleClose}
          token={token}
          amountToBridge={amountToBridge}
        />
      </ConfirmModalContainer>
    </Modal>
  )
}
