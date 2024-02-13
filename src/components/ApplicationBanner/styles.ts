import { Svg, Typography } from 'components/global'
import styled from 'styled-components'
import Close from 'assets/images/close.svg'

export const BannerWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100vw;
  max-width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2px;
`
export const BannerContainer = styled('div')`
  position: relative;
  transition: max-height 0.4s;
  padding: 5px 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: ${({ theme: { colors } }) => colors.green[300]};
  color: ${(props) => props.theme.primaryfg};

  &.open {
    max-height: 60px;
  }

  @media ${(props) => props.theme.screen.tablet} {
    padding: 0 10px;
    &.open.expand {
      max-height: 120px;
    }
  }
`
export const BannerContent = styled('div')``

export const BannerAction = styled('div')`
  cursor: pointer;
`

export const CloseIconWrapper = styled('div')`
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    background: ${({ theme: { name, colors } }) =>
      name === 'light' ? colors.green[200] : colors.green[100]};
  }
  div {
    padding: 1px;
    height: 24px;
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`
export const BannerText = styled(Typography).attrs({
  variant: 'body2',
})`
  text-align: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 10px 0;

  @media ${(props) => props.theme.screen.mobile} {
    padding: 5px 10px;
  }

  a {
    color: #000;
    text-decoration: underline;
    cursor: pointer;
    opacity: 0.65;
    text-transform: capitalize;
  }
`
export const CloseIcon = styled(Svg).attrs({
  src: Close,
  fill: '#fff',
})`
  height: 12px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
  }
  svg {
    max-width: 24px;
    min-width: 10px;
    height: auto;
    stroke: #000;
  }

  &:hover {
    cursor: pointer;
  }
`
