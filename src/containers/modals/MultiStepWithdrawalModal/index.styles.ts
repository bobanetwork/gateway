import { Button, Typography } from 'components/global'
import styled from 'styled-components'
import { Box } from '@mui/material'

export const ConfirmModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`
export const SubLabel = styled(Typography).attrs({
  variant: 'body3',
})`
  color: ${({ theme }) => theme.color};
`
export const SubValue = styled(Typography).attrs({
  variant: 'body1',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[800] : theme.colors.gray[50]};
  text-transform: capitalize;
`

export const LightText = styled.span`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[200]};
`

export const LayerNames = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  svg,
  img {
    height: 30px;
    width: 30px;
  }
`

export const Separator = styled.hr`
  width: 90%;
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[400]};
`

export const ConfirmActionButton = styled(Button)`
  width: 100%;
`

export const SecondaryActionButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[400] : theme.colors.gray[100]};
  width: 100%;
  box-shadow: none;
  :hover {
    background: transparent;
    opacity: 75%;
  }
`

export const PassiveStepIcon = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  margin-right: 8px;
  background-color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[400]};
`

export const PassiveStepIconActive = styled(PassiveStepIcon)`
  background-color: ${(props) => props.theme.colors.green[300]};
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`
