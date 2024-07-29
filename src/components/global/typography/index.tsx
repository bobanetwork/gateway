import React, { FC } from 'react'
import { StyledText } from './style'
import { TypographyProps } from './types'

/**
 *
 * @param
 * component : will have default as <p> since it'll propbably be our most used tag.
 * variant : can be one  | 'head' | 'title' | 'body1' | 'body2' | 'body3' | 'subtitle'
 *
 * @returns react component.
 */

export const Typography: FC<TypographyProps> = ({
  children,
  component = 'p',
  variant,
  ...rest
}) => {
  return (
    <StyledText as={component} {...rest} variant={variant}>
      {children}
    </StyledText>
  )
}
