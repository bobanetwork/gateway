import styled from 'styled-components'
import ActionIcon from 'assets/images/icons/actions.svg'
import { Svg } from 'components/global'

export const EarnListItemContainer = styled.div`
  cursor: pointer;
  background: ${(props) => props.theme.colors.popup};
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  padding: 15px 25px;
  border-radius: 8px;
  &:hover {
    background: ${(props) => props.theme.colors.gray[300]};
  }
`

export const IconWrapper = styled.div`
  border-radius: 50%;
  cursor: pointer;
  margin: auto;
  &:hover {
    background: ${({ theme: { name, colors } }) =>
      name === 'light' ? colors.gray[400] : colors.gray[300]};
  }
  div {
    padding: 4px;
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export const MoreActionIcon = styled(Svg).attrs(({ theme }) => ({
  src: ActionIcon,
  fill: `${
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[100]
  }`,
}))`
  div {
    cursor: pointer;
    display: flex;
    margin: auto;
  }
`
