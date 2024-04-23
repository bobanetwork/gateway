import { setConnectETH } from 'actions/setupAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer, selectModalState } from 'selectors'
import {
  IHandleProveWithdrawalConfig,
  claimWithdrawal,
  handleInitiateWithdrawal,
  handleProveWithdrawal,
  anchorageGraphQLService,
  MinimalNetworkService,
} from '@bobanetwork/graphql-utils'
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
import { L2StandardERC20ABI } from '../../../services/abi'
import {
  addDaysToDate,
  addHoursToDate,
  dayNowUnix,
  isBeforeDate,
} from 'util/dates'

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
  const [latestLogs, setLatestLogs] = useState<null | []>(null)
  const [activeStep, setActiveStep] = React.useState(0)
  const [loading, setLoading] = useState(false)
  const [txInitTime, setTxInitTime] = useState<null | Number>(null)

  useEffect(() => {
    if (props.reenterWithdrawConfig) {
      dispatch(setConnectETH(true))
      setWithdrawalConfig(props.reenterWithdrawConfig)
      setActiveStep(props.reenterWithdrawConfig.step)
    }
  }, [layer])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const isButtonDisabled = () => {
    if (activeStep === 3) {
      if (txInitTime) {
        // can prove only if tx intiated 1 hour before
        const txWith1Hour = addHoursToDate(txInitTime, 1)
        return !Number(props.amountToBridge) || !isBeforeDate(txWith1Hour)
      } else if (props.reenterWithdrawConfig) {
        // can prove only if tx intiated 1 hour before
        const txWith1Hour = addHoursToDate(
          props.reenterWithdrawConfig.timeStamp,
          1
        )
        return !Number(props.amountToBridge) || !isBeforeDate(txWith1Hour)
      }
      return true
    } else if (activeStep === 5) {
      // can claim only if tx intiated 7 day before
      const txWith7Day = addDaysToDate(props.reenterWithdrawConfig.timeStamp, 7)
      return !Number(props.amountToBridge) || !isBeforeDate(txWith7Day)
    }

    return !Number(props.amountToBridge)
  }

  const initWithdrawalStep = () => {
    setLoading(true)
    const isNativeWithdrawal =
      props.token.address === networkService.addresses.NETWORK_NATIVE_TOKEN
    selectModalState('transactionSuccess')
    handleInitiateWithdrawal(
      networkService as MinimalNetworkService,
      L2StandardERC20ABI,
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
        setTxInitTime(dayNowUnix())
        setWithdrawalConfig({
          blockNumber: res,
        })
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        dispatch(openError(`The withdrawal initiation failed!`))
        props.handleClose()
      })
  }

  const proofWithdrawalStep = () => {
    setLoading(true)
    handleProveWithdrawal(
      networkService as MinimalNetworkService,
      withdrawalConfig!
    )
      .then((res: any) => {
        setActiveStep(5)
        setLatestLogs(res)
        setLoading(false)
      })
      .catch((error) => {
        dispatch(openError(`The withdrawal verification failed!`))
        setLoading(false)
        props.handleClose()
      })
  }

  const claimWithdrawalStep = () => {
    if (!!withdrawalConfig) {
      setLoading(true)
      if (
        !withdrawalConfig?.withdrawalHash &&
        !!latestLogs &&
        !!latestLogs?.length
      ) {
        claimWithdrawal(
          networkService as MinimalNetworkService,
          latestLogs
        ).then(() => {
          dispatch(closeModal('bridgeMultiStepWithdrawal'))
          dispatch(openModal('transactionSuccess'))
          setLoading(false)
        })
      } else {
        anchorageGraphQLService
          .findWithdrawalMessagedPassed(
            withdrawalConfig?.withdrawalHash || '',
            networkService.networkConfig?.L2.chainId || ''
          )
          .then((logs) => {
            logs = logs.filter(
              (log) => log?.withdrawalHash === withdrawalConfig?.withdrawalHash
            )
            claimWithdrawal(networkService as MinimalNetworkService, logs).then(
              () => {
                setActiveStep(6)
                dispatch(openModal('transactionSuccess'))
                dispatch(closeModal('bridgeMultiStepWithdrawal'))
                setLoading(false)
              }
            )
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
          loading={loading}
          disabled={!!loading || isButtonDisabled()}
          onClick={() => {
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
          label={<Heading variant="h3">{steps[activeStep].btnLbl}</Heading>}
        />
        <SecondaryActionButton
          onClick={props.handleClose}
          label={<Heading variant="h3">Close</Heading>}
        />
      </div>
    </>
  )
}
