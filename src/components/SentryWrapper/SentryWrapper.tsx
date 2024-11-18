import React, { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { APP_ENV } from 'util/constant'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Button, Heading, Typography } from 'components/global'
import styled, { css } from 'styled-components'
import BobaLogoImage from 'assets/images/boba-logo.png'
import CustomThemeProvider from 'themes'
import { mobile } from 'themes/screens'

interface ISentryWrapperProps {
  children: React.ReactNode
}

const BobaLogo = styled.div`
  width: 50px;
  height: 54px;
  background: ${`url(${BobaLogoImage}) no-repeat`};
  background-position: 100%;
  background-size: contain;
  ${mobile(css`
    width: 32px;
    height: 32px;
  `)}
`

const ContentCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 300px;
  height: 100vh;
  align-items: center;
  gap: 20px;
  backgroundcolor: linear-gradient(180deg, #061122 0 %, #08162c 100 %);
`

const SentryFallback = () => {
  return (
    <>
      <CustomThemeProvider>
        <ContentCenter>
          <BobaLogo />
          <Heading variant="h1">Opps!</Heading>
          <Typography variant="subtitle">
            Something went wrong please try again!
          </Typography>
          <Button
            label="Refresh"
            onClick={() => {
              location.reload()
            }}
          />
        </ContentCenter>
      </CustomThemeProvider>
    </>
  )
}

/**
 * It's function which wraps compnent and add sentry integration on top of it.
 *
 * @param {*} props (children)
 * @returns wrapp component
 */

const SentryWrapper = (props: ISentryWrapperProps) => {
  const { children } = props
  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  useEffect(() => {
    const sentryDns = process.env.REACT_APP_SENTRY_DSN
    // Initialize sentry when DNS URL is available
    if (sentryDns) {
      // Sentry initializations.
      Sentry.init({
        dsn: sentryDns,
        environment: `${APP_ENV}-${network}`,
        integrations: [
          Sentry.globalHandlersIntegration({
            onunhandledrejection: false, /// will avoid to send unhandle browser error.
            onerror: false,
          }),
        ],
        ignoreErrors: [
          'top.GLOBALS', // Stop sentry to report the random plugin / extensions errors.
          'Internal JSON-RPC error', // Ignore MM error as we can not control those.
          'JsonRpcEngine',
          'Non-Error promise rejection captured with keys: code',
        ],
        denyUrls: [
          // Ignore chrome & extensions error
          /extensions\//i,
          /^chrome:\/\//i,
        ],
        tracesSampleRate: 1.0,
        initialScope: {
          tags: { network, networkType },
        },
        beforeSend: (event) => {
          // Avoid sending the sentry events on local env.
          if (window.location.hostname === 'localhost') {
            return null
          }

          return {
            ...event,
            breadcrumbs: event?.breadcrumbs?.filter((b) => b.type !== 'http'), /// filter the http stack as it can contain sensity keys
          }
        },
      })
    }

    return () => {
      Sentry.close(2000) // to close the sentry client connection on unmounting.
    }
  }, [network])

  return (
    <>
      <Sentry.ErrorBoundary fallback={<SentryFallback />}>
        {children}
      </Sentry.ErrorBoundary>
    </>
  )
}

export default SentryWrapper
