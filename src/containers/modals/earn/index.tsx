import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openAlert, openModal } from 'actions/uiAction'
import {
  fetchL1LPBalance,
  fetchL2LPBalance,
  getEarnInfo,
  updateWithdrawPayload,
  withdrawLiquidity,
} from 'actions/earnAction'

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
import {
  selectLpBalanceWei,
  selectUserInfo,
  selectWithdrawToken,
} from 'selectors'
import { LiquidityPoolLayer } from 'types/earn.types'
import { BigNumber } from 'ethers'

interface EarnWithdrwaModalProps {
  open: boolean
}

const EarnWithdrawModal = ({ open }: EarnWithdrwaModalProps) => {
  const dispatch = useDispatch<any>()

  const userInfo = useSelector(selectUserInfo())
  const withdrawToken = useSelector(selectWithdrawToken())
  const LPBalanceWei = useSelector(selectLpBalanceWei())

  const [value, setValue] = useState(0)
  const [value_Wei_String, setValue_Wei_String] = useState('')
  const [isValidValue, setisValidValue] = useState(false)
  const [maxValue, setMaxValue] = useState(0)
  const [maxValue_Wei_String, setMaxValue_Wei_String] = useState('')

  const [LPBalance, setLPBalance] = useState(
    logAmount('', withdrawToken.decimals)
  )

  useEffect(() => {
    if (withdrawToken.L1orL2Pool === LiquidityPoolLayer.L1LP) {
      dispatch(fetchL1LPBalance(withdrawToken.currency))
    } else {
      dispatch(fetchL2LPBalance(withdrawToken.currency))
    }
  }, [withdrawToken])

  // calculate max value
  useEffect(() => {
    // set LPBalance
    setLPBalance(logAmount(LPBalanceWei, withdrawToken.decimals))

    // calculate maxValue and set.
    let balance_Wei_String = ''

    if (
      typeof userInfo[withdrawToken.L1orL2Pool][withdrawToken.currency] !==
      'undefined'
    ) {
      balance_Wei_String =
        userInfo[withdrawToken.L1orL2Pool][withdrawToken.currency].amount
    }

    //BUT, if the current balance is lower than what you staked, can only withdraw the balance
    const poolTooSmall = BigNumber.from(LPBalanceWei).lt(
      BigNumber.from(balance_Wei_String)
    )

    if (poolTooSmall) {
      setMaxValue(Number(logAmount(LPBalanceWei, withdrawToken.decimals)))
      setMaxValue_Wei_String(LPBalanceWei)
    } else {
      //pool big enough to cover entire withdrawal
      setMaxValue(Number(logAmount(balance_Wei_String, withdrawToken.decimals)))
      setMaxValue_Wei_String(balance_Wei_String)
    }
  }, [userInfo, withdrawToken, LPBalanceWei])

  const handleClose = () => {
    dispatch(closeModal('EarnWithdrawModal'))
  }

  const onUnstake = async () => {
    dispatch(
      updateWithdrawPayload({
        ...withdrawToken,
        amountToWithdraw: value,
        amountToWithdrawWei: value_Wei_String,
      })
    )

    dispatch(closeModal('EarnWithdrawModal'))
    dispatch(openModal('EarnWithdrawConfirmModal'))
  }

  const setAmount = (userEnteredValue: any, userEnteredValueInWei: string) => {
    const valueInBn = BigNumber.from(userEnteredValueInWei)
    const tooSmall = valueInBn.lte(BigNumber.from(0.0))
    const tooBig = valueInBn.gt(BigNumber.from(maxValue_Wei_String))

    console.log(['userEnteredValue', userEnteredValue])

    if (tooSmall || tooBig) {
      setValue(0)
      setValue_Wei_String('')
      setisValidValue(false)
    } else {
      setValue(userEnteredValue)
      setValue_Wei_String(userEnteredValueInWei)
      setisValidValue(true)
    }
  }

  console.log(['isValidValue', isValidValue, !!isValidValue])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="md"
      title={`Withdraw ${withdrawToken.symbol}`}
    >
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
            max={Number(maxValue)}
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
              onClick={onUnstake}
              label="Unstake"
              disabled={!isValidValue}
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
