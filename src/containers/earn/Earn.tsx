/*
  Utility Functions for OMG Plasma
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
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { HelpOutline } from '@mui/icons-material'

import {
  selectAccountEnabled,
  selectActiveNetworkName,
  selectBaseEnabled,
  selectLayer,
  selectPoolInfo,
  selectUserInfo,
  selectlayer1Balance,
  selectlayer2Balance,
} from 'selectors'

import { getEarnInfo } from 'actions/earnAction'

import Connect from 'containers/connect'

import Button from 'components/button/Button'
import AlertIcon from 'components/icons/AlertIcon'
import ListEarn from 'components/listEarn/ListEarn'
import EarnList from './earnList'
import Tooltip from 'components/tooltip/Tooltip'

import networkService from 'services/networkService'

import { fetchBalances, getAllAddresses } from 'actions/networkAction'

import { CheckboxWithLabel } from 'components/global/checkbox'
import { Typography } from 'components/global/typography'
import { TableHeader } from 'components/global/table'
import { tableHeaderOptions } from './table.header'
import { toLayer } from './types'

import { setConnectBOBA, setConnectETH } from 'actions/setupAction'
import {
  AlertInfo,
  AlertText,
  EarnAction,
  EarnActionContainer,
  EarnListContainer,
  EarnPageContainer,
  Help,
  LayerAlert,
  Tab,
  TabSwitcherContainer,
} from './styles'

import { BridgeTooltip } from './tooltips'

const Earn = () => {
  const dispatch = useDispatch<any>()

  const activeNetworkName = useSelector(selectActiveNetworkName())
  const layer = useSelector(selectLayer())
  const baseEnabled = useSelector(selectBaseEnabled())
  const accountEnabled = useSelector(selectAccountEnabled())
  const networkName = useSelector(selectActiveNetworkName())
  const [showMyStakeOnly, setShowMyStakeOnly] = useState(false)
  const [lpChoice, setLpChoice] = useState<'L1LP' | 'L2LP'>(
    networkService.L1orL2 === 'L1' ? 'L1LP' : 'L2LP'
  )

  const isLp1 = lpChoice === 'L1LP'
  const isLp2 = lpChoice === 'L2LP'

  const [poolTab, setPoolTab] = useState(
    activeNetworkName[layer?.toLowerCase()]
  )

  useEffect(() => {
    setLpChoice(networkService.L1orL2 === 'L1' ? 'L1LP' : 'L2LP')
    setPoolTab(activeNetworkName[layer?.toLowerCase()])
  }, [layer, networkService, activeNetworkName])

  useEffect(() => {
    if (baseEnabled) {
      dispatch(getEarnInfo())
      dispatch(getAllAddresses())
    }

    if (accountEnabled) {
      dispatch(fetchBalances())
    }
  }, [dispatch, baseEnabled, accountEnabled, activeNetworkName])

  useEffect(() => {
    setLpChoice(networkService.L1orL2 === 'L1' ? 'L1LP' : 'L2LP')
  }, [networkService.L1orL2])

  return (
    <EarnPageContainer>
      <Help>
        <Typography variant="body3">
          Bridging fees are proportionally distributed to stakers. The bridges
          are not farms. Your earnings only increase when someone uses the
          bridge you have staked into.
        </Typography>

        <Tooltip title={<BridgeTooltip />}>
          <HelpOutline fontSize="small" sx={{ opacity: 0.65 }} />
        </Tooltip>
      </Help>
      <Connect
        userPrompt={
          'Connect to Wallet to see your balances and contribute to the liquidity pool '
        }
        accountEnabled={accountEnabled}
      />
      {((layer === 'L2' && isLp1) || (layer === 'L1' && isLp2)) && (
        <LayerAlert>
          <AlertInfo>
            <AlertIcon />
            <AlertText variant="body2" component="p">
              You are on {layer}. To transact on {toLayer[layer]}, SWITCH LAYER
              to {toLayer[layer]}
            </AlertText>
          </AlertInfo>
          <Button
            variant="contained"
            size="md"
            onClick={() =>
              layer === 'L1'
                ? dispatch(setConnectBOBA(true))
                : dispatch(setConnectETH(true))
            }
            sx={{ fontWeight: '500;' }}
          >
            Connect to {networkName[layer === 'L1' ? 'l2' : 'l1']}
          </Button>
        </LayerAlert>
      )}
      <div>
        <EarnActionContainer>
          <TabSwitcherContainer>
            <Tab
              active={poolTab === activeNetworkName['l1']}
              onClick={() => {
                setLpChoice('L1LP')
                setPoolTab(activeNetworkName['l1'])
              }}
            >
              <Typography variant="body1">
                {activeNetworkName['l1']} Pools
              </Typography>
            </Tab>
            <Tab
              active={poolTab === activeNetworkName['l2']}
              onClick={() => {
                setLpChoice('L2LP')
                setPoolTab(activeNetworkName['l2'])
              }}
            >
              <Typography variant="body1">
                {activeNetworkName['l2']} Pools
              </Typography>
            </Tab>
          </TabSwitcherContainer>
          <EarnAction>
            <CheckboxWithLabel
              label="My Stakes Only"
              checked={showMyStakeOnly}
              onChange={(status) => setShowMyStakeOnly(status)}
            />
          </EarnAction>
        </EarnActionContainer>
        <EarnList showMyStakeOnly={showMyStakeOnly} lpChoice={lpChoice} />
      </div>
    </EarnPageContainer>
  )
}

export default React.memo(Earn)
