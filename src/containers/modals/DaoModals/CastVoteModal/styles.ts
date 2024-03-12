import { Typography } from 'components/global'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
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
