export interface IAppAlert {
  type: 'success' | 'warning' | 'info'
  key: string
  message?: string
  canClose?: boolean
  isHidden?: boolean
  Component?: React.ElementType<{ className?: string }>
}
