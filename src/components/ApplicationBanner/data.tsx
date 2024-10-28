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
        As we launch the Boba Light Bridge, the earn program has ended. To
        withdraw from the liquidity pool{' '}
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
