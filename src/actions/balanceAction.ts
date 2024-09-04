/*
  Varna - A Privacy-Preserving Marketplace
  Varna uses Fully Homomorphic Encryption to make markets fair.
  Copyright (C) 2021 Enya Inc. Palo Alto, CA

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import networkService from 'services/networkService'
import { createAction } from './createAction'

export const fetchClassicExitCost = (address: string) =>
  createAction('FETCH/CLASSICEXIT/COST', () =>
    networkService.getExitCost(address)
  )

export const fetchL2BalanceETH = () =>
  createAction('FETCH/L2ETH/BALANCE', () => networkService.getL2BalanceETH())

export const fetchL2BalanceBOBA = () =>
  createAction('FETCH/L2BOBA/BALANCE', () => networkService.getL2BalanceBOBA())

export const fetchExitFee = () =>
  createAction('FETCH/EXITFEE', () =>
    networkService.getExitFeeFromBillingContract()
  )
