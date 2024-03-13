import {
  fetchVerifierStatus,
  resetVerifierStatus,
} from 'actions/verifierAction'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectBaseEnabled,
  selectActiveNetworkName,
  selectActiveNetwork,
  selectActiveNetworkType,
  selectVerifierStatus,
} from 'selectors'
import networkService from 'services/networkService'
import { Network, NetworkType } from 'util/network/network.util'
import { fetchGasDetail } from 'services/gas.service'
import useInterval from './useInterval'
import { GAS_POLL_INTERVAL } from 'util/constant'

/**
 *
 * useGasWatcher.
 *
 * Gas Calculation
 *
   Fetch gas savings (ONLY ETH MAINNET) & gas details.
   The l1 security fee is moved to the l2 fee
   const gasSavings = (Number(gas.gasL1) * (l2Fee - l1SecurityFee) / Number(gas.gasL2)) / l2Fee;
   The l1 security fee is directly deducted from the user's account
 *
 * NOTE:TODO: https://github.com/bobanetwork/boba/pull/982#discussion_r1253868688
 */

const useGasWatcher = () => {
  const dispatch = useDispatch<any>()

  const [gas, setGas] = useState<any>()
  const [savings, setSavings] = useState<number>(1)

  const verifierStatus = useSelector(selectVerifierStatus)
  const baseEnabled = useSelector(selectBaseEnabled())
  const networkName = useSelector(selectActiveNetworkName())
  const activeNetwork = useSelector(selectActiveNetwork())
  const activeNetworkType = useSelector(selectActiveNetworkType())

  const loadGasDetail = useCallback(() => {
    if (baseEnabled) {
      const fetchGas = async () => {
        const gasDetail = await fetchGasDetail()
        setGas(gasDetail)
      }

      fetchGas()
      if (activeNetwork === Network.ETHEREUM) {
        dispatch(fetchVerifierStatus())
      } else {
        dispatch(resetVerifierStatus())
      }
    }
  }, [networkName, baseEnabled, dispatch])

  useEffect(() => {
    const getGasSavings = async () => {
      const l1SecurityFee = await networkService.estimateL1SecurityFee()
      const l2Fee = await networkService.estimateL2Fee()

      const gasSavings: any =
        (Number(gas.gasL1) * l2Fee) /
        Number(gas.gasL2) /
        (l2Fee + l1SecurityFee)

      setSavings(
        gasSavings && gasSavings.toString() !== 'Infinity' ? gasSavings : 0
      )
    }
    // Load gas savings only in case of ETHEREUM MAINNET
    if (
      activeNetwork === Network.ETHEREUM &&
      activeNetworkType === NetworkType.MAINNET &&
      gas
    ) {
      getGasSavings()
    } else {
      setSavings(1)
    }
  }, [gas, activeNetwork])

  useEffect(() => {
    loadGasDetail()
  }, [loadGasDetail, activeNetwork])

  useInterval(() => {
    loadGasDetail()
  }, GAS_POLL_INTERVAL)

  return { savings, gas, verifierStatus }
}

export default useGasWatcher
