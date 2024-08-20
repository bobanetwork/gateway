import useAnchorageWithdrawal from 'hooks/useAnchorageWithdrawal'
import React from 'react'
import { addDaysToDate, isBeforeDate } from 'util/dates'
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
  } = useAnchorageWithdrawal(props)

  const prepareDesc = (desc?: string, step?: string) => {
    if (!desc) {
      return ''
    }

    if (activeStep === 3 && step === 'Prove Withdrawal') {
      if (!canProoveTx) {
        return `${desc} The current L2 block submitted is ${latestBlockNumber}, and your block is ${txBlockNumber}. ${!doesFruadProofWithdrawalEnable ? '' : 'This will take about 3 days 12 hrs.'}`
      } else {
        return `Your transaction has reached L1. You can now proove your withdrawal`
      }
    }

    if (activeStep === 5 && step === 'Claim Withdrawal') {
      const txWith7Day = addDaysToDate(withdrawalConfig?.timeStamp, 7)
      const canClaim = !Number(props.amountToBridge) || isBeforeDate(txWith7Day)
      if (!canClaim) {
        return `The proof has been submitted. Please wait 3 days to claim your withdrawal`
      } else {
        return `The proof has been submitted and the 3-days window has passed`
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
