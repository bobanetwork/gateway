import styled, { css } from 'styled-components'
import { Typography } from 'components/global'

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`
export const StyledDescription = styled(Typography).attrs({
  variant: 'body2',
})`
  ${(props) =>
    props.theme.name === 'light' &&
    css`
      color: ${props.theme.colors.gray[700]};
    `}
  ${(props) =>
    props.theme.name === 'dark' &&
    css`
      color: ${props.theme.colors.gray[100]};
    `}
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const DescriptionStyled = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[700] : theme.colors.gray[100]};
  line-height: 18px;
`
