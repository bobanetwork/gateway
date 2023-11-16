import React, { FC } from 'react'
import { ButtonContainer, SpinLoader } from './styles'
import { ButtonTypes } from './types'
import Tooltip from 'components/tooltip/Tooltip'

export const Button: FC<ButtonTypes> = ({
  disabled = false,
  loading = false,
  small = false,
  outline = false,
  transparent = false,
  tiny = false,
  tooltipTitle = null,
  className,
  label,
  onClick,
  style,
  ...rest
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <ButtonContainer
        style={style}
        type="button"
        disabled={disabled}
        loading={loading}
        tiny={tiny}
        transparent={transparent}
        small={small}
        outline={outline}
        onClick={!disabled ? onClick : () => {}}
        className={className}
        label={label}
        {...rest}
      >
        {loading && <SpinLoader />} {label}
      </ButtonContainer>
    </Tooltip>
  )
}
