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
        The earn program is being phased out as we introduce the Boba Light
        Bridge. To initiate a withdrawal of funds from the liquidity pool, To
        withdraw funds{' '}
        <a href="/earn" target="blank">
          CLICK HERE
        </a>
      </BannerText>
    ),
  },
  {
    key: 'relayer-banner-deprecation',
    type: 'warning',
    canClose: false,
    Component: () => (
      <BannerText>
        Due to the Anchorage upgrade, relayers will no longer be available.
      </BannerText>
    ),
  },
]

export default bannerAlerts
