import { ElementType } from 'react'

import BNBIcon from 'components/icons/chain/L1/BNBIcon'
import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'

import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'
import BobaIcon from 'components/icons/chain/L2/BobaIcon'

type IconType = {
  L1: ElementType
  L2: ElementType
}

type NetworkIconsType = Record<string, IconType>

export const NETWORK_ICONS: NetworkIconsType = {
  ethereum: {
    L1: EthereumIcon,
    L2: BobaIcon,
  },
  bnb: {
    L1: BNBIcon,
    L2: BobaBNBIcon,
  },
}
