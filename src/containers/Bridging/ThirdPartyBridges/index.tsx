import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'

import { Typography } from 'components/global'
import useThirdPartyBridges from 'hooks/useThirdPartyBridges'
import { useTheme } from 'styled-components'
import { Network, NetworkType } from 'util/network/network.util'
import { SectionLabel } from '../chain/styles'
import {
  BridgeIcon,
  BridgeItem,
  BridgeLabel,
  BridgeList,
  ThirdPartyBridgesContainer,
} from './styles'
import { IThirdPartyBridge } from './types'

const ThirdPartyBridges: FC = () => {
  const networkType = useSelector(selectActiveNetworkType())
  const network = useSelector(selectActiveNetwork())
  const { loading, bridges } = useThirdPartyBridges<IThirdPartyBridge[]>()

  const theme: any = useTheme()

  if (networkType !== NetworkType.MAINNET) {
    return <></>
  }

  return (
    <ThirdPartyBridgesContainer>
      <SectionLabel variant="body2">Third party bridges</SectionLabel>
      {network !== Network.ETHEREUM ? (
        <BridgeList empty>
          <Typography variant="body1">No bridges available</Typography>
        </BridgeList>
      ) : (
        <BridgeList>
          {!loading ? (
            Array.isArray(bridges) &&
            bridges.map((bridge: IThirdPartyBridge) => (
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
            ))
          ) : (
            <Typography variant="body1">Loading ...</Typography>
          )}
        </BridgeList>
      )}
    </ThirdPartyBridgesContainer>
  )
}

export default ThirdPartyBridges
