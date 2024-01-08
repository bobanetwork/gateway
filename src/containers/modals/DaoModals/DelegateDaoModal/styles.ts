import styled from 'styled-components'
import { Typography } from 'components/global/typography'

export const DescriptionStyled = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[700] : theme.colors.gray[100]};
  line-height: 18px;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const Detail = styled.span`
  display: block;
`
