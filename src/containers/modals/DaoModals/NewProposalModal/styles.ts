import styled from 'styled-components'
import { Typography } from 'components/global'

export const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ButtonContainer = styled.div`
  width: 100%;
  margin: 2px 0;
`

export const StyledDescription = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme, error }) =>
    error
      ? theme.colors.red[200]
      : theme.name === 'light'
      ? theme.colors.gray[700]
      : theme.colors.gray[100]};
`
