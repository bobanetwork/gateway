import { ROUTES_PATH } from 'util/constant'

interface LinkProps {
  label: string
  path: string
  isNav?: boolean
}

export const FOOTERLINKS: Array<LinkProps> = [
  {
    label: 'FAQs',
    path: 'https://docs.boba.network/faq',
  },
  {
    label: 'Dev Tools',
    path: 'https://docs.boba.network/for-developers',
    isNav: true,
  },
  {
    label: 'Bobascope',
    path: ROUTES_PATH.BOBASCOPE,
    isNav: true,
  },
  {
    label: 'Boba Network Website',
    path: 'https://boba.network',
  },
  {
    label: 'Terms of Use',
    path: 'https://boba.network/terms-of-use/',
  },
]

export const FOOTERLINKS_RIGHT: Array<LinkProps> = []
