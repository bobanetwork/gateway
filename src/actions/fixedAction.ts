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

import fixedSavingService from 'services/fixedsaving/fixedSaving.service'
import { createAction } from './createAction'

export const addFS_Savings = (weiString: string) =>
  createAction('ADD/FS_SAVINGS', () => fixedSavingService.addSavings(weiString))

export const withdrawFS_Savings = (stakeID: number) =>
  createAction('WITHDRAW/FS_SAVINGS', () =>
    fixedSavingService.withdrawSavings(stakeID)
  )

export const fetchSavings = () =>
  createAction('GET/FS_SAVES', () => fixedSavingService.loadSavings())

export const fetchStakeInfo = () =>
  createAction('GET/FS_INFO', () => fixedSavingService.loadAccountSaveInfo())

export const fetchBobaTokenDetail = () =>
  createAction('BOBA_BALANCE/GET', () => fixedSavingService.loadBobaBalance())
