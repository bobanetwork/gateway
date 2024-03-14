import React, { Fragment, useEffect, useState } from 'react'
import {
  BannerWrapper,
  BannerAction,
  BannerContainer,
  BannerContent,
  BannerText,
  CloseIcon,
  CloseIconWrapper,
  BannerCenter,
  ArrowBtn,
} from './styles'
import { bannerAlerts } from './data'
import { IAppAlert } from './types'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

// @todo disable banner for sepolia.
// remove use of isAnchorageEnabled
const ApplicationBanner = () => {
  const [alerts, setAlerts] = useState<IAppAlert[]>([])
  const [storageChange, setStorageChange] = useState(false)
  const { isAnchorageEnabled } = useNetworkInfo()

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const lastIndex = alerts.length - 1
    if (index < 0) {
      setIndex(lastIndex)
    }
    if (index > lastIndex) {
      setIndex(0)
    }
  }, [index, alerts])

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setIndex(index + 1)
    }, 7000)
    return () => clearInterval(sliderInterval)
  }, [index])

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
      <BannerCenter>
        {alerts.map(
          (
            { key, canClose, type, message, Component, isHidden },
            alertIndex
          ) => {
            let position = 'nextSlide'
            if (alertIndex === index) {
              position = 'activeSlide'
            }
            if (
              alertIndex === index - 1 ||
              (index === 0 && alertIndex === alerts.length - 1)
            ) {
              position = 'lastSlide'
            }

            if (isHidden) {
              return <Fragment key={key}></Fragment>
            }
            return (
              <BannerContainer
                className={`${type} ${position}`}
                key={key}
                data-testid="banner-item"
              >
                <BannerContent>
                  {Component ? (
                    <Component />
                  ) : (
                    <BannerText>{message}</BannerText>
                  )}
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
          }
        )}
        <ArrowBtn className="prev" onClick={() => setIndex(index - 1)}>
          <ChevronRight />
        </ArrowBtn>
        <ArrowBtn className="next" onClick={() => setIndex(index + 1)}>
          <ChevronLeft />
        </ArrowBtn>
      </BannerCenter>
    </BannerWrapper>
  )
}

export default ApplicationBanner
