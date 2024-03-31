import { Network } from 'util/network/network.util'

interface BannerContent {
  message?: string
  content?: string
}

/**
 * To show alert specific to network update the config.
 *
 * eg.
 *
  BannerConfig = {
    [NETWORK.ETHEREUM]: {
      message: `Alert text for etheruem network`,
      content: `Descriptive alert text for etheruem network`,
    }
  }
 *
 **/

export const BannerConfig: Record<string, BannerContent> = {
  [Network.ETHEREUM]: {
    message: `Note: Classic withdrawals will be temporarily suspended for a duration of 10 days beginning April 6th in preparation for our Anchorage update! Light bridging will remain available throughout the period.`,
  },
}
