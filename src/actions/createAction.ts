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

import * as Sentry from '@sentry/react'
import { ERROR_CODE } from 'util/constant'

export const createAction =
  (key: string, asyncAction: () => any): any =>
  async (dispatch) => {
    dispatch({ type: `${key}/REQUEST` })

    try {
      const response = await asyncAction()

      if (!response) {
        return false
      }

      if (typeof response === 'string') {
        if (response.includes('execution reverted: ERC20Permit')) {
          const errorMessage = JSON.parse(response)
          dispatch({
            type: `UI/ERROR/UPDATE`,
            payload: errorMessage.error.message,
          })
          dispatch({ type: `${key}/ERROR` })
          Sentry.captureMessage(errorMessage.error.message)
          return false
        }

        if (response.includes('Insufficient balance')) {
          dispatch({
            type: `UI/ERROR/UPDATE`,
            payload: 'Insufficient BOBA balance for emergency swap',
          })
          dispatch({ type: `${key}/ERROR` })
          return false
        }
      }

      if (
        response.hasOwnProperty('message') &&
        response.hasOwnProperty('code')
      ) {
        let errorMessage = response.message

        if (
          response.hasOwnProperty('reason') &&
          response.reason?.includes('user rejected transaction')
        ) {
          // no error log needed for user rejection
          if (response.code === 4001) {
            errorMessage = 'Transaction Rejected: Signature denied by user!'
          } else {
            errorMessage = 'Transaction rejected by user!'
          }
        } else {
          errorMessage = response.message
          Sentry.captureMessage(response.message || '')
        }

        if (response.reason?.includes('could not detect network')) {
          console.log('Gateway error: No network')
          errorMessage = 'Gateway: No internet'
        } else if (
          response.reason?.includes('missing revert data in call exception')
        ) {
          console.log('Slow network or rate throttling - code 1')
          return false
        } else if (
          response.reason?.includes(
            'resolver or addr is not configured for ENS name'
          )
        ) {
          console.log('Slow network or rate throttling - code 2')
          return false
        } else if (response.reason?.includes('missing response')) {
          console.log('Slow network or rate throttling - code 3')
          return false
        }

        dispatch({ type: `UI/ERROR/UPDATE`, payload: errorMessage })
        dispatch({ type: `${key}/ERROR` })
        return false
      } else if (
        response.hasOwnProperty('message') &&
        response.message.includes(ERROR_CODE)
      ) {
        dispatch({ type: `UI/ERROR/UPDATE`, payload: response.message })
        dispatch({ type: `${key}/ERROR` })
        return false
      }

      dispatch({ type: `${key}/SUCCESS`, payload: response })
      return response || true
    } catch (error) {
      console.log('Unhandled error RAW:', { error, key, asyncAction })
      Sentry.captureException(error)
      return false
    }
  }
