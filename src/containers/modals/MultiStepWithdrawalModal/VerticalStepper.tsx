import { setConnectETH } from 'actions/setupAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer, selectModalState } from 'selectors'
import {
  IHandleProveWithdrawalConfig,
  approvalRequired,
  claimWithdrawal,
  handleInitiateWithdrawal,
  handleProveWithdrawal,
} from 'services/anchorage.service'
import { anchorageGraphQLService } from 'services/graphql.service'
import networkService from 'services/networkService'
import { steps } from './config'
import {
  ActiveStepNumberIndicator,
  ConfirmActionButton,
  Description,
  PassiveStepperNumberIndicator,
  SecondaryActionButton,
  StepContainer,
} from './index.styles'

interface IVerticalStepperProps {
  handleClose: () => void
  token?: any
  amountToBridge?: number
  reenterWithdrawConfig?: any
}

export const VerticalStepper = (props: IVerticalStepperProps) => {
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())
  const [withdrawalConfig, setWithdrawalConfig] =
    useState<IHandleProveWithdrawalConfig>()
  const [latestLogs, setLatestLogs] = useState(null)
  const [activeStep, setActiveStep] = React.useState(0)
  const [approvalNeeded, setApprovalNeeded] = useState(false)

  useEffect(() => {
    if (activeStep === 0 && props.token) {
      approvalRequired(props.token, props.amountToBridge).then((res) => {
        setApprovalNeeded(res)
      })
    }

    if (props.reenterWithdrawConfig) {
      dispatch(setConnectETH(true))
      setWithdrawalConfig(props.reenterWithdrawConfig)
      setActiveStep(props.reenterWithdrawConfig.step)
    }
  }, [layer])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const initWithdrawalStep = () => {
    const isNativeWithdrawal =
      props.token.address === networkService.addresses.NETWORK_NATIVE_TOKEN
    selectModalState('transactionSuccess')
    handleInitiateWithdrawal(
      ethers.utils.parseEther(props.amountToBridge!.toString()).toString(),
      isNativeWithdrawal ? null : props.token
    )
      .then((res) => {
        if (!res) {
          props.handleClose()
          dispatch(
            openError('Failed to approve amount or user rejected signature')
          )
          return
        }
        setActiveStep(2)
        setWithdrawalConfig({
          blockNumber: res,
        })
      })
      .catch((err) => {
        console.error('ERROR: ', err)
      })
  }

  const proofWithdrawalStep = () => {
    dispatch(setConnectETH(true))
    handleProveWithdrawal(withdrawalConfig!)
      .then((res: any) => {
        setActiveStep(5)
        setLatestLogs(res)
      })
      .catch(() => {})
  }

  const claimWithdrawalStep = () => {
    if (latestLogs) {
      if (!withdrawalConfig?.withdrawalHash) {
        claimWithdrawal(latestLogs).then(() => {
          dispatch(closeModal('bridgeMultiStepWithdrawal'))
          dispatch(openModal('transactionSuccess'))
        })
      } else {
        anchorageGraphQLService.findWithdrawalMessagedPassed().then((logs) => {
          logs = logs.filter(
            (log) => log?.withdrawalHash === withdrawalConfig.withdrawalHash
          )
          claimWithdrawal(logs).then(() => {
            setActiveStep(6)
            dispatch(openModal('transactionSuccess'))
            dispatch(closeModal('bridgeMultiStepWithdrawal'))
          })
        })
      }
    }
  }

  return (
    <>
      <div>
        <div>
          {steps.map((step, index) => (
            <div key={step.label}>
              {step.passiveStep ? (
                <PassiveStepperNumberIndicator active={activeStep >= index}>
                  <span>○</span>
                  {step.label}
                </PassiveStepperNumberIndicator>
              ) : (
                <StepContainer active={activeStep >= index}>
                  <ActiveStepNumberIndicator active={activeStep >= index}>
                    {index}
                  </ActiveStepNumberIndicator>
                  {step.label}
                  <Description active={activeStep >= index}>
                    {step.description}
                  </Description>
                </StepContainer>
              )}
            </div>
          ))}
        </div>
        {activeStep === steps.length && (
          <div>
            <h1>Withdrawal Successful</h1>
            <button onClick={props.handleClose}>Close</button>
          </div>
        )}
        <ConfirmActionButton
          style={{ marginTop: '12px' }}
          loading={!steps[activeStep].btnLbl}
          disabled={!steps[activeStep].btnLbl}
          onClick={() => {
            console.log('Clicked on: ', activeStep)
            switch (activeStep) {
              case 0:
                initWithdrawalStep()
                break
              case 2:
                dispatch(setConnectETH(true))
                break
              case 3:
                proofWithdrawalStep()
                break
              case 5:
                claimWithdrawalStep()
                break
            }
            handleNext()
          }}
          label={
            <Heading variant="h3">
              {activeStep === 0 && approvalNeeded
                ? 'Approve'
                : steps[activeStep].btnLbl}
            </Heading>
          }
        />
        <SecondaryActionButton
          onClick={props.handleClose}
          label={<Heading variant="h3">Close</Heading>}
        />
      </div>
    </>
  )
}
