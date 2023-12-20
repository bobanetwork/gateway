import BanxaLogo from 'assets/images/bridges/banxa.svg'
import BoringDaoLogo from 'assets/images/bridges/Boringdao.png'
import ChainswapLogo from 'assets/images/bridges/chainswap.png'
import RangoExchangeLogo from 'assets/images/bridges/rango_exchange.png'
import SynapseLogo from 'assets/images/bridges/synapse.png'

import CelerLogoDark from 'assets/images/bridges/dark/dark_celer.png'
import RubicExchangeLogoDark from 'assets/images/bridges/dark/dark_rubic_exchange.png'
import ViaProtocolLogoDark from 'assets/images/bridges/dark/dark_via_protocol.png'
import CelerLogoLight from 'assets/images/bridges/light/light_celer.png'
import RubicExchangeLogoLight from 'assets/images/bridges/light/light_rubic_exchange.png'
import ViaProtocolLogoLight from 'assets/images/bridges/light/light_via_protocol.png'

export interface IBridges {
  name: string
  icon?: any
  iconLight?: any
  iconDark?: any
  link?: string
}

export const bobaBridges: IBridges[] = [
  {
    name: 'Banxa',
    icon: BanxaLogo,
    link: 'https://boba.banxa.com/',
  },
  {
    name: 'BoringDAO',
    icon: BoringDaoLogo,
    link: 'https://boba.network/project/boringdao/',
  },
  {
    name: 'Celer',
    icon: null,
    iconLight: CelerLogoLight,
    iconDark: CelerLogoDark,
    link: 'https://boba.network/project/celer/',
  },
  {
    name: 'Chainswap',
    icon: ChainswapLogo,
    link: 'https://exchange.chainswap.com/#/bridge',
  },
  {
    name: 'Rango Exchange',
    icon: RangoExchangeLogo,
    link: 'https://boba.network/project/rango-exchange/',
  },
  {
    name: 'Rubic Exchange',
    icon: null,
    iconLight: RubicExchangeLogoLight,
    iconDark: RubicExchangeLogoDark,
    link: 'https://boba.network/project/rubic-exchange/',
  },
  {
    name: 'Synapse',
    icon: SynapseLogo,
    link: 'https://boba.network/project/synapse/',
  },
  {
    name: 'Via Protocol',
    icon: null,
    iconLight: ViaProtocolLogoLight,
    iconDark: ViaProtocolLogoDark,
    link: 'https://boba.network/project/via-protocol/',
  },
]
