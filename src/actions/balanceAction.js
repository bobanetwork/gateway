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

export function fetchL1LPBalance(address) {
    return createAction('FETCH/L1LP/BALANCE', () => networkService.L1LPBalance(address))
}

export function fetchL2LPBalance(address) {
    return createAction('FETCH/L2LP/BALANCE', () => networkService.L2LPBalance(address))
}

export function fetchClassicExitCost(address) {
    return createAction('FETCH/CLASSICEXIT/COST', () => networkService.getExitCost(address))
}

export function fetchAltL1DepositFee() {
    return createAction('FETCH/ALTL1DEPOSIT/COST', () => networkService.getAltL1DepositFee())
}

export function fetchL2BalanceETH() {
    return createAction('FETCH/L2ETH/BALANCE', () => networkService.getL2BalanceETH())
}

export function fetchL2BalanceBOBA() {
    return createAction('FETCH/L2BOBA/BALANCE', () => networkService.getL2BalanceBOBA())
}

export function fetchExitFee() {
  return createAction('FETCH/EXITFEE', () => networkService.getExitFeeFromBillingContract())
}
