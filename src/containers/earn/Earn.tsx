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
} from 'selectors'

import { getEarnInfo } from 'actions/earnAction'

import Connect from 'containers/connect'

import Button from 'components/button/Button'
import AlertIcon from 'components/icons/AlertIcon'
import Tooltip from 'components/tooltip/Tooltip'
import EarnList from './earnList'

import { fetchBalances, getAllAddresses } from 'actions/networkAction'

import { CheckboxWithLabel } from 'components/global/checkbox'
import { Typography } from 'components/global/typography'
import { toLayer } from './types'

import { setConnectBOBA, setConnectETH } from 'actions/setupAction'
import {
  AlertInfo,
  AlertText,
  EarnAction,
  EarnActionContainer,
  EarnPageContainer,
  Help,
  LayerAlert,
  Tab,
  TabSwitcherContainer,
} from './styles'

import { LiquidityPoolLayer } from 'types/earn.types'
import { BridgeTooltip } from './tooltips'

const Earn = () => {
  const dispatch = useDispatch<any>()

  const layer = useSelector(selectLayer())
  const baseEnabled = useSelector(selectBaseEnabled())
  const accountEnabled = useSelector(selectAccountEnabled())
  const networkName = useSelector(selectActiveNetworkName())
  const activeNetworkName = useSelector(selectActiveNetworkName())

  const [showMyStakeOnly, setShowMyStakeOnly] = useState(false)
  const [lpChoice, setLpChoice] = useState<LiquidityPoolLayer>(
    LiquidityPoolLayer.L1LP
  )
  const [poolTab, setPoolTab] = useState(
    activeNetworkName[layer?.toLowerCase()]
  )

  const isLp1 = lpChoice === 'L1LP'
  const isLp2 = lpChoice === 'L2LP'

  useEffect(() => {
    if (layer === 'L1') {
      setLpChoice(LiquidityPoolLayer.L1LP)
    } else {
      setLpChoice(LiquidityPoolLayer.L2LP)
    }
    setPoolTab(activeNetworkName[layer?.toLowerCase()])
  }, [layer, activeNetworkName])

  useEffect(() => {
    if (baseEnabled) {
      dispatch(getEarnInfo())
      dispatch(getAllAddresses())
    }

    if (accountEnabled) {
      dispatch(fetchBalances())
    }
  }, [dispatch, baseEnabled, accountEnabled, activeNetworkName])

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
            testId="connect-btn"
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
              data-testid="tab-l1"
              active={poolTab === activeNetworkName['l1']}
              onClick={() => {
                setLpChoice(LiquidityPoolLayer.L1LP)
                setPoolTab(activeNetworkName['l1'])
              }}
            >
              <Typography variant="body1">
                {activeNetworkName['l1']} Pools
              </Typography>
            </Tab>
            <Tab
              data-testid="tab-l2"
              active={poolTab === activeNetworkName['l2']}
              onClick={() => {
                setLpChoice(LiquidityPoolLayer.L2LP)
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
              testId="my-stake-checkbox"
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
