import React from 'react'
import { IAppAlert } from '.'
import { BannerText } from './styles'

export const bannerAlerts: IAppAlert[] = [
  {
    key: 'earn-banner-deprecation',
    type: 'warning',
    canClose: true,
    Component: () => (
      <BannerText>
        {' '}
        Boba Light bridge has been released and earn is sunset, to withdraw
        funds from liquidity <a href="/earn">CLICK HERE</a>{' '}
      </BannerText>
    ),
  },
]
