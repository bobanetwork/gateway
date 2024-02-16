import React from 'react'
import { BannerText } from './styles'
import { IAppAlert } from './types'

// note: remove relayer banner on completely rolling out bedrock.
export const bannerAlerts = (): IAppAlert[] => [
  {
    key: 'earn-banner-deprecation',
    type: 'warning',
    canClose: false,
    Component: () => (
      <BannerText>
        In preparation for the release of Boba Light Bridge, the Earn program is
        being sunset. To withdraw funds,{' '}
        <a href="/earn" target="blank">
          CLICK HERE
        </a>
      </BannerText>
    ),
  },
  {
    key: 'relayer-banner-deprecation',
    type: 'warning',
    canClose: true,
    Component: () => (
      <BannerText>
        Due to the Anchorage upgrade, relayers will no longer be available.
      </BannerText>
    ),
  },
]

export default bannerAlerts
