import styled, { css } from 'styled-components'
import { FeeSwitchterDropdown } from 'components/layout/Header/feeSwitcher/styles'
import {
  Header,
  DropdownContent,
  Option,
} from 'components/global/dropdown/styles'
import { mobile } from 'themes/screens'

export const NetworkSelectorDropdown = styled(FeeSwitchterDropdown)`
  ${mobile(css`
    display: none;
  `)}
  ${Header} {
    width: 200px;
    height: 40px;
    img {
      border-radius: 50%;
      height: 24px;
      width: 24px;
    }
  }
  ${DropdownContent} {
    border-radius: inherit;
    padding: 8px 8px 16px 8px;
    gap: 8px;
    min-height: unset;
    max-height: 238px;
    max-width: 204px;
    ${(props) =>
      props.theme.name === 'dark' &&
      css`
        color: ${props.theme.colors.gray[100]};
      `}
    ${(props) =>
      props.theme.name === 'light' &&
      css`
        backdrop-filter: blur(15px);
        border: 1px solid ${props.theme.colors.gray[400]};
      `}
    & > ${Option} {
      width: 186px;
      height: 32px;
    }
  }
`
