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

import balanceReducer from './balanceReducer'
import bridgeReducer from './bridgeReducer'
import daoReducer from './daoReducer'
import dataReducer from './dataReducer'
import depositReducer from './depositReducer'
import devToolsReducer from './devToolsReducer'
import earnReduer from './earnReducer'
import fixedReducer from './fixedReducer'
import loadingReducer from './loadingReducer'
import lookupReducer from './lookupReducer'
import networkReducer from './networkReducer'
import setupReducer from './setupReducer'
import tokenReducer from './tokenReducer'
import transactionReducer from './transactionReducer'
import uiReducer from './uiReducer'
import verifierReducer from './verifierReducer'
import { combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  loading: loadingReducer,
  deposit: depositReducer,
  transaction: transactionReducer,
  data: dataReducer,
  balance: balanceReducer,
  tokenList: tokenReducer,
  ui: uiReducer,
  setup: setupReducer,
  earn: earnReduer,
  lookup: lookupReducer,
  dao: daoReducer,
  fixed: fixedReducer,
  verifier: verifierReducer,
  bridge: bridgeReducer,
  devTools: devToolsReducer,
  network: networkReducer,
})

export default rootReducer
