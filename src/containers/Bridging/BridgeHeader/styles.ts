import { SettingsOutlined } from '@mui/icons-material'
import styled from 'styled-components'

export const BridgeHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const IconWrapper = styled.div<{ inline?: boolean }>`
  padding: 8px;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ theme: { name, colors } }) =>
      name === 'light' ? colors.gray[400] : colors.gray[300]};
  }
`

export const GearIcon = styled(SettingsOutlined)`
  cursor: pointer;
`

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
