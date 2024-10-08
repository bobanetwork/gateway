import { addTokenList } from 'actions/networkAction'
import {
  setConnect,
  setConnectBOBA,
  setConnectETH,
  setEnableAccount,
  setLayer,
  setWalletAddress,
} from 'actions/setupAction'
import { closeModal, openModal } from 'actions/uiAction'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectActiveNetwork,
  selectActiveNetworkType,
  selectBaseEnabled,
  selectConnect,
  selectConnectBOBA,
  selectConnectETH,
  selectLayer,
  selectUserTriggeredChainSwitch,
} from 'selectors'
import networkService from 'services/networkService'
import { DISABLE_WALLETCONNECT, LAYER } from 'util/constant'

export const useWalletConnect = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector(selectAccountEnabled())
  const baseEnabled = useSelector(selectBaseEnabled())

  const layer = useSelector(selectLayer())
  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  const connectETHRequest = useSelector(selectConnectETH())
  const connectBOBARequest = useSelector(selectConnectBOBA())
  const connectRequest = useSelector(selectConnect())
  const userTriggeredChainSwitch = useSelector(selectUserTriggeredChainSwitch())

  /**
   * @triggerInit
   * triggers the initializations and setup the state accordingly base on the response.
   */

  const triggerInit = useCallback(() => {
    const initAccount = async () => {
      const initialized = await networkService.initializeAccount()
      if (initialized === 'nometamask') {
        dispatch(openModal({ modal: 'noMetaMaskModal' }))
        return false
      } else if (initialized === 'wrongnetwork') {
        dispatch(openModal({ modal: 'wrongNetworkModal' }))
        return false
      } else if (initialized === false) {
        dispatch(setEnableAccount(false))
        return false
      } else if (initialized === LAYER.L1 || initialized === LAYER.L2) {
        dispatch(closeModal('wrongNetworkModal'))
        dispatch(setLayer(initialized))
        dispatch(setEnableAccount(true))
        dispatch(setWalletAddress(networkService.account))
        dispatch(addTokenList())
        return true
      } else {
        return false
      }
    }

    if ((!accountEnabled || userTriggeredChainSwitch) && baseEnabled) {
      initAccount()
    }
  }, [
    dispatch,
    accountEnabled,
    network,
    networkType,
    baseEnabled,
    userTriggeredChainSwitch,
  ])

  // do connect layer.
  const doConnectToLayer = useCallback(
    (targetLayer) => {
      const resetConnectChain = () => {
        dispatch(setConnect(false))
        dispatch(setConnectETH(false))
      }

      const doConnect = async () => {
        try {
          if (networkService.walletService.provider) {
            if (await networkService.switchChain(targetLayer.toUpperCase())) {
              if (targetLayer.toUpperCase() === 'L2') {
                dispatch(setConnectBOBA(false))
              } else {
                dispatch(setConnectETH(false))
              }
              triggerInit()
            } else {
              resetConnectChain()
            }
          } else {
            // bypass walletSelectorModal
            if (DISABLE_WALLETCONNECT) {
              if (await networkService.walletService.connect('metamask')) {
                triggerInit()
              } else {
                resetConnectChain()
              }
            } else {
              resetConnectChain()
              dispatch(openModal({ modal: 'walletSelectorModal' }))
            }
          }
        } catch (err) {
          console.log('reset connection chain')
          resetConnectChain()
        }
      }
      doConnect()
    },
    [dispatch, triggerInit]
  )

  useEffect(() => {
    // detect mismatch and correct the mismatch
    if (layer === 'L1' || layer === 'L2') {
      triggerInit()
    }
  }, [layer, triggerInit])

  // listening for l1 connection request
  useEffect(() => {
    if (connectETHRequest) {
      doConnectToLayer('L1')
    }
  }, [connectETHRequest, doConnectToLayer])

  // listening for l2 connection request
  useEffect(() => {
    if (connectBOBARequest) {
      doConnectToLayer('L2')
    }
  }, [connectBOBARequest, doConnectToLayer])

  useEffect(() => {
    if (connectRequest && !networkService.walletService.provider) {
      if (DISABLE_WALLETCONNECT) {
        triggerInit()
        dispatch(setConnect(false))
      } else {
        dispatch(openModal({ modal: 'walletSelectorModal' }))
        dispatch(setConnect(false))
      }
    } else if (connectRequest) {
      dispatch(setConnectETH(true))
    }
  }, [dispatch, connectRequest, triggerInit])

  return { triggerInit, doConnectToLayer }
}
