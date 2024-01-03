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
import earnService from 'services/earn.service'
import { createAction } from './createAction'
import { BigNumberish } from 'ethers'
import { LiquidityPoolLayer } from 'types/earn.types'

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
    earnService.getL1LPInfo(),
    earnService.getL2LPInfo(),
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

export const updateWithdrawToken = (withdrawToken: any) => ({
  type: 'UPDATE_WITHDRAW_TOKEN',
  payload: withdrawToken,
})

export const updateWithdrawPayload = (withdrawToken: any) => ({
  type: 'UPDATE_WITHDRAW_PAYLOAD',
  payload: withdrawToken,
})

export const fetchL1LPBalance = (currency: string) =>
  createAction('FETCH/L1LPBALANCE', () => earnService.getL1LPBalance(currency))

export const fetchL2LPBalance = (currency: string) =>
  createAction('FETCH/L2LPBALANCE', () => earnService.getL2LPBalance(currency))

export const getReward = (
  currencyAddress: string,
  value_Wei_String: BigNumberish,
  L1orL2Pool: LiquidityPoolLayer
) =>
  createAction('EARN/HARVEST', () =>
    earnService.withdrawReward(currencyAddress, value_Wei_String, L1orL2Pool)
  )

export const withdrawLiquidity = (
  currencyAddress: string,
  value_Wei_String: string,
  L1orL2Pool: LiquidityPoolLayer
) =>
  createAction('EARN/WITHDRAW', () =>
    earnService.withdrawLiquidity(currencyAddress, value_Wei_String, L1orL2Pool)
  )
