import {
  anchorageGraphQLService,
  IHandleProveWithdrawalConfig,
} from '@bobanetwork/graphql-utils'
import {
  handleProveWithdrawal,
  withdrawErc20TokenAnchorage,
  withdrawNativeTokenAnchorage,
  claimWithdrawal,
} from 'actions/bridgeAction'
import { setConnectETH } from 'actions/setupAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { utils } from 'ethers'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer } from 'selectors'
import networkService from 'services/networkService'
import { addDaysToDate, dayNowUnix, isBeforeDate } from 'util/dates'
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
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())
  const [withdrawalConfig, setWithdrawalConfig] =
    useState<IHandleProveWithdrawalConfig>()
  const [latestLogs, setLatestLogs] = useState<null | []>(null)
  const [activeStep, setActiveStep] = React.useState(0)
  const [loading, setLoading] = useState(false)
  const [canProoveTx, setCanProoveTx] = useState(false)
  const [latestBlock, setLatestBlock] = useState(0)
  const [txBlock, setTxBlock] = useState(0)
  const { isActiveNetworkBnbTestnet } = useNetworkInfo()

  useEffect(() => {
    if (props.reenterWithdrawConfig) {
      dispatch(setConnectETH(true))
      setWithdrawalConfig(props.reenterWithdrawConfig)
      setActiveStep(props.reenterWithdrawConfig.step)
    }
  }, [layer])

  useEffect(() => {
    let isMounted = true // Flag to track component mount state

    const validateBlockNumberAndEnableProov = async () => {
      if (activeStep === 3 && withdrawalConfig?.blockNumber) {
        try {
          setTxBlock(withdrawalConfig?.blockNumber)
          // TODO: cleanup with moving to service.
          let latestBlockOnL1 =
            await networkService?.L2OutputOracle?.latestBlockNumber()
          setLatestBlock(latestBlockOnL1)

          while (
            isMounted &&
            Number(latestBlockOnL1) < Number(withdrawalConfig?.blockNumber)
          ) {
            // @todo: check why block number is not getting updated.
            // Update the latest block number
            // TODO: cleanup with moving to service.
            latestBlockOnL1 =
              await networkService?.L2OutputOracle?.latestBlockNumber()
            setLatestBlock(latestBlockOnL1)
            // Wait for 12 seconds before checking again
            await new Promise((resolve) => setTimeout(resolve, 12000))
          }

          if (isMounted) {
            setCanProoveTx(true)
          }
        } catch (error) {
          console.log(`Error while checking blocknumber`, error)
        }
      }
    }
    if (withdrawalConfig && activeStep === 3) {
      validateBlockNumberAndEnableProov()
    }

    return () => {
      isMounted = false // Update mount state on unmount
    }
  }, [activeStep])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const isButtonDisabled = () => {
    if (activeStep === 3) {
      return !canProoveTx
    } else if (activeStep === 5) {
      // can claim only if tx proove 7 day before
      const txWith7Day = addDaysToDate(withdrawalConfig?.timeStamp, 7)
      return !Number(props.amountToBridge) || !isBeforeDate(txWith7Day)
    }

    return !Number(props.amountToBridge)
  }

  const initWithdrawalStep = async () => {
    setLoading(true)
    const isNativeWithdrawal =
      props.token.address === networkService.addresses.NETWORK_NATIVE_TOKEN

    const amount = utils
      .parseUnits(
        props.amountToBridge!.toString(),
        props.token ? props.token.decimals : null
      )
      .toString()

    let receipt
    if (isNativeWithdrawal) {
      receipt = await dispatch(
        withdrawNativeTokenAnchorage({
          amount,
          isActiveNetworkBnb: isActiveNetworkBnbTestnet,
        })
      )
    } else {
      receipt = await dispatch(
        withdrawErc20TokenAnchorage({ amount, token: props.token.address })
      )
    }

    if (receipt.hasOwnProperty('message')) {
      props.handleClose()
      dispatch(openError(receipt.message))
    } else if (receipt) {
      setActiveStep(2)
      setWithdrawalConfig({ blockNumber: receipt })
      setLoading(false)
    } else {
      setLoading(false)
      props.handleClose()
    }
  }

  const proofWithdrawalStep = async () => {
    setLoading(true)
    console.log([`sending tx for proove withdrawal`, withdrawalConfig])
    const res = await dispatch(
      handleProveWithdrawal({ txInfo: withdrawalConfig })
    )
    if (res) {
      setActiveStep(5)
      setLatestLogs(res)
      setWithdrawalConfig({
        blockNumber: res[0].blockNumber,
        timeStamp: dayNowUnix(),
      })
      setLoading(false)
    } else {
      dispatch(openError(`The withdrawal verification failed!`))
      setLoading(false)
      props.handleClose()
    }
  }

  const claimWithdrawalStep = async () => {
    if (!!withdrawalConfig) {
      setLoading(true)
      let logs: any[] = latestLogs || []
      if (!logs || !logs?.length) {
        const resLogs =
          await anchorageGraphQLService.findWithdrawalMessagedPassed(
            withdrawalConfig?.withdrawalHash || '',
            networkService.networkConfig?.L2.chainId || ''
          )

        logs = resLogs.filter(
          (log) => log?.withdrawalHash === withdrawalConfig?.withdrawalHash
        )
      } else {
        const res = await dispatch(claimWithdrawal({ logs }))
        if (res) {
          dispatch(closeModal('bridgeMultiStepWithdrawal'))
          dispatch(
            openModal({
              modal: 'transactionSuccess',
              isAnchorageWithdrawal: true,
            })
          )
          setLoading(false)
        } else {
          console.log(`error state!`, res)
          // TODO: handled failed state
        }
      }
    }
  }

  const prepareDesc = (desc?: string, step?: string) => {
    if (!desc) {
      return ''
    }

    if (activeStep === 3 && step === 'Prove Withdrawal') {
      if (!canProoveTx) {
        return `${desc} The current L2 block submitted to L1 is ${latestBlock} and your block is ${txBlock}.`
      }
    }

    if (activeStep === 5 && step === 'Claim Withdrawal') {
      const txWith7Day = addDaysToDate(withdrawalConfig?.timeStamp, 7)
      const canClaim = !Number(props.amountToBridge) || isBeforeDate(txWith7Day)
      if (!canClaim) {
        return `The proof has been submitted. Please wait 7 days to claim your withdrawal`
      } else {
        return `The proof has been submitted and the 7-day window has passed`
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
