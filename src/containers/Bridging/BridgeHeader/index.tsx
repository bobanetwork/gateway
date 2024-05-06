import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'
import { openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import Tooltip from 'components/tooltip/Tooltip'
import React from 'react'
import { useDispatch } from 'react-redux'
import styled, { useTheme } from 'styled-components'
import { BridgeHeaderWrapper, GearIcon, IconWrapper } from './styles'
import { useNetworkInfo } from 'hooks/useNetworkInfo'

export const LabelStyle = styled.span`
  color: var(--Gray-50, #eee);
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 138.3%;
`

export const ValueStyle = styled.span`
  color: var(--Gray-50, #eee);
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 138.3%;
`

const BridgeHeader = () => {
  const dispatch = useDispatch<any>()
  const theme: any = useTheme()

  const iconColor =
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[100]

  const openSettingModal = () => {
    dispatch(openModal({ modal: 'settingsModal' }))
  }

  // TODO: update the copy when the anchorage bridge is enabled.
  const ClassicBridgeInfo = () => {
    return (
      <>
        <LabelStyle data-testid="tooltip-cb-t">Classic Bridge</LabelStyle>{' '}
        <br />
        <ValueStyle data-testid="tooltip-cb-d">
          Although this option is always available, it takes 7 days to receive
          your funds when withdrawing from L2 to L1.
        </ValueStyle>
        <br />
        <br />
      </>
    )
  }

  const LightBridgeInfo = () => {
    return (
      <>
        {' '}
        <LabelStyle data-testid="tooltip-lb-t">Light Bridge</LabelStyle>
        <br />
        <ValueStyle data-testid="tooltip-lb-d">
          Bridge is an easy, fast, and cheap bridging solution that quickly gets
          your funds to your destination chain only available for a few selected
          assets (BOBA, ETH, BNB).
        </ValueStyle>
      </>
    )
  }

  return (
    <BridgeHeaderWrapper>
      <Heading variant="h2">
        Bridge
        <Tooltip
          data-testid="tooltip-btn"
          title={
            <>
              <ClassicBridgeInfo />
              <LightBridgeInfo />
            </>
          }
        >
          <IconWrapper inline={true} style={{ marginLeft: '5px' }}>
            <HelpOutlineOutlined
              fontSize="small"
              sx={{ cursor: 'pointer', color: iconColor }}
            />
          </IconWrapper>
        </Tooltip>
      </Heading>
      <IconWrapper>
        <GearIcon
          sx={{ color: iconColor }}
          onClick={openSettingModal}
          data-testid="setting-btn"
        />
      </IconWrapper>
    </BridgeHeaderWrapper>
  )
}

export default BridgeHeader
