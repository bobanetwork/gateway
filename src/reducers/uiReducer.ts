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
  transferModal: boolean
  bridgeTypeSwitch: boolean
  tokenPicker: boolean
  transferPending: boolean
  mergeModal: boolean
  confirmationModal: boolean
  wrongNetworkModal: boolean
  ledgerConnectModal: boolean
  addNewTokenModal: boolean
  StakeDepositModal: boolean
  EarnWithdrawModal: boolean
  delegateDaoModal: boolean
  delegateDaoXModal: boolean
  newProposalModal: boolean
  walletSelectorModal: boolean
  CDMCompletionModal: boolean
  switchNetworkModal: boolean
  UnsupportedNetwork: boolean

  ledger: boolean
  alert?: string
  error?: string
  lock?: string
  proposalId?: string
  activeHistoryTab: string
  activeDataTab: string
}

const initialState: IUiReducerState = {
  theme: 'dark',
  transferModal: false,
  bridgeTypeSwitch: false,
  tokenPicker: false,
  transferPending: false,
  mergeModal: false,
  confirmationModal: false,
  wrongNetworkModal: false,
  ledgerConnectModal: false,
  addNewTokenModal: false,
  StakeDepositModal: false,
  EarnWithdrawModal: false,
  delegateDaoModal: false,
  delegateDaoXModal: false,
  newProposalModal: false,
  walletSelectorModal: false,
  CDMCompletionModal: false,
  switchNetworkModal: false,
  UnsupportedNetwork: false,

  ledger: false,
  alert: undefined,
  error: undefined,
  lock: undefined,
  proposalId: undefined,
  activeHistoryTab: 'All',
  activeDataTab: 'Seven Day Queue',
}

const uiReducer = (state: IUiReducerState = initialState, action) => {
  switch (action.type) {
    case 'UI/THEME/UPDATE':
      return { ...state, theme: action.payload }
    case 'UI/MODAL/OPEN':
      return {
        ...state,
        [action.payload]: true,
        fast: action.fast,
        token: action.token,
        tokenIndex: action.tokenIndex,
        lock: action.lock, // incase of lock record
        proposalId: action.proposalId, // incase of vote on proposal
        selectionLayer: action.selectionLayer, // use incase of new chain/network picker.
        destNetworkSelection: action.destNetworkSelection,
      }
    case 'UI/MODAL/CLOSE':
      return { ...state, [action.payload]: false }
    case 'UI/ALERT/UPDATE':
      return { ...state, alert: action.payload }
    case 'UI/ERROR/UPDATE':
      return { ...state, error: action.payload }
    case 'UI/LEDGER/UPDATE':
      return { ...state, ledger: action.payload }
    case 'UI/HISTORYTAB/UPDATE':
      return { ...state, activeHistoryTab: action.payload }
    case 'UI/DATATAB/UPDATE':
      return { ...state, activeDataTab: action.payload }
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
