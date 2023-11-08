import React, { Fragment, useEffect, useState } from 'react'
import {
  BannerWrapper,
  BannerAction,
  BannerContainer,
  BannerContent,
  BannerText,
  CloseIcon,
} from './styles'
import { bannerAlerts } from './data'

export interface IAppAlert {
  type: 'success' | 'warning' | 'info'
  key: string
  message?: string
  canClose?: boolean
  isHidden?: boolean
  Component?: React.ElementType<{ className?: string }>
}

const ApplicationBanner = () => {
  const [alerts, setAlerts] = useState<IAppAlert[]>([])
  const [storageChange, setStorageChange] = useState(false)

  useEffect(() => {
    const appBanners = bannerAlerts.map((alert) => {
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
          <BannerContainer className={type} key={key}>
            <BannerContent>
              {Component ? <Component /> : <BannerText>{message}</BannerText>}
            </BannerContent>
            {canClose && (
              <BannerAction>
                <CloseIcon
                  onClick={() => {
                    onClose(key)
                  }}
                />
              </BannerAction>
            )}
          </BannerContainer>
        )
      })}
    </BannerWrapper>
  )
}

export default ApplicationBanner
