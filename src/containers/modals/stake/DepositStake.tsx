import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openAlert } from 'actions/uiAction'

import Modal from 'components/modal/Modal'

import { Button } from 'components/global/button'

import { Flex, StakeContent, StakeDetails, StakeInputContainer } from './styles'

import {
  addFS_Savings,
  fetchStakeInfo,
  fetchSavings,
  fetchBobaTokenDetail,
} from 'actions/fixedAction'

import { MaxInput } from 'components/global/InputMax'
import { BigNumber, utils } from 'ethers'
import { toWei_String } from 'util/amountConvert'

import { ModalTypography } from 'components/global/modalTypography'
import { selectFixed, selectSetup } from 'selectors'
import fixedSavingService from 'services/fixedsaving/fixedSaving.service'

const DepositStake = ({ open }) => {
  const { stakeInfo, bobaToken } = useSelector(selectFixed())
  const { accountEnabled, netLayer, bobaFeeChoice, bobaFeePriceRatio } =
    useSelector(selectSetup())

  const dispatch = useDispatch<any>()

  const [state, setState] = useState({
    max_Float_String: '0.0',
    fee: '0',
    stakeValue: '0.0',
    value_Wei_String: '',
    loading: false,
  })

  useEffect(() => {
    dispatch(fetchBobaTokenDetail())
  }, [])

  useEffect(() => {
    getMaxTransferValue()
  }, [bobaToken])

  const getMaxTransferValue = async () => {
    if (bobaToken) {
      let max_BN = BigNumber.from(bobaToken.balance.toString())
      let fee = '0'

      if (netLayer === 'L2') {
        const cost_BN: any = await fixedSavingService.savingEstimate()

        if (bobaFeeChoice) {
          // we are staking BOBA and paying in BOBA
          // so need to subtract the BOBA fee
          max_BN = max_BN.sub(cost_BN.mul(BigNumber.from(bobaFeePriceRatio)))
        }

        // make sure user maintains minimum BOBA in account
        max_BN = max_BN.sub(BigNumber.from(toWei_String(3.0, 18)))

        if (bobaFeeChoice) {
          fee = utils.formatUnits(
            cost_BN.mul(BigNumber.from(bobaFeePriceRatio)),
            bobaToken.decimals
          )
        } else {
          fee = utils.formatUnits(cost_BN, bobaToken.decimals)
        }
      }

      if (max_BN.lt(BigNumber.from('0'))) {
        max_BN = BigNumber.from('0')
      }

      setState((prevState) => ({
        ...prevState,
        max_Float_String: utils.formatUnits(max_BN, bobaToken.decimals),
        fee,
      }))
    }
  }

  const handleStakeValue = (value: any) => {
    const { max_Float_String } = state

    if (
      value &&
      Number(value) > 0.0 &&
      Number(value) <= Number(max_Float_String)
    ) {
      setState((prevState) => ({
        ...prevState,
        stakeValue: value,
        stakeValueValid: true,
        value_Wei_String: toWei_String(value, 18),
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        stakeValue: value,
        stakeValueValid: false,
        value_Wei_String: '',
      }))
    }
  }

  const handleConfirm = async () => {
    const { value_Wei_String } = state

    setState((prevState) => ({ ...prevState, loading: true }))

    const addTX = await dispatch(addFS_Savings(value_Wei_String))

    if (addTX) {
      dispatch(openAlert('Your BOBA were staked'))
      dispatch(fetchSavings())
      dispatch(fetchStakeInfo())
      dispatch(fetchBobaTokenDetail())
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
  // @ts-ignore
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
            onClick={() => handleConfirm()}
            loading={state.loading}
            disabled={!accountEnabled || state.loading}
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
