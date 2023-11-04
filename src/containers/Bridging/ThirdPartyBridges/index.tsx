import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'

import { NETWORK, NETWORK_TYPE } from 'util/network/network.util'
import { SectionLabel } from '../chain/styles'
import { IBridges, bobaBridges } from './data'
import {
  BridgeIcon,
  BridgeItem,
  BridgeLabel,
  BridgeList,
  ThirdPartyBridgesContainer,
} from './styles'
import { Typography } from 'components/global'
import { useTheme } from 'styled-components'

const ThirdPartyBridges: FC = () => {
  const networkType = useSelector(selectActiveNetworkType())
  const network = useSelector(selectActiveNetwork())

  const theme: any = useTheme()

  if (networkType !== NETWORK_TYPE.MAINNET) {
    return <></>
  }

  return (
    <ThirdPartyBridgesContainer>
      <SectionLabel variant="body2">Third party bridges</SectionLabel>
      {network !== NETWORK.ETHEREUM ? (
        <BridgeList empty>
          <Typography variant="body1">No bridges available</Typography>
        </BridgeList>
      ) : (
        <BridgeList>
          {bobaBridges.map((bridge: IBridges) => (
            <BridgeItem
              href={bridge.link}
              target="_blank"
              rel="noopener noreferrer"
              key={bridge.name}
              data-testid="bridge-item"
            >
              <BridgeIcon>
                <img
                  src={
                    bridge.icon
                      ? bridge.icon
                      : theme.name === 'light'
                      ? bridge.iconLight
                      : bridge.iconDark
                  }
                  alt={`${bridge.name} ${
                    bridge.icon ? '' : theme.name + '-'
                  }logo`}
                  width="32px"
                  height="32px"
                />
              </BridgeIcon>
              <BridgeLabel>{bridge.name}</BridgeLabel>
            </BridgeItem>
          ))}
        </BridgeList>
      )}
    </ThirdPartyBridgesContainer>
  )
}

export default ThirdPartyBridges
