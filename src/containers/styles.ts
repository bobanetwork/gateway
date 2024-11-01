import styled, { css } from 'styled-components'
import { mobile, sdesktop, tablet } from 'themes/screens'

export const PageLayoutStyle = styled.div`
  margin: 0px auto 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0px 50px 50px 50px;
  width: 100%;
  max-width: 1164px;
  ${sdesktop(css`
    padding: 0px 0px 50px 0px;
  `)}
  ${tablet(css`
    padding: 0px 50px;
  `)}
  ${mobile(css`
    padding: 0px 25px;
    margin: auto;
  `)}
`
