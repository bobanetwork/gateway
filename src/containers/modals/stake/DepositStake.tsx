import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { openAlert, closeModal } from 'actions/uiAction'

import Modal from 'components/modal/Modal'

import { Button } from 'components/global/button'

import { StakeInputContainer, Flex, StakeContent, StakeDetails } from './styles'

import { getFS_Saves, getFS_Info, addFS_Savings } from 'actions/fixedAction'

import { toWei_String } from 'util/amountConvert'
import networkService from 'services/networkService'
import { BigNumber, utils } from 'ethers'
import { MaxInput } from 'components/global/InputMax'

import { ModalTypography } from 'components/global/modalTypography'
import { selectFixed, selectSetup, selectBalance } from 'selectors'
import { TokenType } from './types'

const DepositStake = (props: any) => {
  const { stakeInfo } = useSelector(selectFixed())
  const { accountEnabled, netLayer, bobaFeeChoice, bobaFeePriceRatio } =
    useSelector(selectSetup())
  const balance = useSelector(selectBalance())
  const { layer2 } = balance

  const dispatch = useDispatch<any>()

  const [state, setState] = useState({
    max_Float_String: '0.0',
    fee: '0',
    stakeValue: '0.0',
    value_Wei_String: '',
  })

  useEffect(() => {
    dispatch(getFS_Saves())
    dispatch(getFS_Info())
    getMaxTransferValue()
  }, [])

  useEffect(() => {
    getMaxTransferValue()
  }, [layer2])

  const getMaxTransferValue = async () => {
    const token = Object.values(layer2).find(
      (t: any) => t['symbolL2'] === 'BOBA'
    ) as TokenType
    if (!token) {
      return
    }

    let max_BN = BigNumber.from(token.balance.toString())

    if (netLayer === 'L2') {
      const cost_BN: any = await networkService.savingEstimate()
      const fee_BN = bobaFeeChoice
        ? cost_BN.mul(BigNumber.from(bobaFeePriceRatio))
        : cost_BN

      max_BN = max_BN.sub(fee_BN).sub(BigNumber.from(toWei_String(3.0, 18)))
      if (max_BN.lt(BigNumber.from('0'))) {
        max_BN = BigNumber.from('0')
      }

      const fee = utils.formatUnits(fee_BN, token.decimals)

      setState((prevState) => ({
        ...prevState,
        max_Float_String: utils.formatUnits(max_BN, token.decimals),
        fee,
      }))
    }
  }

  const handleStakeValue = (value: string) => {
    const { max_Float_String } = state

    const isValueInRange =
      value && Number(value) > 0.0 && Number(value) <= Number(max_Float_String)

    setState((prevState) => ({
      ...prevState,
      stakeValue: value,
      stakeValueValid: isValueInRange,
      value_Wei_String: isValueInRange ? toWei_String(value, 18) : '',
    }))
  }

  const handleConfirm = async () => {
    const { value_Wei_String } = state

    setState((prevState) => ({ ...prevState, loading: true }))

    const addTX = await dispatch(addFS_Savings(value_Wei_String))

    if (addTX) {
      dispatch(openAlert('Your BOBA were staked'))
    }

    setState((prevState) => ({
      ...prevState,
      loading: false,
      stakeValue: '',
      value_Wei_String: '',
    }))
    handleClose()
  }

  let totalBOBAstaked = 0
  Object.keys(stakeInfo).forEach((v, i) => {
    if (stakeInfo[i].isActive) {
      totalBOBAstaked = totalBOBAstaked + Number(stakeInfo[i].depositAmount)
    }
  })

  const handleClose = () => {
    dispatch(closeModal('StakeDepositModal'))
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose()
      }}
      title="Stake"
    >
      <StakeInputContainer>
        <ModalTypography variant="body2">
          Stake Boba and earn rewards.
        </ModalTypography>

        <StakeContent>
          <Flex>
            <div>
              <ModalTypography variant="body2">Amount</ModalTypography>
            </div>
            <div>
              <ModalTypography variant="body3">
                Balance: {state.max_Float_String} BOBA
              </ModalTypography>
            </div>
          </Flex>
          <MaxInput
            max={Number(state.max_Float_String)}
            onValueChange={(value: any) => {
              handleStakeValue(value)
            }}
          />
        </StakeContent>
        <StakeDetails>
          <Flex>
            <ModalTypography variant="body3">Fees</ModalTypography>
            <ModalTypography variant="body3">
              Fee: {state.fee} {bobaFeeChoice ? 'BOBA' : 'ETH'}
            </ModalTypography>
          </Flex>
          <Flex>
            <ModalTypography variant="body3">APY</ModalTypography>
            <ModalTypography variant="body3">5.0%</ModalTypography>
          </Flex>
          <Flex>
            <ModalTypography variant="body3">Amount</ModalTypography>
            <ModalTypography variant="body3">
              {state.stakeValue || '-'}
            </ModalTypography>
          </Flex>
        </StakeDetails>

        {netLayer === 'L2' && (
          <Button
            onClick={() => {
              handleConfirm()
            }}
            loading={props.loading}
            disable={!accountEnabled}
            label="Stake"
          />
        )}
      </StakeInputContainer>
      <Button
        onClick={() => {
          handleClose()
        }}
        transparent
        label="Cancel"
      />
    </Modal>
  )
}

export default DepositStake
