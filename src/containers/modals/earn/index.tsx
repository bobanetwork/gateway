import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEqual } from 'util/lodash'

import { closeModal, openAlert } from 'actions/uiAction'
import { fetchL1LPBalance, fetchL2LPBalance } from 'actions/earnAction'

import Modal from 'components/modal/Modal'
import { logAmount, toWei_String } from 'util/amountConvert'

import { WrapperActionsModal } from 'components/modal/styles'

import { MaxInput } from 'components/global/InputMax'
import { Button } from 'components/global/button'
import { ModalTypography } from 'components/global/modalTypography'

import {
  EarnInputContainer,
  EarnContent,
  Flex,
  ContainerMessage,
} from './styles'
import { selectUserInfo, selectWithdrawToken } from 'selectors'
import { LiquidityPoolLayer } from 'types/earn.types'

const EarnWithdrawModal = () => {
  const dispatch = useDispatch<any>()

  const userInfo = useSelector(selectUserInfo())
  const withdrawToken = useSelector(selectWithdrawToken())

  const [maxValue, setMaxValue] = useState(0)
  const [maxValue_Wei_String, setMaxValue_Wei_String] = useState('')
  const [LPBalance, setLPBalance] = useState(
    logAmount('', withdrawToken.decimals)
  )
  const [LPBalance_Wei_String, setLPBalance_Wei_String] = useState('')
  const [value, setValue] = useState(0)
  const [value_Wei_String, setValue_Wei_String] = useState('')

  useEffect(() => {
    if (withdrawToken.L1orL2Pool === LiquidityPoolLayer.L1LP) {
      dispatch(fetchL1LPBalance(withdrawToken.currency))
    } else {
      dispatch(fetchL2LPBalance(withdrawToken.currency))
    }
  }, [withdrawToken])

  const handleClose = () => {
    dispatch(closeModal('EarnWithdrawModal'))
  }

  const handleConfirm = () => {
    dispatch(closeModal('EarnWithdrawModal'))
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth="md" title={`Unstake`}>
      <EarnInputContainer>
        <EarnContent>
          <Flex>
            <div>
              <ModalTypography variant="body2">Amount</ModalTypography>
            </div>
            <div>
              <ModalTypography variant="body3">
                Balance: {maxValue} {withdrawToken.symbol}
              </ModalTypography>
            </div>
          </Flex>
          <MaxInput
            initialValue={value}
            max={maxValue_Wei_String}
            onValueChange={(val) =>
              setAmount(val, toWei_String(val, withdrawToken.decimals))
            }
          />
          {Number(value) > Number(LPBalance) && (
            <ContainerMessage>
              <ModalTypography variant="body3">
                Insufficient {withdrawToken.symbol} in the{' '}
                {withdrawToken.L1orL2Pool === 'L1LP' ? 'L1' : 'L2'} liquidity
                pool to withdraw your full stake. At this time, you can only
                withdraw up to
                {Number(LPBalance).toFixed(2)} {withdrawToken.symbol}.
              </ModalTypography>
            </ContainerMessage>
          )}

          <WrapperActionsModal>
            <Button
              onClick={() => {
                handleConfirm()
              }}
              label="Unstake"
              loading={loading}
              disabled={!!disableSubmit}
              style={{
                width: '100%',
              }}
            />
            <Button
              onClick={() => {
                handleClose()
              }}
              label="Cancel"
              transparent
              style={{
                width: '100%',
              }}
            />
          </WrapperActionsModal>
        </EarnContent>
      </EarnInputContainer>
    </Modal>
  )
}

export default React.memo(EarnWithdrawModal)
