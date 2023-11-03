import {
  clearBridgeAlert,
  purgeBridgeAlert,
  setBridgeAlert,
} from 'actions/bridgeAction'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetwork,
  selectAmountToBridge,
  selectBobaFeeChoice,
  selectBobaPriceRatio,
  selectBridgeType,
  selectClassicExitCost,
  selectExitFee,
  selectIsTeleportationOfAssetSupported,
  selectL2BalanceBOBA,
  selectL2BalanceETH,
  selectLayer,
  selectTokenToBridge,
} from 'selectors'
import { logAmount } from 'util/amountConvert'
import { LAYER } from 'util/constant'
import BN from 'bignumber.js'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { NETWORK } from 'util/network/network.util'
import { BigNumberish, ethers } from 'ethers'

enum ALERT_KEYS {
  OMG_INFO = 'OMG_INFO',
  VALUE_TOO_SMALL = 'VALUE_TOO_SMALL',
  VALUE_TOO_LARGE = 'VALUE_TOO_LARGE',
  FAST_EXIT_ERROR = 'FAST_EXIT_ERROR',
  FAST_DEPOSIT_ERROR = 'FAST_DEPOSIT_ERROR',
  DEPRECATION_WARNING = 'DEPRECATION_WARNING',
  TELEPORTATION_ASSET_NOT_SUPPORTED = 'TELEPORTER_ASSET_NOT_SUPPORTED',
  TELEPORTATION_NO_UNCONVENTIONAL_WALLETS = 'TELEPORTATION_NO_UNCONVENTIONAL_WALLETS',
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
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())

  // network
  const activeNetwork = useSelector(selectActiveNetwork())
  const tokenForTeleportationSupported: ITeleportationTokenSupport =
    useSelector(selectIsTeleportationOfAssetSupported())

  // imports needed for layer= 2;
  const feeBalanceETH = useSelector(selectL2BalanceETH)
  const feeBalanceBOBA = useSelector(selectL2BalanceBOBA)
  const feeUseBoba = useSelector(selectBobaFeeChoice())
  const feePriceRatio = useSelector(selectBobaPriceRatio())
  const exitFee = useSelector(selectExitFee)
  const classExitCost = useSelector(selectClassicExitCost)

  useEffect(() => {
    if (bridgeType === BRIDGE_TYPE.LIGHT) {
      if (!tokenForTeleportationSupported.supported) {
        dispatch(
          clearBridgeAlert({
            keys: [ALERT_KEYS.VALUE_TOO_LARGE, ALERT_KEYS.VALUE_TOO_SMALL],
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
            keys: [ALERT_KEYS.TELEPORTATION_ASSET_NOT_SUPPORTED],
          })
        )
        dispatch(
          setBridgeAlert({
            meta: ALERT_KEYS.TELEPORTATION_NO_UNCONVENTIONAL_WALLETS,
            type: 'info',
            text: `This bridge doesn't support smart-contract wallets that use a costly fallback method.`,
          })
        )

        if (
          amountToBridge &&
          amountToBridge < tokenForTeleportationSupported.minDepositAmount
        ) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.VALUE_TOO_SMALL,
              type: 'error',
              text: `For this asset you need to bridge at least ${ethers.utils.formatEther(
                tokenForTeleportationSupported.minDepositAmount
              )}.`,
            })
          )
        } else if (
          amountToBridge > tokenForTeleportationSupported.maxDepositAmount
        ) {
          dispatch(
            setBridgeAlert({
              meta: ALERT_KEYS.VALUE_TOO_LARGE,
              type: 'error',
              text: `For this asset you are allowed to bridge at maximum ${ethers.utils.formatEther(
                tokenForTeleportationSupported.maxDepositAmount
              )} per transaction.`,
            })
          )
        }
      }
    }
  }, [tokenForTeleportationSupported, bridgeType])

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
        keys: [ALERT_KEYS.VALUE_TOO_LARGE, ALERT_KEYS.VALUE_TOO_SMALL],
      })
    )

    if ((underZero || amountToBridge <= 0) && amountToBridge) {
      dispatch(
        setBridgeAlert({
          meta: ALERT_KEYS.VALUE_TOO_SMALL,
          type: 'error',
          text: `Value too small: the value must be greater than 0`,
        })
      )
    } else if (overMax) {
      dispatch(
        setBridgeAlert({
          meta: ALERT_KEYS.VALUE_TOO_LARGE,
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
        keys: [ALERT_KEYS.FAST_EXIT_ERROR],
      })
    )
    if (layer === LAYER.L2 && bridgeType !== BRIDGE_TYPE.LIGHT) {
      // trigger only when withdrawing funds.
      let warning = ''
      const balance = Number(logAmount(token.balance, token.decimals))
      const ethCost = Number(classExitCost) * 1.04 // 1.04 == safety margin on the cost.
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
            meta: ALERT_KEYS.FAST_EXIT_ERROR,
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
    classExitCost,
  ])

  useEffect(() => {
    if (activeNetwork === NETWORK.AVAX && layer === LAYER.L1) {
      dispatch(
        setBridgeAlert({
          meta: ALERT_KEYS.DEPRECATION_WARNING,
          text: `For users of BobaAvax (Fuji) or BobaAvax (Fuji) applications
          you will need to transfer all your funds to Avalanche mainnet before October 31st
          or risk permanently losing access to any assets on BobaAvax (Fuji)`,
          type: 'warning',
        })
      )
    }
  }, [activeNetwork, layer])

  // on changing bridgeType and active network cleanup alerts
  useEffect(() => {
    dispatch(purgeBridgeAlert())

    if (
      activeNetwork !== NETWORK.ETHEREUM &&
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
