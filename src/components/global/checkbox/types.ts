export interface CheckboxWithLabelProps {
  label?: string
  testId?: string
  checked?: boolean
  onChange: (isChecked: boolean) => void
}
