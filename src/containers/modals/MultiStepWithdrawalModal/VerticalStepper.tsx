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
import React, { useEffect } from 'react'
import {
  ConfirmActionButton,
  PassiveStepIcon,
  PassiveStepIconActive,
  SecondaryActionButton,
} from './index.styles'
import { Heading } from '../../../components/global'
import { setNetwork } from '../../../actions/networkAction'
import { Network, NetworkList } from '../../../util/network/network.util'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAmountToBridge,
  selectLayer,
  selectNetwork,
  selectNetworkType,
  selectTokenToBridge,
} from '../../../selectors'
import { setConnectETH } from '../../../actions/setupAction'
import { Layer } from '../../../util/constant'

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
  token: any
  amountToBridge: number
}

export const VerticalWithdrawalStepper = (props: IVerticalStepperProps) => {
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())

  const [activeStep, setActiveStep] = React.useState(0)

  useEffect(() => {
    // TODO: Use goldsky.com
    // todo load current stage
    // has started withdrawal? has proven withdrawal? waiting periods, etc.
    if (layer === Layer.L1) {
      setActiveStep(3)
    } else {
      setActiveStep(2)
    }
  }, [layer])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
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
              case 0:
                break
              case 2:
                dispatch(setConnectETH(true))
                break
              case 3:
                break
              case 5:
                break
            }
            handleNext()
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
