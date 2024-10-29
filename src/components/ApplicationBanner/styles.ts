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
  background: ${({ theme: { colors } }) => colors.green[300]};
  color: ${(props) => props.theme.primaryfg};
`

export const BannerCenter = styled('div')`
  margin: 0 auto;
  width: 90vw;
  height: 60px;
  max-width: 900px;
  text-align: center;
  position: relative;
  display: flex;
  overflow: hidden;
`

export const BannerContainer = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: var(--transition);
  // transition: max-height 0.4s;
  padding: 5px 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;

  &.activeSlide {
    opacity: 1;
    transform: translateX(0);
  }
  &.lastSlide {
    transform: translateX(-100%);
  }
  &.nextSlide {
    transform: translateX(100%);
  }

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
export const BannerContent = styled('div')`
  padding: 0px 20px;
`

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
  font-weight: 400;

  @media ${(props) => props.theme.screen.mobile} {
    padding: 5px 10px;
    font-size: 12px;
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
  cursor: pointer;

  div {
    display: flex;
  }
  svg {
    max-width: 24px;
    min-width: 10px;
    height: auto;
    stroke: #000;
  }
`

export const ArrowBtn = styled('button')`
  position: absolute;
  top: 30px;
  transform: translateY(-50%);
  background: var(--clr-grey-5);
  color: var(--clr-white);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1;
  border-color: transparent;
  font-size: 1rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  &.next {
    left: 0;
  }

  &.prev {
    right: 0;
  }
`
