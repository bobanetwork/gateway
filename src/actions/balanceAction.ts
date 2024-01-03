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
import feeService from 'services/fee.service'
import balanceService from 'services/balance.service'

export const fetchL1LPBalance = (address: string) =>
  createAction('FETCH/L1LP/BALANCE', () => networkService.L1LPBalance(address))

export const fetchL2LPBalance = (address: string) =>
  createAction('FETCH/L2LP/BALANCE', () => networkService.L2LPBalance(address))

export const fetchL1LPPending = (address: string) =>
  createAction('FETCH/L1LP/PENDING', () => networkService.L1LPPending(address))

export const fetchL2LPPending = (address: string) =>
  createAction('FETCH/L2LP/PENDING', () => networkService.L2LPPending(address))

export const fetchL1LPLiquidity = (address: string) =>
  createAction('FETCH/L1LP/LIQUIDITY', () =>
    networkService.L1LPLiquidity(address)
  )

export const fetchL2LPLiquidity = (address: string) =>
  createAction('FETCH/L2LP/LIQUIDITY', () =>
    networkService.L2LPLiquidity(address)
  )

export const fetchL1TotalFeeRate = () =>
  createAction('FETCH/L1TOTALFEERATE', () => {
    return feeService.getL1TotalFeeRate()
  })
export const fetchL2TotalFeeRate = () =>
  createAction('FETCH/L2TOTALFEERATE', () => {
    return feeService.getL2TotalFeeRate()
  })

export const fetchL1FeeRateN = (tokenAddress: string) =>
  createAction('FETCH/L1FEERATE', () => {
    return feeService.getL1UserRewardFeeRate(tokenAddress)
  })
export const fetchL2FeeRateN = (tokenAddress: string) =>
  createAction('FETCH/L2FEERATE', () => {
    return feeService.getL2UserRewardFeeRate(tokenAddress)
  })

export const fetchFastExitCost = (address: string) =>
  createAction('FETCH/FASTEXIT/COST', () =>
    networkService.getFastExitCost(address)
  )

export const fetchClassicExitCost = (address: string) =>
  createAction('FETCH/CLASSICEXIT/COST', () =>
    networkService.getExitCost(address)
  )

export const fetchFastDepositCost = (address: string) =>
  createAction('FETCH/FASTDEPOSIT/COST', () =>
    networkService.getFastDepositCost(address)
  )

export const fetchL1FeeBalance = () =>
  createAction('FETCH/L1FEE/BALANCE', () => balanceService.getL1FeeBalance())

export const fetchL2BalanceETH = () =>
  createAction('FETCH/L2ETH/BALANCE', () => balanceService.getL2BalanceETH())

export const fetchL2BalanceBOBA = () =>
  createAction('FETCH/L2BOBA/BALANCE', () => balanceService.getL2BalanceBOBA())

export const fetchExitFee = () =>
  createAction('FETCH/EXITFEE', () =>
    feeService.getExitFeeFromBillingContract()
  )
