import { Typography } from 'components/global'
import styled from 'styled-components'

export const WithdrawConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`

export const ConfirmLabel = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[700] : theme.colors.gray[100]};
`
export const ConfirmValue = styled(Typography).attrs({
  variant: 'body1',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[800] : theme.colors.gray[50]};
  text-transform: capitalize;
`
export const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`
export const ConfirmValueWithIcon = styled.div`
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
