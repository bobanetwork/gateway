import React, { FC } from 'react'
import {
  GasListContainer,
  GasListItem,
  GasListItemLabel,
  GasListItemValue,
} from './style'
import useGasWatcher from 'hooks/useGasWatcher'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkName } from 'selectors'
import { Network } from 'util/network/network.util'

const GasWatcher: FC = () => {
  const { gas, savings, verifierStatus } = useGasWatcher()
  const networkName = useSelector(selectActiveNetworkName())
  const activeNetwork = useSelector(selectActiveNetwork())

  if (!gas) {
    return null
  }

  return (
    <GasListContainer id="gasDetails">
      <GasListItem>
        <GasListItemLabel>{networkName['l1']}</GasListItemLabel>
        <GasListItemValue>{gas?.gasL1} Gwei</GasListItemValue>
      </GasListItem>
      <GasListItem>
        <GasListItemLabel>{networkName['l2']}</GasListItemLabel>
        <GasListItemValue>{gas?.gasL2} Gwei</GasListItemValue>
      </GasListItem>
      <GasListItem>
        <GasListItemLabel>Savings</GasListItemLabel>
        <GasListItemValue>{savings?.toFixed(0)}x</GasListItemValue>
      </GasListItem>
      <GasListItem>
        <GasListItemLabel>L1</GasListItemLabel>
        <GasListItemValue>{gas?.blockL1}</GasListItemValue>
      </GasListItem>
      <GasListItem>
        <GasListItemLabel>L2</GasListItemLabel>
        <GasListItemValue>{gas?.blockL2}</GasListItemValue>
      </GasListItem>
      {activeNetwork === Network.ETHEREUM ? (
        <GasListItem>
          <GasListItemLabel>Last Verified Block</GasListItemLabel>
          <GasListItemValue>
            {Number(verifierStatus?.matchedBlock || 0)}
          </GasListItemValue>
        </GasListItem>
      ) : null}
    </GasListContainer>
  )
}

export default GasWatcher
