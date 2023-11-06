import { Typography } from 'components/global'
import styled, { css } from 'styled-components'

export const BridgeItem = styled.a`
  cursor: pointer;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-height: 64px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme: { colors, name } }) =>
      name === 'light' ? colors.gray[500] : colors.gray[300]};
  color: ${(props) => props.theme.color};
  text-decoration: none;
  &:hover {
    background: ${({ theme: { colors, name } }) =>
      name === 'light' ? colors.gray[500] : colors.gray[300]};
  }
`
export const BridgeIcon = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50%;
`
export const BridgeLabel = styled(Typography).attrs({
  variant: 'title',
})`
  flex: 1;
  line-height: normal;
  text-transform: capitalize;
`

export const ThirdPartyBridgesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`
export const BridgeList = styled.div.withConfig({
  shouldForwardProp: (prop) => !['empty'].includes(prop),
})<{ empty?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 320px;
  overflow-y: scroll;

  ${({ empty, theme: { name, colors } }) =>
    empty &&
    css`
      display: grid;
      justify-content: center;
      align-content: center;
      color: ${name === 'light' ? colors.gray[700] : colors.gray[100]};
    `}
`
