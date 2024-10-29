import { ReactNode } from 'react'

export type VariantType =
  | 'h1'
  | 'head'
  | 'title'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'subtitle'

type ComponentType = 'p' | 'span' | 'a'

export interface TypographyProps {
  variant: VariantType
  color?: string
  error?: boolean
  children?: ReactNode
  className?: string
  component?: ComponentType
  style?: any
}

export interface TypographyStyleProps {
  size: string
  lineHeight: string
  fontFamily: string
  fontWeight: number
}
