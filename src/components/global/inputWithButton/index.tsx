import { InputContainer, Input, InputActionButton } from './styles'
import React, { FC } from 'react'

interface Props {
  placeholder: string
  buttonLabel: string
  name: string
  error?: boolean
  disabled?: boolean
  type?: string
  value?: any
  onButtonClick: (e: any) => void
  onChange: (e: any) => void
}

const InputWithButton: FC<Props> = ({
  onButtonClick,
  buttonLabel,
  name,
  type,
  value,
  error,
  disabled,
  onChange,
  placeholder,
}) => {
  return (
    <InputContainer error={error}>
      <Input
        type={type}
        value={value}
        disabled={disabled || error}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onWheel={(e: any) => {
          e.target.blur()
          e.stopPropagation()
          setTimeout(() => {
            e.target.focus()
          }, 0)
        }}
      />
      <InputActionButton disabled={disabled || error} onClick={onButtonClick}>
        {buttonLabel}
      </InputActionButton>
    </InputContainer>
  )
}

export default InputWithButton
