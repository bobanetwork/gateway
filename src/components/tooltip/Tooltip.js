import React from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'
import * as S from './Tooltip.styles';



function Tooltip({title,arrow = true,children,...rest}) {
  if (title) {
    return (
      <MuiTooltip
        {...rest}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: '12px',
              background: '#545454',
              padding: '16px'
            }
          }
        }}
        title={<S.Title>{title}</S.Title>}
        arrow={arrow}
      >
        {children}
      </MuiTooltip>
    )
  } else {
    return children
  }
}

export default React.memo(Tooltip)
