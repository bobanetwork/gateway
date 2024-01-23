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
import networkService from '../../services/networkService'
import { openModal } from '../../actions/uiAction'
import { setReenterWithdrawalConfig } from '../../actions/bridgeAction'
import { bedrockGraphQLService } from '../../services/graphql.service'
import {
  ReenterWithdrawConfig,
  WithdrawState,
} from '../modals/MultiStepWithdrawalModal/withdrawal'

const Bridging = () => {
  const dispatch = useDispatch<any>()
  useBridgeCleanUp()
  useBridgeAlerts()

  const [reenterWithdrawConfig, setReenterWithdrawConfig] =
    useState<ReenterWithdrawConfig | null>()

  useEffect(() => {
    networkService.provider?.getNetwork().then(async (res) => {
      bedrockGraphQLService
        .queryWithdrawalTransactionsHistory(
          await networkService.provider!.getSigner().getAddress(),
          // TODO fetch network config
          {
            L2: {
              name: 'ETH',
              chainId: 901,
            },
          } as any
        )
        .then((events: any) => {
          events = events.filter(
            (e) => e.UserFacingStatus !== WithdrawState.finalized
          )
          if (events?.length > 1) {
            if (events[0]?.actionRequired) {
              setReenterWithdrawConfig({
                ...events[0].actionRequired,
              })
            }
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
