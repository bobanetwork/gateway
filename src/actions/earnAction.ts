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

import { BigNumberish } from 'ethers'
import earnService from 'services/earn/earn.service'
import { LiquidityPoolLayer } from 'types/earn.types'
import { createAction } from './createAction'

const getEarnInfoBegin = () => ({
  type: 'GET_EARNINFO',
})

export const updateWithdrawToken = (withdrawToken: any) => ({
  type: 'UPDATE_WITHDRAW_TOKEN',
  payload: withdrawToken,
})

export const updateWithdrawPayload = (withdrawToken: any) => ({
  type: 'UPDATE_WITHDRAW_PAYLOAD',
  payload: withdrawToken,
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
    earnService.loadL1LpInfo(),
    earnService.loadL2LpInfo(),
  ])
  dispatch(
    getEarnInfoSuccess(
      (L1LPInfo as any).poolInfo,
      (L1LPInfo as any).userInfo,
      (L2LPInfo as any).poolInfo,
      (L2LPInfo as any).userInfo
    )
  )
}

export const fetchL1LPBalance = (currency: string) =>
  createAction('FETCH/L1LPBALANCE', () => earnService.loadL1LpBalance(currency))

export const fetchL2LPBalance = (currency: string) =>
  createAction('FETCH/L2LPBALANCE', () => earnService.loadL2LpBalance(currency))

export const getReward = (
  currencyAddress: string,
  value_Wei_String: BigNumberish,
  L1orL2Pool: LiquidityPoolLayer
) =>
  createAction('EARN/HARVEST', () =>
    earnService.loadReward({
      currencyAddress,
      value_Wei_String,
      L1orL2Pool,
    })
  )

export const withdrawLiquidity = (
  currency: string,
  value_Wei_String: string,
  L1orL2Pool: LiquidityPoolLayer
) =>
  createAction('EARN/WITHDRAW', () =>
    earnService.withdrawLiquidity({
      currency,
      L1orL2Pool,
      value_Wei_String,
    })
  )
