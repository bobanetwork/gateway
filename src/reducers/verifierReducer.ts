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

interface IVerifierReducerState {}

const initialState: IVerifierReducerState = {}

const verifierReducer = (
  state: IVerifierReducerState = initialState,
  action
) => {
  switch (action.type) {
    case 'VERIFIER/GET/SUCCESS':
      if (action.payload) {
        return { ...state, ...action.payload }
      }
      return state
    case 'VERIFIER/RESET':
      return {}
    default:
      return state
  }
}

export default verifierReducer
