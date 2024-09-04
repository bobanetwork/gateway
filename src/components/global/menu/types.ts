import { PopoverOrigin } from '@mui/material/Popover'
import { ReactElement, ReactNode } from 'react'

interface OptionProps {
  label?: string
  component?: ReactElement<any>
  onClick?: (d: any) => void
}

export interface MenuProps {
  name?: string
  label?: ReactNode | string
  children?: ReactNode
  variant?: 'outline' | 'standard'
  options: Array<OptionProps>
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
}
