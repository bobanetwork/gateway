import styled, { css } from 'styled-components'
import { sdesktop } from 'themes/screens'

export const PageContainer = styled.div`
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
