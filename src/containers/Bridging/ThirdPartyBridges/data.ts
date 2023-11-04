import BanxaLogo from 'assets/images/bridges/banxa.svg'
import BeamerLogo from 'assets/images/bridges/beamer.png'
import BoringDaoLogo from 'assets/images/bridges/Boringdao.png'
import ChainswapLogo from 'assets/images/bridges/chainswap.png'
import ConnextLogo from 'assets/images/bridges/connext.png'
import LayerswapLogo from 'assets/images/bridges/layerswap.png'
import MultichainLogo from 'assets/images/bridges/multichain.png'
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
    name: 'Beamer Bridge',
    icon: BeamerLogo,
    link: 'https://boba.network/project/beamer-bridge/',
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
    link: 'https://boba.network/project/chainswap/',
  },
  {
    name: 'Connext',
    icon: ConnextLogo,
    link: 'https://boba.network/project/connext/',
  },
  {
    name: 'Layerswap',
    icon: LayerswapLogo,
    link: 'https://boba.network/project/layerswap-io/',
  },
  {
    name: 'Multichain',
    icon: MultichainLogo,
    link: 'https://boba.network/project/multichain/',
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
