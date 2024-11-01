import { Typography } from 'components/global'
import styled, { css } from 'styled-components'
import { mobile, tablet } from 'themes/screens'

export const GasListContainer = styled.div`
  self-align: flex-end;
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  ${tablet(css`
    margin: 10px auto;
  `)}
  ${mobile(css`
    margin: 10px auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  `)}
`

export const GasListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const GasListItemLabel = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) =>
    theme.name === 'light'
      ? theme.colors['gray'][600]
      : theme.colors['gray'][100]};
};
`

export const GasListItemValue = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme }) =>
    theme.name === 'light'
      ? theme.colors['gray'][700]
      : theme.colors['gray'][200]};};
`
