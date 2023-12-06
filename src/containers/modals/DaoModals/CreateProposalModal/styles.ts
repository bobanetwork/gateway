import styled from 'styled-components'
import { Typography } from 'components/global'

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

export const ButtonContainer = styled.div`
  width: 100%;
`

export const ModalContainer = styled.div`
    display: flex, 
    flex-direction: column, 
    gap: 10px
`
