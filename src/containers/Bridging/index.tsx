import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBridgeType } from 'selectors'
import BridgeAction from './BridgeAction'
import BridgeAlert from './BridgeAlert'
import BridgeHeader from './BridgeHeader'
import BridgeInput from './BridgeInput'
import BridgeTypeSelector, { BRIDGE_TYPE } from './BridgeTypeSelector'
import ThirdPartyBridges from './ThirdPartyBridges'
import Chains from './chain'
import { BridgeContent, BridgeWrapper, BridginContainer } from './styles'

import useBridgeAlerts from 'hooks/useBridgeAlerts'
import useBridgeCleanUp from 'hooks/useBridgeCleanUp'
import ReenterWithdrawModal from '../modals/ReenterWithdrawModal'
import { checkReenterWithdraw } from './ReenterWithdraw'
import networkService from '../../services/networkService'
import { openModal } from '../../actions/uiAction'
import { setReenterWithdrawalConfig } from '../../actions/bridgeAction'

const Bridging = () => {
  const dispatch = useDispatch<any>()
  useBridgeCleanUp()
  useBridgeAlerts()

  const [reenterWithdrawConfig, setReenterWithdrawConfig] = useState(null)

  useEffect(() => {
    networkService.provider?.getNetwork().then(async (res) => {
      checkReenterWithdraw(
        await networkService.provider!.getSigner().getAddress()
      ).then((response) => {
        if (response) {
          setReenterWithdrawConfig(response as any)
        }
      })
    })
  }, [!!networkService.provider])

  const currentBridgeType = useSelector(selectBridgeType())

  const handleClose = () => setReenterWithdrawConfig(null)

  return (
    <BridginContainer>
      <BridgeWrapper id="bridge">
        {reenterWithdrawConfig && (
          <ReenterWithdrawModal
            handleClose={handleClose}
            state={1}
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
