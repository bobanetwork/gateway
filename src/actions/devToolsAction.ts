/*
   
  
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

import { Contract } from 'ethers'
import txBuilderService from 'services/txbuilder.service'
import { createAction } from './createAction'

export const submitTxBuilder = (
  contract: Contract,
  methodIndex: number,
  methodName: string,
  inputs: any
) =>
  createAction('TX_BUILDER', () =>
    txBuilderService.submitTxBuilder(contract, methodIndex, methodName, inputs)
  )

export const resetTxBuilder = () => (dispatch) =>
  dispatch({ type: 'TX_BUILDER/REST' })
