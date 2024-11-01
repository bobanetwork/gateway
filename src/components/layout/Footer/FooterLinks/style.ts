import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { mobile, tablet } from 'themes/screens'

export const StyledLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  ${mobile(css`
    margin: 10px auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 80%;
  `)}
`
export const ScanContainer = styled.div`
  margin: 10px 0px;
`

export const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0;
  gap: 32px;

  ${tablet(css`
    flex-direction: row;
    align-items: center;
    margin: 10px auto;
  `)}

  ${mobile(css`
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  `)}
`

export const StyledLink = styled.a`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) =>
    theme.name === 'light'
      ? theme.colors['gray'][600]
      : theme.colors['gray'][200]};
  &:hover,
  &.active {
    color: ${({ theme }) =>
      theme.name === 'light'
        ? theme.colors['gray'][800]
        : theme.colors['gray'][100]};
  }
`
export const StyledNavLink = styled(NavLink)`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) =>
    theme.name === 'light'
      ? theme.colors['gray'][600]
      : theme.colors['gray'][200]};
  &:hover,
  &.active {
    color: ${({ theme }) =>
      theme.name === 'light'
        ? theme.colors['gray'][800]
        : theme.colors['gray'][100]};
  }
`
