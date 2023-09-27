export interface InputProps {
  placeholder?: string
  label?: string
  type?: string
  disabled?: boolean
  disabledExitAll?: boolean
  icon?: React.ReactNode
  unit?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSelect?: (selectedValue: string) => void
  sx?: any
  paste?: boolean
  maxValue?: number
  fullWidth?: boolean
  size?: 'small' | 'medium' | undefined
  variant?: any
  newStyle?: boolean
  allowUseAll?: boolean
  onUseMax?: () => void
  loading?: boolean
  maxLength?: number
  selectOptions?: string[]
  defaultSelect?: string
  selectValue?: string
  style?: React.CSSProperties
  isBridge?: boolean
  openTokenPicker?: () => void
  textarea?: boolean
  maxRows?: number
}
