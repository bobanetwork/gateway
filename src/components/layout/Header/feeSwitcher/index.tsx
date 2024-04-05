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

import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  selectAccountEnabled,
  selectActiveNetworkName,
  selectBobaFeeChoice,
  selectLayer,
} from 'selectors'

import Tooltip from 'components/tooltip/Tooltip'

import networkService from 'services/networkService'

import useFeeSwitcher from 'hooks/useFeeSwitcher'
import { getCoinImage } from 'util/coinImage'
import {
  FeeLabel,
  FeeSwitcherIcon,
  FeeSwitcherLabel,
  FeeSwitcherLabelWrapper,
  FeeSwitcherWrapper,
  FeeSwitchterDropdown,
} from './styles'

import BobaLogo from 'assets/images/Boba_Logo_White_Circle.png'
import { fetchBalances } from 'actions/networkAction'
import { Layer } from 'util/constant'

const OptionBoba = () => ({
  value: 'BOBA',
  label: 'BOBA',
  imgSrc: BobaLogo,
})

const OptionNativeToken = () => ({
  value: networkService.L1NativeTokenSymbol,
  label: networkService.L1NativeTokenName,
  imgSrc: getCoinImage(networkService.L1NativeTokenSymbol),
  imgType: 'img',
})

const FeeSwitcher: FC = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector(selectAccountEnabled())
  const feeUseBoba = useSelector(selectBobaFeeChoice())
  const networkName = useSelector(selectActiveNetworkName())
  const layer = useSelector(selectLayer())

  const { switchFeeUse } = useFeeSwitcher()

  useEffect(() => {
    dispatch(fetchBalances())
  }, [dispatch])

  if (accountEnabled && layer !== Layer.L2) {
    return (
      <FeeSwitcherWrapper>
        <Tooltip
          title={`After switching to the Boba network, you can modify the Gas fee token used by the Boba network. The whole network will use BOBA or ${networkService.L1NativeTokenSymbol} as the gas fee token according to your choice.`}
        >
          <FeeSwitcherIcon fontSize="small" />
        </Tooltip>
        <FeeSwitcherLabel>Fee</FeeSwitcherLabel>
      </FeeSwitcherWrapper>
    )
  } else if (layer === Layer.L2) {
    return (
      <FeeSwitcherWrapper data-testid={'feeSwitcher'}>
        <FeeSwitcherLabelWrapper>
          <FeeLabel>Fee</FeeLabel>
          <Tooltip
            title={`BOBA or ${networkService.L1NativeTokenSymbol} will be used across ${networkName['l2']} according to your choice.`}
          >
            <FeeSwitcherIcon fontSize="small" />
          </Tooltip>
        </FeeSwitcherLabelWrapper>
        <FeeSwitchterDropdown
          items={[OptionBoba(), OptionNativeToken()]}
          defaultItem={feeUseBoba ? OptionBoba() : OptionNativeToken()}
          onItemSelected={(option: any) => switchFeeUse(option.value)}
          setSelectedOnClick={false}
          error={true}
        />
      </FeeSwitcherWrapper>
    )
  }

  return null
}

export default FeeSwitcher
