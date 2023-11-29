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
import Tooltip from 'components/tooltip/Tooltip'

import networkService from 'services/networkService'

import { fetchBalances } from 'actions/networkAction'

import { CheckboxWithLabel } from 'components/global/checkbox'
import { TableHeader } from 'components/global/table'
import { Typography } from 'components/global/typography'
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

  const userInfo = useSelector(selectUserInfo())
  const poolInfo = useSelector(selectPoolInfo())

  const layer1Balance = useSelector(selectlayer1Balance)
  const layer2Balance = useSelector(selectlayer2Balance)

  const baseEnabled = useSelector(selectBaseEnabled())
  const accountEnabled = useSelector(selectAccountEnabled())
  const networkName = useSelector(selectActiveNetworkName())
  const [showMSO, setShowMSO] = useState(false)
  const [lpChoice, setLpChoice] = useState(
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
    }

    if (accountEnabled) {
      dispatch(fetchBalances())
    }
  }, [dispatch, baseEnabled, accountEnabled, activeNetworkName])

  const getBalance = (address: string, chain: 'L1' | 'L2') => {
    let tokens = []
    if (chain === 'L1') {
      tokens = Object.values(layer1Balance)
    } else if (chain === 'L2') {
      tokens = Object.values(layer2Balance)
    }
    const token: any = tokens.find(
      (t: any) => t.address.toLowerCase() === address.toLowerCase()
    )
    return token ? [token.balance, token.decimals] : [0, 0]
  }

  const selectedPoolInfo = lpChoice === 'L1LP' ? poolInfo.L1LP : poolInfo.L2LP

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
              checked={showMSO}
              onChange={(status) => setShowMSO(status)}
            />
          </EarnAction>
        </EarnActionContainer>
        <TableHeader options={tableHeaderOptions} />
        <EarnListContainer>
          {Object.keys(selectedPoolInfo).map((tokenAddress, i) => {
            const [balance, decimals] = getBalance(
              tokenAddress,
              lpChoice === 'L1LP' ? 'L1' : 'L2'
            )
            return <>{i}</>
            // return (
            //   <ListEarn
            //     key={i}
            //     poolInfo={selectedPoolInfo[tokenAddress]}
            //     userInfo={
            //       lpChoice === 'L1LP' ? userInfo.L1LP[tokenAddress] : userInfo.L2LP[tokenAddress]
            //     }
            //     L1orL2Pool={lpChoice}
            //     balance={balance}
            //     decimals={decimals}
            //     showStakesOnly={showMSO}
            //     accountEnabled={accountEnabled}
            //   />
            // );
          })}
        </EarnListContainer>
      </div>
    </EarnPageContainer>
  )
}

export default React.memo(Earn)
