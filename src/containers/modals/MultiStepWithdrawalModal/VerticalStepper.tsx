import useAnchorageWithdrawal from 'hooks/useAnchorageWithdrawal'
import React from 'react'
import {
  addDaysToDate,
  dayNowUnix,
  diffBetweenTimeStamp,
  formatDurationInDaysHrs,
  isBeforeDate,
} from 'util/dates'
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
  amountToBridge: number
  reenterWithdrawConfig?: any
}

export const VerticalStepper = (props: IVerticalStepperProps) => {
  const {
    handleWithdrawalAction,
    latestBlockNumber,
    txBlockNumber,
    canProoveTx,
    activeStep,
    loading,
    isButtonDisabled,
    withdrawalConfig,
    doesFruadProofWithdrawalEnable,
    canFinalizedTx,
  } = useAnchorageWithdrawal(props)

  const prepareDesc = (desc?: string, step?: string) => {
    if (!desc) {
      return ''
    }

    if (activeStep === 3 && step === 'Prove Withdrawal') {
      if (!canProoveTx) {
        const dateToClaim = addDaysToDate(withdrawalConfig?.timeStamp, 3.5)
        const timeRemaining = diffBetweenTimeStamp(dateToClaim, dayNowUnix())
        return `${desc} The current L2 block submitted is ${latestBlockNumber}, and your block is ${txBlockNumber}. ${!doesFruadProofWithdrawalEnable ? '' : `This will take about ${formatDurationInDaysHrs(timeRemaining)}.`}`
      } else {
        return `Your transaction has reached L1. You can now proove your withdrawal`
      }
    }

    if (activeStep === 5 && step === 'Claim Withdrawal') {
      if (doesFruadProofWithdrawalEnable) {
        const dateToClaim = addDaysToDate(
          withdrawalConfig?.timeStamp_proven,
          3.5
        )
        const timeRemaining = diffBetweenTimeStamp(dateToClaim, dayNowUnix())
        if (canFinalizedTx) {
          return `The proof has been submitted and the 3.5 days window has passed`
        } else {
          return `The proof has been submitted. Please wait ${formatDurationInDaysHrs(timeRemaining)} to claim your withdrawal`
        }
      } else {
        const txWith7Day = addDaysToDate(withdrawalConfig?.timeStamp, 7)
        const canClaim =
          !Number(props.amountToBridge) || isBeforeDate(txWith7Day)
        if (!canClaim) {
          return `The proof has been submitted. Please wait 7 days to claim your withdrawal`
        } else {
          return `The proof has been submitted and the 7-day window has passed`
        }
      }
    }
    return desc
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
                    {prepareDesc(step.description, step.label)}
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
          small
          style={{ marginTop: '12px', marginBottom: '12px' }}
          loading={loading}
          disabled={!!loading || isButtonDisabled()}
          onClick={() => handleWithdrawalAction()}
          label={steps[activeStep].btnLbl}
        />
        <SecondaryActionButton
          small
          onClick={props.handleClose}
          label="Close"
        />
      </div>
    </>
  )
}
