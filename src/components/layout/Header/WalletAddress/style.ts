import styled, { css } from 'styled-components'
import { FeeSwitchterDropdown } from '../feeSwitcher/styles'
import {
  Header,
  DropdownContent,
  Option,
} from 'components/global/dropdown/styles'

export const WalletAddressDropdown = styled(FeeSwitchterDropdown)`
  ${Header} {
    width: 162px;
    height: 40px;
    img {
      border-radius: 50%;
      height: 24px;
      width: 24px;
    }
  }
  ${DropdownContent} {
    border-radius: inherit;
    padding: 8px;
    gap: 8px;
    min-height: unset;
    ${(props) =>
      props.theme.name === 'light' &&
      css`
        backdrop-filter: blur(15px);
        border: 1px solid ${props.theme.colors.gray[400]};
      `}
    & > ${Option} {
      width: 145px;
      height: 32px;
      border: unset;
      &:hover {
        border: unset;
      }
    }
  }
`
