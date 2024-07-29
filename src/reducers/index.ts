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

import loadingReducer from './loadingReducer'
import depositReducer from './depositReducer'
import transactionReducer from './transactionReducer'
import dataReducer from './dataReducer'
import balanceReducer from './balanceReducer'
import tokenReducer from './tokenReducer'
import nftReducer from './nftReducer'
import uiReducer from './uiReducer'
import setupReducer from './setupReducer'
import earnReduer from './earnReducer'
import daoReducer from './daoReducer'
import fixedReducer from './fixedReducer'
import bridgeReducer from './bridgeReducer'
import networkReducer from './networkReducer'
import { combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  loading: loadingReducer,
  deposit: depositReducer,
  transaction: transactionReducer,
  data: dataReducer,
  balance: balanceReducer,
  tokenList: tokenReducer,
  nft: nftReducer,
  ui: uiReducer,
  setup: setupReducer,
  earn: earnReduer,
  dao: daoReducer,
  fixed: fixedReducer,
  bridge: bridgeReducer,
  network: networkReducer,
})

export default rootReducer
