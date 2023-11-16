import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Field = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `1px solid ${(theme.palette.background as any).secondaryLight}`,
  transition: 'all 200ms ease -in -out',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: '12px',
}))

export const SelectedContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  height: '40px',
  borderRadius: '10px',
  background: (theme.palette.background as any).secondary,
}))
