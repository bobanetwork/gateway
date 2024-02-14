import React from 'react'
import { useSelector } from 'react-redux'
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

const Bridging = () => {
  useBridgeCleanUp()
  useBridgeAlerts()

  const currentBridgeType = useSelector(selectBridgeType())

  return (
    <BridginContainer>
      <BridgeWrapper id="bridge">
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
