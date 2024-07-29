import styled, { css } from 'styled-components'
import { mobile } from 'themes/screens'

export const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.colors.box.border};
  border-radius: 12px;
  background: ${(props) => props.theme.colors.box.background};

  padding: 20px 10px;
`

export const GridContainer = styled.div`
  ${mobile(css`
    justify-content: flex-start;
  `)}
`

export const GridItemTag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

export const GridItemTagR = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin: 8px;
  padding-right: 8px;
`

export const ItemHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  text-align: left;
  padding-left: 8px;
`
