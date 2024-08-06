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

import React, { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { setTheme } from 'actions/uiAction'

import { Background } from 'components/global/background'
import CustomThemeProvider from 'themes'
import { mobile } from 'themes/screens'
import FallbackLoader from './FallbackLoader'
import Router from './routes'

// TOOD: figure out the use cssBaseLine and fix broken design
import CssBaseline from '@mui/material/CssBaseline'

const LayOutContainer = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 1;
  position: relative;

  ${mobile(css`
    flex-direction: column;
  `)}
`
const SuspenseContainer = styled.div`
  display: flex;
  flex: 1 0;
  flex-direction: column;
  min-height: 100vh;
  background-color: linear-gradient(180deg, #061122 0%, #08162c 100%);
`

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem('theme')
    dispatch(setTheme(themeFromLocalStorage))
  }, [dispatch])

  return (
    <CustomThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Background />
        <LayOutContainer>
          <SuspenseContainer>
            <Suspense fallback={<FallbackLoader />}>
              <Router />
            </Suspense>
          </SuspenseContainer>
        </LayOutContainer>
      </BrowserRouter>
    </CustomThemeProvider>
  )
}

export default App
