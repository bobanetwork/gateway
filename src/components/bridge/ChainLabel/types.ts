export interface ChainLabelInterface {
  direction: string
}

export type IconType = {
  ethereum: ({ selected }: { selected?: boolean | undefined }) => Element
  bnb: ({ selected }: { selected?: boolean | undefined }) => Element
  optimism: ({ selected }: { selected?: boolean | undefined }) => Element
  arbitrum: ({ selected }: { selected?: boolean | undefined }) => Element
}

export type DirectionType = {
  from: JSX.Element
  to: JSX.Element
}
