import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  ConfirmActionButton,
  PassiveStepIcon,
  PassiveStepIconActive,
  SecondaryActionButton,
} from './index.styles'
import { Heading } from '../../../components/global'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer, selectModalState } from '../../../selectors'
import { setConnectETH } from '../../../actions/setupAction'
import { Layer } from '../../../util/constant'
import { ethers } from 'ethers'
import {
  claimWithdrawal,
  handleInitiateWithdrawal,
  handleProveWithdrawal,
} from './withdrawal'
import { openModal } from '../../../actions/uiAction'
import networkService from '../../../services/networkService'

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
]

interface IVerticalStepperProps {
  handleClose: () => void
  token?: any
  amountToBridge?: number
  reenterWithdrawConfig?: any
}

export const VerticalWithdrawalStepper = (props: IVerticalStepperProps) => {
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())
  const [reenterWithdrawal, setReenterWithdrawal] = useState({})
  const [latestLogs, setLatestLogs] = useState(null)
  const [activeStep, setActiveStep] = React.useState(0)

  useEffect(() => {
    // TODO: Use goldsky.com
    // todo load current stage
    if (layer === Layer.L1) {
      setActiveStep(3)
    } else {
      setActiveStep(0)
    }

    if (props.reenterWithdrawConfig) {
      setReenterWithdrawal(props.reenterWithdrawConfig)
      setActiveStep(props.reenterWithdrawConfig.step)
    }
  }, [layer])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  return (
    <>
      <Box>
        <Stepper orientation="vertical" activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              {step.passiveStep ? (
                <StepLabel
                  StepIconComponent={() => {
                    return activeStep >= index ? (
                      <PassiveStepIconActive />
                    ) : (
                      <PassiveStepIcon />
                    )
                  }}
                >
                  {step.label}
                </StepLabel>
              ) : (
                <StepLabel>{step.label}</StepLabel>
              )}
              {step.description && (
                <StepContent>
                  <Typography>{step.description}</Typography>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Withdrawal Successful</Typography>
            <Button onClick={props.handleClose} sx={{ mt: 1, mr: 1 }}>
              Close
            </Button>
          </Paper>
        )}
        <ConfirmActionButton
          style={{ marginTop: '12px' }}
          loading={!steps[activeStep].btnLbl}
          disabled={!steps[activeStep].btnLbl}
          onClick={() => {
            switch (activeStep) {
              case 0: // "Initial Withdrawal Transaction sent and waiting period over"
                const isNativeWithdrawal =
                  props.token.address ===
                  '0x4200000000000000000000000000000000000006'
                selectModalState('transactionSuccess')
                handleInitiateWithdrawal(
                  ethers.utils
                    .parseEther(props.amountToBridge!.toString())
                    .toString(),
                  isNativeWithdrawal ? null : props.token
                ).then((res) => {
                  setActiveStep(2)
                  setReenterWithdrawal({
                    withdrawalHash: { blockNumber: res },
                  })
                  console.log('---> Init Withdrawal done')
                })
                break

              case 2: // "Switch to L1"
                dispatch(setConnectETH(true))
                break
              case 3: // "Proof"
                handleProveWithdrawal(reenterWithdrawal)
                  .then((res: any) => {
                    console.log('---> Proof done', res)
                    setLatestLogs(res)
                    setActiveStep(5)
                  })
                  .catch((err) => {
                    console.log('---> Proof failed', err)
                  })
                break
              case 5: // "Claim"
                console.log('reentrancy logs: ', props.reenterWithdrawConfig)
                if (reenterWithdrawal) {
                  networkService
                    .L2ToL1MessagePasser!.queryFilter(
                      networkService.L2ToL1MessagePasser!.filters.MessagePassed(),
                      props.reenterWithdrawConfig.blockNumber, // todo adapt
                      props.reenterWithdrawConfig.blockNumber // todo adapt
                    )
                    .then((logs) => {
                      console.log('logs found...', logs)
                      claimWithdrawal(latestLogs).then((res) => {
                        console.log('---> Claim done: ', res)
                        dispatch(openModal('transactionSuccess'))
                      })
                    })
                } else {
                  claimWithdrawal(latestLogs).then((res) => {
                    console.log('---> Claim done: ', res)
                    dispatch(openModal('transactionSuccess'))
                  })
                }
            }
            if (activeStep !== 5) {
              handleNext()
            }
          }}
          label={<Heading variant="h3">{steps[activeStep].btnLbl}</Heading>}
        />
        <SecondaryActionButton
          onClick={props.handleClose}
          label={<Heading variant="h3">Close</Heading>}
        />
      </Box>
    </>
  )
}
