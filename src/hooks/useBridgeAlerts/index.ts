import {
  clearBridgeAlert,
  purgeBridgeAlert,
  setBridgeAlert,
} from 'actions/bridgeAction'
import BN from 'bignumber.js'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetwork,
  selectAmountToBridge,
  selectBlockTime,
  selectBobaFeeChoice,
  selectBobaPriceRatio,
  selectBridgeType,
  selectExitFee,
  selectIsTeleportationOfAssetSupported,
  selectL2BalanceBOBA,
  selectL2BalanceETH,
  selectLayer,
  selectTeleportationDisburserBalance,
  selectTokenToBridge,
} from 'selectors'
import { logAmount } from 'util/amountConvert'
import { LAYER } from 'util/constant'
import { Network } from 'util/network/network.util'

enum ALERT_KEYS {
  OMG_INFO = 'OMG_INFO',
  VALUE_BALANCE_TOO_SMALL = 'VALUE_BALANCE_TOO_SMALL',
  VALUE_BALANCE_TOO_LARGE = 'VALUE_BALANCE_TOO_LARGE',
  VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT = 'VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT',
  VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT = 'VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT',
  MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED = 'MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED',
  EXIT_ERROR = 'EXIT_ERROR',
  FAST_DEPOSIT_ERROR = 'FAST_DEPOSIT_ERROR',
  DEPRECATION_WARNING = 'DEPRECATION_WARNING',
  TELEPORTATION_ASSET_NOT_SUPPORTED = 'TELEPORTER_ASSET_NOT_SUPPORTED',
  TELEPORTATION_NO_UNCONVENTIONAL_WALLETS = 'TELEPORTATION_NO_UNCONVENTIONAL_WALLETS',
  TELEPORTATION_DISBURSER_OUT_OF_FUNDS = 'TELEPORTATION_DISBURSER_OUT_OF_FUNDS',
}

interface ITeleportationTokenSupport {
  supported: boolean
  minDepositAmount: BigNumberish
  maxDepositAmount: BigNumberish
  maxTransferAmountPerDay: BigNumberish
  transferTimestampCheckPoint: BigNumberish
  transferredAmount: BigNumberish
}

