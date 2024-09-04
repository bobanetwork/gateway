import {
  anchorageGraphQLService,
  IHandleProveWithdrawalConfig,
} from '@bobanetwork/graphql-utils'
import {
  claimWithdrawal,
  handleProveWithdrawal,
  handleProveWithdrawalWithFraudProof,
  withdrawErc20TokenAnchorage,
  withdrawNativeTokenAnchorage,
} from 'actions/bridgeAction'
import { setConnectETH } from 'actions/setupAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { utils } from 'ethers'
import useAppConfig from 'hooks/useAppConfig'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLayer } from 'selectors'
import { bridgeService } from 'services'
import networkService from 'services/networkService'
import oracleService from 'services/oracle/oracle.service'
import { addDaysToDate, dayNowUnix, isBeforeDate } from 'util/dates'

const useAnchorageWithdrawal = (props) => {
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())
  const [withdrawalConfig, setWithdrawalConfig] =
    useState<IHandleProveWithdrawalConfig>()
  const [latestLogs, setLatestLogs] = useState<null | []>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [canProoveTx, setCanProoveTx] = useState(false)
  const [canFinalizedTx, setCanFinalizedTx] = useState(false)
  const [latestBlockNumber, setLatestBlockNumber] = useState(0)
  const [txBlockNumber, setTxBlockNumber] = useState(0)
  const { isActiveNetworkBnbTestnet } = useNetworkInfo()
  const { doesFruadProofWithdrawalEnable } = useAppConfig()

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

  const switchLayerToL1 = () => {
    dispatch(setConnectETH(true))
  }

  const isButtonDisabled = () => {
    if (activeStep === 3) {
      return !canProoveTx
    } else if (activeStep === 5) {
      if (doesFruadProofWithdrawalEnable) {
        return !canFinalizedTx
      } else {
        // can claim only if tx proove 7 day before
        const txWith7Day = addDaysToDate(withdrawalConfig?.timeStamp, 7)
        return !Number(props.amountToBridge) || !isBeforeDate(txWith7Day)
      }
    }

    return !Number(props.amountToBridge)
  }

  useEffect(() => {
    let isMounted = true // Flag to track component mount state

    const getLatestBlockNumber = async () => {
      if (doesFruadProofWithdrawalEnable) {
        if (!networkService.chainId) {
          return 0
        }
        return anchorageGraphQLService.getLatestFDGSubmittedBlock(
          networkService.chainId
        )
      } else {
        return oracleService.getLatestL2OutputBlockNumber()
      }
    }

    const validateBlockNumberAndEnableProov = async () => {
      if (withdrawalConfig?.blockNumber) {
        try {
          setTxBlockNumber(withdrawalConfig?.blockNumber)
          let latestBlockOnL1 = await getLatestBlockNumber()
          setLatestBlockNumber(Number(latestBlockOnL1))
          while (
            isMounted &&
            Number(latestBlockOnL1) < Number(withdrawalConfig?.blockNumber)
          ) {
            latestBlockOnL1 = await getLatestBlockNumber()
            setLatestBlockNumber(Number(latestBlockOnL1))
            await new Promise((resolve) => setTimeout(resolve, 12000)) // Wait for 12 seconds before checking again
          }
          if (isMounted) {
            setCanProoveTx(true)
          }
        } catch (error) {
          console.log(`Error while checking blocknumber`, error)
        }
      }
    }

    const checkWithdrawalFinalizeStatus = async () => {
      try {
        const res = await bridgeService.doesWithdrawalCanFinalized({
          transactionHash: withdrawalConfig?.withdrawalHash,
        })

        if (res) {
          setCanFinalizedTx(true)
        } else {
          setCanFinalizedTx(false)
        }
      } catch (error) {
        console.log(`failed to fetch withdrawal finalize status`, error)
      }
    }

    if (withdrawalConfig && activeStep === 3) {
      validateBlockNumberAndEnableProov()
    } else if (
      doesFruadProofWithdrawalEnable &&
      withdrawalConfig &&
      activeStep === 5
    ) {
      checkWithdrawalFinalizeStatus()
    }

    return () => {
      isMounted = false // Update mount state on unmount
    }
  }, [activeStep, withdrawalConfig, doesFruadProofWithdrawalEnable])

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
    let res
    if (doesFruadProofWithdrawalEnable) {
      res = await dispatch(
        handleProveWithdrawalWithFraudProof({ txInfo: withdrawalConfig })
      )
    } else {
      res = await dispatch(handleProveWithdrawal({ txInfo: withdrawalConfig }))
    }
    if (res) {
      setActiveStep(5)
      setLatestLogs(res)
      setWithdrawalConfig({
        blockNumber: res[0].blockNumber,
        timeStamp: dayNowUnix(),
        timeStamp_proven: dayNowUnix(),
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
      }
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

  const handleWithdrawalAction = () => {
    switch (activeStep) {
      case 0:
        initWithdrawalStep()
        break
      case 2:
        switchLayerToL1()
        break
      case 3:
        proofWithdrawalStep()
        break
      case 5:
        claimWithdrawalStep()
        break
    }
    handleNext()
  }

  return {
    doesFruadProofWithdrawalEnable,
    handleWithdrawalAction,
    latestBlockNumber,
    withdrawalConfig,
    isButtonDisabled,
    canFinalizedTx,
    txBlockNumber,
    canProoveTx,
    activeStep,
    loading,
    layer,
  }
}

export default useAnchorageWithdrawal
