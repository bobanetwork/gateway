import { HelpOutline } from '@mui/icons-material'
import { Heading, Typography } from 'components/global'
import styled, { css } from 'styled-components'
import { mobile } from 'themes/screens'
import {
  Header,
  Arrow,
  IconContainer,
  DropdownBody,
  DropdownContent,
  Option,
} from 'components/global/dropdown/styles'
import { Dropdown } from 'components/global/dropdown'

export const FeeSwitcherWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-around;
  height: 48;
  ${mobile(css`
    display: none;
  `)}
`

export const FeeSwitcherLabel = styled(Heading).attrs({
  variant: 'h5',
})`
  white-space: nowrap;
  padding: 5px 10px;
`

export const FeeSwitcherIcon = styled(HelpOutline)`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[100]};
`

export const FeeSwitcherLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`
export const FeeLabel = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${({ theme: { name, colors } }) =>
    name === 'light' ? colors.gray[600] : colors.gray[100]};
`

export const FeeSwitchterDropdown = styled(Dropdown)`
  ${Header} {
    border: unset;
    border-radius: 33px;
    width: 107px;
    height: 40px;
    min-width: unset;
    padding: 8px 8px;
    display: flex;
    ${(props) =>
      props.theme.name === 'light' &&
      css`
        background: ${props.theme.colors.gray[50]};
        color: ${props.theme.colors.gray[800]};
      `}
    ${(props) =>
      props.theme.name === 'dark' &&
      css`
        background: ${props.theme.colors.gray[400]};
        color: ${props.theme.colors.gray[50]};
      `};
    div {
      width: 100%;
      justify-content: space-around;
    }
    ${Arrow} {
      width: unset;
      margin-left: unset;
      svg {
        ${(props) =>
          props.theme.name === 'light' &&
          css`
            fill: ${props.theme.colors.gray[800]};
          `}
        ${(props) =>
          props.theme.name === 'dark' &&
          css`
            fill: ${props.theme.colors.gray[50]};
          `};
      }
    }
    ${IconContainer} {
      width: 24px;
      height: 24px;
      margin-right: unset;
    }
  }
  ${DropdownBody} {
    border-radius: 8px;
    padding: unset;
    height: auto;
    width: auto;
    left: 1px;
    ${(props) =>
      props.theme.name === 'light' &&
      css`
        background: ${props.theme.colors.gray[50]};
        border: unset;
        color: ${props.theme.colors.gray[800]};
        box-shadow: 2px 2px 25px 0px rgba(0, 0, 0, 0.25);
      `}
    ${(props) =>
      props.theme.name === 'dark' &&
      css`
        background: ${props.theme.colors.gray[500]};
        border: 1px solid ${props.theme.colors.gray[400]};
        color: ${props.theme.colors.gray[50]};
      `};
    ${IconContainer} {
      width: 24px;
      height: 24px;
      margin-right: unset;
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
      width: 87px;
      height: 32px;
      transition: all 0.25s ease;
      justify-content: flex-start;
      border-radius: 8px;
      padding: 8px;
      box-sizing: border-box;
      gap: 8px;
      &:hover {
        background: ${(props) => props.theme.colors.gray[400]};
      }

      ${(props) =>
        props.theme.name === 'light' &&
        css`
          svg {
            fill: ${props.theme.colors.gray[800]};
          }
        `}
      ${(props) =>
        props.theme.name === 'dark' &&
        css`
          svg {
            fill: ${props.theme.colors.gray[100]};
          }
        `}
    }
  }
`
