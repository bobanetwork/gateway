import styled from 'styled-components'
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
  background: #d2ecfa;
  width: 600px;
  height: fit-content;
  border-radius: 10px;
`
export const ConfirmActionButton = styled.button`
  padding: 4px;
  border-radius: 5px;
  font-size: 14px;
  color: #3d4677;
  font-weight: bold;
  background: #d2ecfa;
  border: 1px solid gray;
  width: fit-content;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
  }
`

export const ConfirmLabel = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) => 'black'};
`
