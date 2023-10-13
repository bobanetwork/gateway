export type LayerType = 'L1' | 'L2'

export interface LayerIconProps {
  selectedLayer: LayerType
}

export interface ConfirmItemProps {
  label: string
  value: string | JSX.Element
}
