import React from 'react'
import { BannerText } from './styles'
import { IAppAlert } from './types'

export const bannerAlerts = (): IAppAlert[] => [
  {
    key: 'earn-banner-deprecation',
    type: 'warning',
    canClose: false,
    Component: () => (
      <BannerText>
        In preparation for the release of Boba Light Bridge, the Earn program is
        being sunset. To withdraw funds, <a href="/earn">CLICK HERE</a>
      </BannerText>
    ),
  },
]

export default bannerAlerts
