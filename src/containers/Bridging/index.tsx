import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectBridgeType,
  selectReenterWithdrawalConfig,
} from 'selectors'
import BridgeAction from './BridgeAction'
import BridgeAlert from './BridgeAlert'
import BridgeHeader from './BridgeHeader'
import BridgeInput from './BridgeInput'
import BridgeTypeSelector, { BRIDGE_TYPE } from './BridgeTypeSelector'
import Chains from './chain'
import { BridgeContent, BridgeWrapper, BridginContainer } from './styles'
import ThirdPartyBridges from './ThirdPartyBridges'

import { setReenterWithdrawalConfig } from 'actions/bridgeAction'
import { openModal } from 'actions/uiAction'
import ReenterWithdrawModal from 'containers/modals/ReenterWithdrawModal'
import useBridgeAlerts from 'hooks/useBridgeAlerts'
import useBridgeCleanUp from 'hooks/useBridgeCleanUp'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { checkBridgeWithdrawalReenter, MinimalNetworkService } from '@bobanetwork/graphql-utils'
import networkService from '../../services/networkService'

const Bridging = () => {
  const dispatch = useDispatch<any>()
  useBridgeCleanUp()
  useBridgeAlerts()
  const accountEnabled = useSelector(selectAccountEnabled())
  const { isAnchorageEnabled } = useNetworkInfo()

  const reenterWithdrawConfig = useSelector(selectReenterWithdrawalConfig())

  useEffect(() => {
    const triggerReenterCheck = async () => {
      const config = await checkBridgeWithdrawalReenter(networkService as MinimalNetworkService)
      if (config) {
        dispatch(setReenterWithdrawalConfig(config))
      }
    }
    if (accountEnabled && isAnchorageEnabled) {
      triggerReenterCheck()
    }
  }, [accountEnabled, isAnchorageEnabled])

  const currentBridgeType = useSelector(selectBridgeType())

  const handleClose = () => {
    dispatch(setReenterWithdrawalConfig(null))
  }

  return (
    <BridginContainer>
      <BridgeWrapper id="bridge">
        {reenterWithdrawConfig && (
          <ReenterWithdrawModal
            handleClose={handleClose}
            state={reenterWithdrawConfig?.state}
            onReenterWithdrawal={() => {
              dispatch(setReenterWithdrawalConfig(reenterWithdrawConfig))
              dispatch(openModal('bridgeMultiStepWithdrawal'))
            }}
          />
        )}
        <BridgeContent>
          <BridgeHeader />
          <BridgeAlert />
          <BridgeTypeSelector />
          {currentBridgeType !== BRIDGE_TYPE.THIRD_PARTY ? (
            <>
              <Chains />
              <BridgeInput />
            </>
          ) : (
            <ThirdPartyBridges />
          )}
        </BridgeContent>
        {currentBridgeType !== BRIDGE_TYPE.THIRD_PARTY ? (
          <BridgeAction />
        ) : null}
      </BridgeWrapper>
    </BridginContainer>
  )
}

export default Bridging
