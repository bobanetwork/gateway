import styled, { css } from 'styled-components'
import { Typography } from 'components/global'

export const ConfirmModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  gap: 16px;
  padding: 16px;
  z-index: 1000;
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: fit-content;
  border-radius: 10px;
  ${({ theme: { name, colors } }) => css`
    border: 1px solid ${name === 'light' ? colors.blue[200] : colors.blue[100]};
    background: ${name === 'light' ? colors.blue[50] : colors.blue[500]};
    color: ${name === 'light' ? colors.blue[500] : colors.blue[100]};
  `}
`
export const ConfirmActionButton = styled.button`
  padding: 4px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  background: #d2ecfa;
  width: fit-content;
  text-transform: uppercase;
  cursor: pointer;
`

export const ConfirmLabel = styled(Typography).attrs({
  variant: 'body2',
})``
