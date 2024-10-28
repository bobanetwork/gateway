import styled, { css } from 'styled-components'
import { TypographyStyleProps, VariantType } from './types'

const options: Record<string, TypographyStyleProps> = {
  h1: {
    size: '24px',
    fontFamily: 'Montserrat',
    lineHeight: '1',
    fontWeight: 500,
  },
  head: {
    size: '20px',
    lineHeight: '23px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  title: {
    size: '18px',
    lineHeight: '21px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  body1: {
    size: '16px',
    fontFamily: 'Inter',
    lineHeight: '19px',
    fontWeight: 500,
  },
  body2: {
    size: '14px',
    fontFamily: 'Inter',
    lineHeight: '16px',
    fontWeight: 500,
  },
  body3: {
    size: '12px',
    fontFamily: 'Inter',
    lineHeight: '14px',
    fontWeight: 500,
  },
  subtitle: {
    size: '12px',
    fontFamily: 'Inter',
    lineHeight: '14px',
    fontWeight: 400,
  },
}

export const StyledText = styled.p<{ variant?: VariantType }>`
  font-style: normal;
  ${({ variant }) =>
    variant &&
    options[variant] &&
    css`
      font-size: ${options[variant].size};
      line-height: ${options[variant].lineHeight};
      font-weight: ${options[variant].fontWeight};
      font-family: ${options[variant].fontFamily};
    `}
`
