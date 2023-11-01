import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'
import { openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import Tooltip from 'components/tooltip/Tooltip'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveNetworkType } from 'selectors'
import styled, { useTheme } from 'styled-components'
import { NETWORK_TYPE } from 'util/network/network.util'
import { BridgeHeaderWrapper, GearIcon, IconWrapper } from './styles'

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
  const isTestnet =
    useSelector(selectActiveNetworkType()) === NETWORK_TYPE.TESTNET

  const iconColor =
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[100]

  const openSettingModal = () => {
    dispatch(openModal('settingsModal'))
  }

  const ClassicBridgeInfo = () => {
    return (
      <>
        <LabelStyle>Classic Bridge</LabelStyle> <br />
        <ValueStyle>
          Although this option is always available, it takes 7 days to receive
          your funds when withdrawing from L2 to L1.
        </ValueStyle>
        <br />
        <br />
      </>
    )
  }

  const LightBridgeInfo = () => {
    if (!isTestnet) {
      return <></>
    }
    return (
      <>
        {' '}
        <LabelStyle>Light Bridge</LabelStyle>
        <br />
        <ValueStyle>
          Bridge assets instantaneously and even between L2's. This option is
          only available for a few selected assets (mostly BOBA).
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
