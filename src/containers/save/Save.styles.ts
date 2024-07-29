import styled, { css } from 'styled-components'
import { mobile, sdesktop } from 'themes/screens'

export const StakePageContainer = styled.div`
  margin: 0px auto 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0px 10px 50px 10px;
  width: 100%;
  max-width: 1024px;
  ${sdesktop(css`
    padding: 0px 0px 50px 0px;
  `)}
`

export const StakeItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 20px 0px;
  ${sdesktop(css`
    overflow-x: auto;
    align-items: flex-start;
    padding-right: 25px;
  `)}
`

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  width: 100%;
  gap: 25px 0px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.box.background};
  border: 1px solid ${(props) => props.theme.colors.box.border};
  ${sdesktop(css`
    flex-direction: row;
    justify-content: space-between;
  `)}
  ${mobile(css`
    flex-direction: column !important;
  `)}
   > div {
    ${mobile(css``)}
    button {
      ${mobile(css`
        width: 100%;
        border-radius: 8px;
      `)}
    }
  }
`

export const GridContainer = styled.div`
  display: flex;
  gap: 0px 35px;
  ${sdesktop(css`
    flex-direction: column;
    gap: 35px 0px;
  `)}
  ${mobile(css`
    flex-direction: column-reverse;
  `)}
  > div {
    width: 100%;
    &:first-of-type {
      max-width: 445px;
      ${sdesktop(css`
        max-width: 100%;
      `)}
    }
    &:last-of-type {
      ${mobile(css`
        > div {
          background: transparent;
          border: 0px;
        }
      `)}
    }
  }
`

export const Flex = styled.div`
  display: flex;
  padding-right: 35px;
  justify-content: space-between;
  ${sdesktop(css`
    gap: 0px 35px;
  `)}
`

export const TitleContainer = styled.div`
  padding: 25px 0px;
`

export const PaddingContainer = styled.div`
  padding: 0px;
  ${sdesktop(css`
    padding: 0px 15px;
  `)}
`

export const MobileTableContainer = styled.div`
  ${sdesktop(css`
    padding-left: 15px;
  `)}
`
