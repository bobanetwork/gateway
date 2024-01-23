import React, { useEffect, useState } from 'react'
import {
  ConfirmActionButton,
  Description,
  PassiveStepperNumberIndicator,
  SecondaryActionButton,
  ActiveStepNumberIndicator,
  StepContainer,
} from './index.styles'
import { Heading } from '../../../components/global'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer, selectModalState } from '../../../selectors'
import { setConnectETH } from '../../../actions/setupAction'
import { Layer } from '../../../util/constant'
import { ethers } from 'ethers'
import {
  approvalRequired,
  claimWithdrawal,
  handleInitiateWithdrawal,
  handleProveWithdrawal,
  HandleProveWithdrawalConfig,
} from './withdrawal'
import { closeModal, openModal } from '../../../actions/uiAction'
import networkService from '../../../services/networkService'
import { anchorageGraphQLService } from '../../../services/graphql.service'

const steps = [
  {
    label: 'Start Withdrawal',
    description: `Submit the 1st transaction of the new Anchorage two-step withdrawal process.`,
    passiveStep: false,
    btnLbl: 'Initiate Withdrawal',
  },
  { label: 'Wait up to 5 minutes', passiveStep: true },
  {
    label: 'Switch network',
    passiveStep: false,
    btnLbl: 'Switch Network',
  },
  {
    label: 'Prove Withdrawal',
    description:
      'Submit the proof in advance. This additional step is part of the new Anchorage specification.',
    passiveStep: false,
    btnLbl: 'Prove Withdrawal',
  },
  { label: 'Wait about 7 days', passiveStep: true },
  {
    label: 'Claim Withdrawal',
    description: `Claim your funds. This is the final step.`,
    passiveStep: false,
    btnLbl: 'Claim Withdrawal',
  },
  { label: 'Wait for Confirmation', passiveStep: true },
]

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
    useState<HandleProveWithdrawalConfig>()
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
      props.token.address === networkService.addresses.NETWORK_NATIVE
    selectModalState('transactionSuccess')
    handleInitiateWithdrawal(
      ethers.utils.parseEther(props.amountToBridge!.toString()).toString(),
      isNativeWithdrawal ? null : props.token
    )
      .then((res) => {
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
      .catch((err) => {})
  }

  const claimWithdrawalStep = () => {
    if (!withdrawalConfig?.withdrawalHash) {
      claimWithdrawal(latestLogs).then((res) => {
        dispatch(closeModal('bridgeMultiStepWithdrawal'))
        dispatch(openModal('transactionSuccess'))
      })
    } else {
      anchorageGraphQLService.findWithdrawalMessagesPassed().then((logs) => {
        logs = logs.filter(
          (log) => log?.args?.withdrawalHash === withdrawalConfig.withdrawalHash
        )
        claimWithdrawal(logs).then((res) => {
          setActiveStep(6)
          dispatch(openModal('transactionSuccess'))
          dispatch(closeModal('bridgeMultiStepWithdrawal'))
        })
      })
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
