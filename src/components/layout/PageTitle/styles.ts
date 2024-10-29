import styled, { css } from 'styled-components'

import { Heading } from 'components/global/heading'
import { Typography } from 'components/global/typography'
import { mobile } from 'themes/screens'

export const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 50px 15px;
  gap: 15px 0px;
  ${mobile(css`
    text-align: center;
  `)}
`

export const Title = styled(Heading)`
  font-family: Montserrat;
  font-size: 36px;
  font-weight: 700;
  line-height: 43.88px;
  text-align: left;
  color: ${(props) =>
    props.theme.name === 'light' ? props.theme.colors.gray[800] : '#fff'};
`

export const Slug = styled(Typography)`
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  text-align: center;
  color: ${(props) =>
    props.theme.name === 'light' ? props.theme.colors.gray[700] : '#acacac'};
`
