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

import networkService, { EPoolLayer } from 'services/networkService'
import { createAction } from './createAction'

const getEarnInfoBegin = () => ({
  type: 'GET_EARNINFO',
})

const getEarnInfoSuccess = (
  L1PoolInfo,
  L1UserInfo,
  L2PoolInfo,
  L2UserInfo
) => ({
  type: 'GET_EARNINFO_SUCCESS',
  payload: { L1PoolInfo, L1UserInfo, L2PoolInfo, L2UserInfo },
})

export const getEarnInfo = () => async (dispatch) => {
  dispatch(getEarnInfoBegin())
  const [L1LPInfo, L2LPInfo] = await Promise.all([
    networkService.getL1LPInfo(),
    networkService.getL2LPInfo(),
  ])
  dispatch(
    getEarnInfoSuccess(
      L1LPInfo.poolInfo,
      L1LPInfo.userInfo,
      L2LPInfo.poolInfo,
      L2LPInfo.userInfo
    )
  )
}

export const updateStakeToken = (stakeToken: any) => ({
  type: 'UPDATE_STAKE_TOKEN',
  payload: stakeToken,
})

export const updateWithdrawToken = (withdrawToken: any) => ({
  type: 'UPDATE_WITHDRAW_TOKEN',
  payload: withdrawToken,
})

export const fetchAllowance = (currency: string, lpAddress: string) =>
  createAction('FETCH/ALLOWANCE', () =>
    networkService.checkAllowance(currency, lpAddress)
  )

export const addLiquidity = (
  currency: string,
  weiString: string,
  L1orL2Pool: EPoolLayer
) =>
  createAction('ADD/LIQUIDITY', () =>
    networkService.addLiquidity(currency, weiString, L1orL2Pool)
  )

export const fetchL1LPBalance = (currency: string) =>
  createAction('FETCH/L1LPBALANCE', () => networkService.L1LPBalance(currency))

export const fetchL2LPBalance = (currency: string) =>
  createAction('FETCH/L2LPBALANCE', () => networkService.L2LPBalance(currency))
