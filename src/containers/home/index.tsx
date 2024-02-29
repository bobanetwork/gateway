/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import NotificationAlert from 'components/alert/Alert'
import { Footer, Header } from 'components/layout'
import { PageTitle } from 'components/layout/PageTitle'
import NotificationBanner from 'components/notificationBanner'
import ModalContainer from 'containers/modals'
import useGoogleAnalytics from 'hooks/useGoogleAnalytics'
import useNetwork from 'hooks/useNetwork'
import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { ApplicationBanner } from 'components'
import { useOnboard } from 'hooks/useOnboard'
import { useWalletConnect } from 'hooks/useWalletConnect'
import useWalletSwitch from 'hooks/useWalletSwitch'
import { HomeContainer, HomeContent } from './styles'

const Home = () => {
  useGoogleAnalytics() // Invoking GA analysis page view hooks
  useOnboard()
  useNetwork()
  useWalletSwitch()
  useWalletConnect()

  return (
    <>
      <ModalContainer />
      <NotificationAlert />
      <NotificationBanner />
      <HomeContainer>
        <Header />
        <ApplicationBanner />
        <HomeContent>
          <PageTitle />
          <Outlet />
        </HomeContent>
        <Footer />
      </HomeContainer>
    </>
  )
}

export default memo(Home)
