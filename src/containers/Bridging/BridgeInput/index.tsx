import { openModal } from 'actions/uiAction'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccountEnabled, selectTokenToBridge } from 'selectors'

import useBridgeSetup from 'hooks/useBridgeSetup/'
import { getCoinImage } from 'util/gitdata'

import bobaLogo from 'assets/images/Boba_Logo_White_Circle.png'
import useAmountToReceive from 'hooks/useAmountToReceive'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { SectionLabel } from '../chain/styles'
import BridgeToAddress from './BridgeToAddress'
import EmergencySwap from './EmergencySwap'
import Fee from './Fee'
import TokenInput from './TokenInput'
import {
  BridgeInputContainer,
  BridgeInputWrapper,
  DownArrow,
  ReceiveAmount,
  ReceiveContainer,
  TokenLabel,
  TokenPickerIcon,
  TokenSelector,
  TokenSelectorInput,
  TokenSymbol,
} from './styles'

const BridgeInput: FC = () => {
  const dispatch = useDispatch<any>()
  const isAccountEnabled = useSelector(selectAccountEnabled())
  const token = useSelector(selectTokenToBridge())
  const { amount: receivableAmount } = useAmountToReceive()
  const { isActiveNetworkBnb } = useNetworkInfo()
  useBridgeSetup()

  const openTokenPicker = () => {
    dispatch(openModal({ modal: 'tokenPicker' }))
  }

  if (!isAccountEnabled) {
    return null
  }

  return (
    <BridgeInputContainer>
      <BridgeInputWrapper>
        <TokenSelector>
          <SectionLabel>Token</SectionLabel>
          <TokenSelectorInput
            onClick={() => openTokenPicker()}
            id="tokenSelectorInput"
          >
            {token && (
              <TokenSymbol>
                <img
                  src={
                    token.symbol === 'BOBA'
                      ? bobaLogo
                      : getCoinImage(token.symbol)
                  }
                  alt={`ETH logo`}
                  width="32px"
                  height="32px"
                />
              </TokenSymbol>
            )}
            <TokenLabel>{token ? token?.symbol : 'Select'}</TokenLabel>
            <TokenPickerIcon>
              <DownArrow />
            </TokenPickerIcon>
          </TokenSelectorInput>
        </TokenSelector>
        <TokenInput />
      </BridgeInputWrapper>
      {token && (
        <ReceiveContainer>
          <SectionLabel>Receive</SectionLabel>
          <ReceiveAmount data-testid="amountToRecieve">
            {receivableAmount}
          </ReceiveAmount>
        </ReceiveContainer>
      )}
      <BridgeToAddress />
      {token && <Fee />}
      {!!isActiveNetworkBnb && <EmergencySwap />}
    </BridgeInputContainer>
  )
}

export default BridgeInput