const useBridgeAlerts = () => {
  const dispatch = useDispatch<any>()
  const currBlockTime: number = useSelector(selectBlockTime())
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())
  const token = useSelector(selectTokenToBridge())
  let amountToBridge = useSelector(selectAmountToBridge())
  // network
  const activeNetwork = useSelector(selectActiveNetwork())
  const tokenForTeleportationSupported: ITeleportationTokenSupport =
    useSelector(selectIsTeleportationOfAssetSupported())
  const disburserBalance: string | undefined = useSelector(
    selectTeleportationDisburserBalance()
  )?.toString()

  // imports needed for layer= 2;
  const feeBalanceETH = useSelector(selectL2BalanceETH)
  const feeBalanceBOBA = useSelector(selectL2BalanceBOBA)
  const feeUseBoba = useSelector(selectBobaFeeChoice())
  const feePriceRatio = useSelector(selectBobaPriceRatio())
  const exitFee = useSelector(selectExitFee)

  const { isActiveNetworkBnb } = useNetworkInfo()

  useEffect(() => {
    amountToBridge = Number(amountToBridge)

    if (bridgeType === BRIDGE_TYPE.LIGHT) {
      if (
        !tokenForTeleportationSupported.supported &&
        typeof token !== 'undefined'
      ) {
        dispatch(
          clearBridgeAlert({
            keys: [
              ALERT_KEYS.VALUE_BALANCE_TOO_LARGE,
              ALERT_KEYS.VALUE_BALANCE_TOO_SMALL,
            ],
          })
        )
        dispatch(
          setBridgeAlert({
            meta: ALERT_KEYS.TELEPORTATION_ASSET_NOT_SUPPORTED,
            type: 'error',
            text: `Asset not supported, please choose different asset or one of our other bridge modes.`,
          })
        )
      } else {
        dispatch(
          clearBridgeAlert({
            keys: [
              ALERT_KEYS.TELEPORTATION_ASSET_NOT_SUPPORTED,
              ALERT_KEYS.VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT,
              ALERT_KEYS.VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT,
              ALERT_KEYS.MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED,
              ALERT_KEYS.TELEPORTATION_DISBURSER_OUT_OF_FUNDS,
            ],
          })
        )
        if (
          typeof disburserBalance !== 'undefined' &&
          BigNumber.from(disburserBalance).lt(
            ethers.utils.parseUnits(
              amountToBridge.toString(),
              typeof token === 'undefined' ? 18 : token.decimals
            )
          )
        ) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.TELEPORTATION_DISBURSER_OUT_OF_FUNDS,
              type: 'error',
              text: `LightBridge has not enough funds for destination network left.`,
            })
          )
        }

        const maxDepositAmount = Number(
          ethers.utils.formatEther(
            tokenForTeleportationSupported.maxDepositAmount
          )
        )
        const minDepositAmount = Number(
          ethers.utils.formatEther(
            tokenForTeleportationSupported.minDepositAmount
          )
        )
        const transferTimestampCheckPoint = Number(
          tokenForTeleportationSupported.transferTimestampCheckPoint
        )

        dispatch(
          setBridgeAlert({
            meta: ALERT_KEYS.TELEPORTATION_NO_UNCONVENTIONAL_WALLETS,
            type: 'info',
            text: `This bridge doesn't support smart-contract wallets that use a costly fallback method.`,
          })
        )

        if (
          // LightBridge has a hardcoded 24h limit which is reset on the first transfer of the day
          currBlockTime - transferTimestampCheckPoint < 86400 &&
          amountToBridge > 0 &&
          (tokenForTeleportationSupported.transferredAmount as BigNumber).eq(
            tokenForTeleportationSupported.maxTransferAmountPerDay
          )
        ) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.MAX_BRIDGE_AMOUNT_PER_DAY_EXCEEDED,
              type: 'error',
              text: `The maximum daily bridgeable amount of ${ethers.utils.formatEther(tokenForTeleportationSupported.maxTransferAmountPerDay)} has been reached.`,
            })
          )
        }
        if (amountToBridge && amountToBridge < minDepositAmount) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.VALUE_LESS_THAN_MIN_BRIDGE_CONFIG_AMOUNT,
              type: 'error',
              text: `For this asset you need to bridge at least ${ethers.utils.formatEther(
                tokenForTeleportationSupported.minDepositAmount
              )}.`,
            })
          )
        } else if (amountToBridge > maxDepositAmount) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.VALUE_GREATER_THAN_MAX_BRIDGE_CONFIG_AMOUNT,
              type: 'error',
              text: `For this asset you are allowed to bridge at maximum ${ethers.utils.formatEther(
                tokenForTeleportationSupported.maxDepositAmount
              )} per transaction.`,
            })
          )
        }
      }
    }
  }, [
    tokenForTeleportationSupported,
    bridgeType,
    amountToBridge,
    currBlockTime,
  ])

  // show infor to user about to OMG token when
  // connected to layer 1 ETH as token is specific to ethereum only.
  useEffect(() => {
    if (layer === LAYER.L1) {
      if (token && token.symbol === 'OMG') {
        dispatch(
          setBridgeAlert({
            meta: ALERT_KEYS.OMG_INFO,
            type: 'info',
            text: `The OMG Token was minted in 2017 and it does not conform to the ERC20 token standard.
        In some cases, three interactions with MetaMask are needed. If you are bridging out of a
        new wallet, it starts out with a 0 approval, and therefore, only two interactions with
        MetaMask will be needed.`,
          })
        )
      } else {
        dispatch(
          clearBridgeAlert({
            keys: [ALERT_KEYS.OMG_INFO],
          })
        )
      }
    }
  }, [dispatch, layer, token, bridgeType])

  useEffect(() => {
    if (!token) {
      return
    }

    const maxValue = logAmount(token.balance, token.decimals)
    const underZero = new BN(amountToBridge).lt(new BN(0.0))
    const overMax = new BN(amountToBridge).gt(new BN(maxValue))

    dispatch(
      clearBridgeAlert({
        keys: [
          ALERT_KEYS.VALUE_BALANCE_TOO_LARGE,
          ALERT_KEYS.VALUE_BALANCE_TOO_SMALL,
        ],
      })
    )
    if ((underZero || amountToBridge <= 0) && amountToBridge) {
      dispatch(
        setBridgeAlert({
          meta: ALERT_KEYS.VALUE_BALANCE_TOO_SMALL,
          type: 'error',
          text: `Value too small: the value must be greater than 0`,
        })
      )
    } else if (overMax) {
      dispatch(
        setBridgeAlert({
          meta: ALERT_KEYS.VALUE_BALANCE_TOO_LARGE,
          type: 'error',
          text: `Value too large: the value must be smaller than ${Number(
            maxValue
          ).toFixed(5)}`,
        })
      )
    }
  }, [dispatch, token, amountToBridge])

  /**
   * Checks to run specific to L2 chains.
   * 1. check exitFee > balanceBoba.
   * 2. check feeETH > feeETHbalance
   * a. symbol=ETH then (value + feeETH) > feeETHBalance.
   * b. symbol=NA then (feeETH) > feeETHBalance.
   * 3. feeUseBoba :
   * a. symbol=boba then (value + feeBoba + exitFee) > feeBobaBalance
   * b. symbol=NA (feeBoba + exitFee) > feeBobaBalance
   * 4. LPRatio < 0.1 // we always wants user to have some balance for unstaking.
   * a. && value > BSP * 0.9
   * b. && value <= BSP * 0.9
   * 5. value > balanceSubPending * 0.9 : error.
   *
   */

  useEffect(() => {
    if (!token) {
      return
    }

    dispatch(
      clearBridgeAlert({
        keys: [ALERT_KEYS.EXIT_ERROR],
      })
    )
    // TODO: cleanup on anchorage migration.
    if (
      layer === LAYER.L2 &&
      bridgeType !== BRIDGE_TYPE.LIGHT &&
      !!isActiveNetworkBnb
    ) {
      // trigger only when withdrawing funds.
      let warning = ''
      const balance = Number(logAmount(token.balance, token.decimals))
      // @note review and test once for classic bridge.
      const ethCost = 1.04 // 1.04 == safety margin on the cost.
      const bobaCost = ethCost * feePriceRatio

      if (exitFee > feeBalanceBOBA) {
        warning = `Insufficient BOBA balance to cover xChain message relay. You need at least ${exitFee} BOBA`
      } else if (ethCost > feeBalanceETH) {
        if (feeUseBoba) {
          warning = `ETH balance too low. Even if you pay in BOBA, you still need to maintain a minimum ETH balance in your wallet`
        } else {
          warning = `ETH balance too low to cover gas`
        }
      } else if (feeUseBoba) {
        if (
          token.symbol === 'BOBA' &&
          Number(amountToBridge) + bobaCost + exitFee > balance
        ) {
          warning = `Insufficient BOBA balance to conver Boba Amount, Exit Fee and Relay fee.`
        } else if (bobaCost + exitFee > feeBalanceBOBA) {
          warning = `Insufficient BOBA balance to conver Exit Fee and Relay fee.`
        }
      } else if (
        token.symbol === 'ETH' &&
        Number(amountToBridge) + ethCost > balance
      ) {
        if (feeUseBoba) {
          warning = `Insufficient ETH Balance to cover ETH amount and fees. Even if you pay in BOBA, you still need to maintain a minimum ETH balance in your wallet`
        }
        warning = `Insufficient ETH balance to cover ETH Amount and Exit fee.`
      }

      if (warning) {
        dispatch(
          setBridgeAlert({
            meta: ALERT_KEYS.EXIT_ERROR,
            type: 'error',
            text: warning,
          })
        )
      }
    }
  }, [
    dispatch,
    layer,
    bridgeType,
    amountToBridge,
    token,
    feeBalanceBOBA,
    feeBalanceETH,
    feePriceRatio,
    feeUseBoba,
    exitFee,
  ])

  // on changing bridgeType and active network cleanup alerts
  useEffect(() => {
    dispatch(purgeBridgeAlert())

    if (
      activeNetwork !== Network.ETHEREUM &&
      bridgeType === BRIDGE_TYPE.THIRD_PARTY
    ) {
      dispatch(
        setBridgeAlert({
          meta: 'THIRD_PARTY_BRIDGE_ALERT',
          type: 'info',
          text: `There are no third party bridges available for ${activeNetwork} at the moment. To view third party bridges for other networks, select another network in the Classic Tab.`,
        })
      )
    }
  }, [dispatch, bridgeType, activeNetwork])
}

export default useBridgeAlerts
