import React, { Fragment, useEffect, useState } from 'react'
import {
  BannerWrapper,
  BannerAction,
  BannerContainer,
  BannerContent,
  BannerText,
  CloseIcon,
  CloseIconWrapper,
} from './styles'
import { bannerAlerts } from './data'
import { IAppAlert } from './types'
import { useNetworkInfo } from 'hooks/useNetworkInfo'

// @todo disable banner for sepolia.
// remove use of isAnchorageEnabled
const ApplicationBanner = () => {
  const [alerts, setAlerts] = useState<IAppAlert[]>([])
  const [storageChange, setStorageChange] = useState(false)
  const { isAnchorageEnabled } = useNetworkInfo()

  useEffect(() => {
    const appBanners = bannerAlerts().map((alert) => {
      return {
        ...alert,
        isHidden: JSON.parse(
          localStorage.getItem(`appBanner__${alert.key}`) as string
        ),
      }
    })
    setAlerts(appBanners)
  }, [storageChange])

  const onClose = (alertKey: string) => {
    localStorage.setItem(`appBanner__${alertKey}`, JSON.stringify(true))
    setStorageChange(!storageChange)
  }

  if (!!isAnchorageEnabled) {
    return <></>
  }

  if (alerts && !alerts.length) {
    return <></>
  }

  return (
    <BannerWrapper>
      {alerts.map(({ key, canClose, type, message, Component, isHidden }) => {
        if (isHidden) {
          return <Fragment key={key}></Fragment>
        }
        return (
          <BannerContainer className={type} key={key} data-testid="banner-item">
            <BannerContent>
              {Component ? <Component /> : <BannerText>{message}</BannerText>}
            </BannerContent>
            {canClose && (
              <BannerAction>
                <CloseIconWrapper
                  data-testid={`close-icon-${key}`}
                  onClick={() => {
                    onClose(key)
                  }}
                >
                  <CloseIcon />
                </CloseIconWrapper>
              </BannerAction>
            )}
          </BannerContainer>
        )
      })}
    </BannerWrapper>
  )
}

export default ApplicationBanner
