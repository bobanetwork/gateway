// TODO: cleanup mui
import { Box } from '@mui/material'
import styled, { css } from 'styled-components'
import ModalUnstyled from '@mui/base/ModalUnstyled'
import Close from 'assets/images/close.svg'
import { Svg } from 'components/global'

export const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 80;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  ${(props) =>
    props.theme.name === 'light' &&
    css`
      background: rgba(0, 0, 0, 0.6);
    `}
  ${(props) =>
    props.theme.name === 'dark' &&
    css`
      background: rgba(0, 0, 0, 0.4);
    `}
`

interface StyleProps {
  transparent?: boolean
  shouldForwardProp?: (props: StyleProps) => boolean
}

export const Style = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  background: ${(props) => props.theme.colors.popup};
  width: 100%;

  ${(props) =>
    props.transparent &&
    css`
      background: ${props.theme.name === 'light' ? '#fff' : 'transparent'};
    `}

  backdrop-filter: ${(props) => (props.transparent ? 'none' : 'blur(15px)')};
  padding: 16px;
  outline: 0;
  box-sizing: border-box;
  border-radius: 12px;

  ${(props) =>
    props.shouldForwardProp &&
    `
    ${props.shouldForwardProp(props)}
  `}
`
export const WrapperActionsModal = styled(Box)<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`

export const ModalHead = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`
export const IconButtonTag = styled.div`
  margin-left: auto;
  cursor: pointer;
  > div > div {
    display: flex;
  }
  :hover {
    > div > div {
      border-radius: 50%;
      background: rgb(185 185 185 / 40%);
      display: flex;
      svg: {
        fill: white;
      }
    }
  }
`

export const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  gap: 10px;
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
    stroke: ${({ theme }) => theme.color};
  }
`
