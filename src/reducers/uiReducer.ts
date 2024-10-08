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

interface IUiReducerState {
  theme: string
  tokenPicker: boolean
  confirmationModal: boolean
  wrongNetworkModal: boolean
  addNewTokenModal: boolean
  StakeDepositModal: boolean
  EarnWithdrawModal: boolean
  EarnWithdrawConfirmModal: boolean
  EarnWithdrawModalSuccess: boolean
  delegateDaoModal: boolean
  newProposalModal: boolean
  walletSelectorModal: boolean
  switchNetworkModal: boolean
  UnsupportedNetwork: boolean
  isNewTx: boolean
  isAnchorageWithdrawal?: boolean
  alert?: string
  error?: string
  lock?: string
  proposalId?: string
}

const initialState: IUiReducerState = {
  theme: 'dark',
  tokenPicker: false,
  confirmationModal: false,
  wrongNetworkModal: false,
  addNewTokenModal: false,
  StakeDepositModal: false,
  EarnWithdrawModal: false,
  EarnWithdrawConfirmModal: false,
  EarnWithdrawModalSuccess: false,
  delegateDaoModal: false,
  newProposalModal: false,
  walletSelectorModal: false,
  switchNetworkModal: false,
  UnsupportedNetwork: false,
  isNewTx: false,
  isAnchorageWithdrawal: false,
  alert: undefined,
  error: undefined,
  lock: undefined,
  proposalId: undefined,
}

const uiReducer = (state: IUiReducerState = initialState, action) => {
  switch (action.type) {
    case 'UI/THEME/UPDATE':
      return { ...state, theme: action.payload }
    case 'UI/MODAL/OPEN':
      return {
        ...state,
        [action.payload]: true,
        token: action.token,
        tokenIndex: action.tokenIndex,
        lock: action.lock, // incase of lock record
        proposalId: action.proposalId, // incase of vote on proposal
        selectionLayer: action.selectionLayer, // use incase of new chain/network picker.
        destNetworkSelection: action.destNetworkSelection,
        isNewTx: action.isNewTx, // use to check the multi step withdrawal modal tx
        isAnchorageWithdrawal: action.isAnchorageWithdrawal,
      }
    case 'UI/MODAL/CLOSE':
      return { ...state, [action.payload]: false }
    case 'UI/ALERT/UPDATE':
      return { ...state, alert: action.payload }
    case 'UI/ERROR/UPDATE':
      return { ...state, error: action.payload }
    case 'UI/MODAL/DATA':
      let dataType = 'generic'
      if (action.payload.modal === 'confirmationModal') {
        dataType = 'cMD'
      }
      return { ...state, [dataType]: action.payload.data }
    default:
      return state
  }
}

export default uiReducer
