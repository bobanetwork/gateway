import styled, { css } from 'styled-components'
import { mobile } from 'themes/screens'

export const TabContainer = styled.div`
  display: flex;
  ${mobile(css`
    width: 110%;
    overflow-x: auto;
    margin: 10px 0px;
    padding: 10px 50px 10px 25px;
  `)}
`

export const TabItem = styled.div`
  cursor: pointer;
  margin: 0px 8px;
  background: transparent;
  border: 1px solid #007bff;
  color: #007bff;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 0px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.2s,
    color 0.2s;
  border: 2px solid transparent;

  color: ${(props) => props.theme.colors.gray[100]};
  ${(props) =>
    props.theme.name === 'light' &&
    css`
      color: ${props.theme.colors.gray[600]};
      &.active {
        background: ${props.theme.colors.gray[50]};
        border-color: ${props.theme.colors.gray[50]};
        color: ${props.theme.colors.gray[800]};
      }
    `}
  ${(props) =>
    props.theme.name === 'dark' &&
    css`
      border: 2px solid ${(props) => props.theme.colors.gray[200]};
      &.active {
        border-color: ${(props) => props.theme.colors.green[300]};
        color: white;
      }
    `}

  &:first-of-type {
    margin-left: 0px;
  }
`
