import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectLayer,
  selectlayer2Balance,
} from 'selectors'
import networkService from 'services/networkService'

import { doSwapToken } from 'actions/setupAction'
import { openAlert } from 'actions/uiAction'
import BN from 'bignumber.js'
import { isEqual } from 'util/lodash'
import { logAmount } from 'util/amountConvert'
import { LAYER } from 'util/constant'
import { SwapAction, SwapAlert, SwapContainer } from './styles'

interface Props {}

const EmergencySwap: FC<Props> = (props) => {
  const accountEnabled = useSelector(selectAccountEnabled())
  const l2Balances = useSelector(selectlayer2Balance, isEqual)
  const layer = useSelector(selectLayer())
  const [tooSmallSec, setTooSmallSec] = useState(false)
  const dispatch = useDispatch<any>()

  useEffect(() => {
    if (accountEnabled && l2Balances.length > 0) {
      const l2BalanceSec = l2Balances.find(
        (i: any) => i.symbol === networkService.L1NativeTokenSymbol
      )

      if (l2BalanceSec && l2BalanceSec.balance) {
        // as only supported for BNB so 1boba is min balance
        const minBalance = 1
        setTooSmallSec(
          new BN(logAmount(l2BalanceSec.balance, 18)).lt(new BN(minBalance))
        )
      } else {
        // in case of zero ETH balance we are setting tooSmallSec
        setTooSmallSec(true)
      }
    }
  }, [l2Balances, accountEnabled])

  const emergencySwap = async () => {
    const res = await dispatch(doSwapToken())
    if (res) {
      dispatch(openAlert('Emergency Swap submitted'))
    }
  }

  const alertContent = () => {
    return `Using ${networkService.L1NativeTokenSymbol} requires a minimum BOBA
      balance (of 1 BOBA) regardless of your fee setting, otherwise
      MetaMask may incorrectly reject transactions. If you ran out of
      BOBA, use EMERGENCY SWAP to swap ${networkService.L1NativeTokenSymbol} for 1 BOBA at market rates.`
  }

  if (layer === LAYER.L2 && tooSmallSec) {
    return (
      <SwapContainer>
        <SwapAlert>{alertContent()}</SwapAlert>
        <SwapAction
          small
          outline
          onClick={() => {
            emergencySwap()
          }}
          label="Emergency Swap"
        />
      </SwapContainer>
    )
  } else {
    return null
  }
}

export default EmergencySwap
