import styled from 'styled-components'
import { BackgroundProps } from './types'
const gridHeight = '200vh'

const linesColor = (theme: string) => {
  if (theme === 'light') {
    return 'rgba(0, 0, 0, 0.025)'
  } else {
    return 'rgba(255, 255, 255, 0.025)'
  }
}

const gradientColor = (theme: string) => {
  if (theme === 'light') {
    return 'radial-gradient(70% 90% at 50% 50%,rgba(199,219,1,0.9) 20%,rgba(216,243,1,0.1) 60%,rgba(174,219,1,0) 0%)'
  } else {
    return 'radial-gradient(55.87% 55.87% at 50.00% 50.00%, rgba(174, 219, 1, 0.24) 19.79%, rgba(174, 219, 1, 0.08) 62.50%, rgba(174, 219, 1, 0.00) 91.67%);'
  }
}

export const BackgroundContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: block;
  overflow: hidden;
  position: fixed;
  z-index: 0;
`

export const GridBackground = styled.div`
  width: 100%;
  height: ${gridHeight};
  overflow: hidden;
  perspective: calc(${gridHeight} * 90);
  background-color: ${({ theme }) =>
    theme.name === 'light' ? '#E5E5E1' : 'transperant'};
`

export const GridFade = styled.div<BackgroundProps>`
  width: 100%;
  height: 100%;
  max-height: 870px;
  position: absolute;
  opacity: ${({ theme }) => (theme.name === 'light' ? '50%' : 'unset')};
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -175%);
  will-change: translate;
  transition: transform 1s ease;
  background-image: ${(props) => gradientColor(props.theme.name)};
  background-clip: padding-box;
  background-origin: content-box;
  ${({ position }) =>
    position === 'top' &&
    `
    transform:translate(-50%, -150%);
  `};
`

export const GridLines = styled.div`
  width: 100%;
  height: 200%;
  background-image: linear-gradient(
      to right,
      ${(props) => linesColor(props.theme.name)} 1px,
      transparent 0
    ),
    linear-gradient(
      to bottom,
      ${(props) => linesColor(props.theme.name)} 1px,
      transparent 0
    );
  background-size: 50px 50px;
  background-repeat: repeat;
  transform-origin: 100% 0 0;
  will-change: transform;
`
