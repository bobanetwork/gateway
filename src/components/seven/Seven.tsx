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

import React from 'react'

import { Typography } from 'components/global'
import { Hash, ExitWrapper, HashContainer } from './styles'

import networkService from 'services/networkService'
const Seven = ({ blockNumber, oriHash, unixTime }) => {
  const chainLink = ({ hash }) => {
    if (networkService.networkConfig!['L2']) {
      return `${networkService.networkConfig!['L2'].transaction}${hash}`
    }
    return ''
  }

  const secondsAgo = Math.round(Date.now() / 1000) - unixTime
  const daysAgo = Math.floor(secondsAgo / (3600 * 24))
  const hoursAgo = Math.round((secondsAgo % (3600 * 24)) / 3600)
  let timeLabel = `Exit was started ${daysAgo} days and ${hoursAgo} hours ago`

  const overdue = secondsAgo - 7 * 24 * 60 * 60

  if (overdue > 0) {
    if (hoursAgo <= 1) {
      timeLabel = `Funds will exit soon. The 7 day window just passed`
    } else if (hoursAgo <= 2) {
      timeLabel = `Funds will exit soon. The 7 day window recently passed`
    } else if (hoursAgo > 2) {
      timeLabel = `Funds will exit soon. The 7 day window passed ${hoursAgo} hours ago`
    }
  }

  return (
    <ExitWrapper>
      <Typography variant="title">{blockNumber}</Typography>

      <HashContainer variant="body3">
        Hash:&nbsp;
        <Hash
          href={chainLink({ hash: oriHash })}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          {oriHash}
        </Hash>
      </HashContainer>
      <Typography
        variant="body2"
        style={{ color: `${overdue < 0 ? 'yellow' : 'green'}` } as any}
      >
        {timeLabel}
      </Typography>
    </ExitWrapper>
  )
}

export default Seven
