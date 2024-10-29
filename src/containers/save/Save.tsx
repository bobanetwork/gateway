import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchBobaTokenDetail,
  fetchStakeInfo,
  fetchSavings,
} from 'actions/fixedAction'
import { openModal } from 'actions/uiAction'

import * as S from './Save.styles'

import Connect from 'containers/connect'

import { Preloader } from 'components/dao/preloader'
import { Button } from 'components/global/button'
import { PlaceholderConnect } from 'components/global/placeholderConnect'
import { Typography } from 'components/global/typography'
import TransactionList from 'components/stake/transactionList'
import { BigNumber, utils } from 'ethers'
import { toWei_String } from 'util/amountConvert'

import { selectFixed, selectLayer, selectSetup } from 'selectors'
import fixedSavingService from 'services/fixedsaving/fixedSaving.service'
import styled from 'styled-components'
import { getCoinImage } from 'util/gitdata'

const Description = styled(Typography).attrs({
  variant: 'body2',
})`
  color: ${(props) =>
    props.theme.name === 'light' ? props.theme.colors.gray[700] : '#acacac'};
  margin-top: 8px;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px !important;
  text-align: left;
`

const Save = () => {
  const layer = useSelector(selectLayer())
  const { stakeInfo, bobaToken } = useSelector(selectFixed())
  const { accountEnabled, netLayer, bobaFeeChoice, bobaFeePriceRatio } =
    useSelector(selectSetup())

  const dispatch = useDispatch<any>()

  const [state, setState] = useState({
    max_Float_String: '0.0',
    fee: '0',
  })

  useEffect(() => {
    if (accountEnabled) {
      dispatch(fetchSavings())
      dispatch(fetchStakeInfo())
      dispatch(fetchBobaTokenDetail())
    }
  }, [accountEnabled])

  useEffect(() => {
    getMaxTransferValue()
  }, [bobaToken])

  const getMaxTransferValue = async () => {
    // BOBA available prepare transferEstimate
    if (bobaToken) {
      let max_BN = BigNumber.from(bobaToken.balance.toString())
      let fee = '0'

      if (netLayer === 'L2') {
        const cost_BN: any = await fixedSavingService.savingEstimate()

        if (bobaFeeChoice) {
          // we are staking BOBA and paying in BOBA
          // so need to subtract the BOBA fee
          max_BN = max_BN.sub(cost_BN.mul(BigNumber.from(bobaFeePriceRatio)))
        }

        // make sure user maintains minimum BOBA in account
        max_BN = max_BN.sub(BigNumber.from(toWei_String(3.0, 18)))

        if (bobaFeeChoice) {
          fee = utils.formatUnits(
            cost_BN.mul(BigNumber.from(bobaFeePriceRatio)),
            bobaToken.decimals
          )
        } else {
          fee = utils.formatUnits(cost_BN, bobaToken.decimals)
        }
      }

      if (max_BN.lt(BigNumber.from('0'))) {
        max_BN = BigNumber.from('0')
      }

      setState((prevState) => ({
        ...prevState,
        max_Float_String: utils.formatUnits(max_BN, bobaToken.decimals),
        fee,
      }))
    }
  }

  const totalBOBAstaked = Object.keys(stakeInfo).reduce((accumulator, key) => {
    if (stakeInfo[key].isActive) {
      return accumulator + Number(stakeInfo[key].depositAmount)
    }
    return accumulator
  }, 0)

  const Loader = () => {
    const isLoading = state.fee === '0' ? true : false
    return (
      <PlaceholderConnect
        isLoading={accountEnabled && isLoading}
        preloader={<Preloader />}
      />
    )
  }
  return (
    <S.StakePageContainer id={'stake'}>
      <S.PaddingContainer>
        <Connect
          userPrompt={'Please connect to Boba to stake'}
          accountEnabled={accountEnabled}
          connectToBoba={true}
          layer={netLayer}
        />
      </S.PaddingContainer>
      <S.GridContainer>
        <S.PaddingContainer>
          <S.BlockContainer>
            <S.Flex>
              <div>
                <Typography variant="title">
                  <img
                    src={getCoinImage('boba')}
                    alt="Boba logo"
                    width="20px"
                    className="border: 1px solid   gray"
                  />
                  Boba
                </Typography>
                <Description>
                  {Number(state.max_Float_String).toFixed(4)} BOBA
                </Description>
              </div>
            </S.Flex>
            <div>
              <div>
                <Typography variant="title">APY</Typography>
                <Description>5.0%</Description>
              </div>
            </div>
            <div>
              <Typography variant="title">Staked</Typography>
              <Description>
                {Number(totalBOBAstaked).toFixed(4)} BOBA
              </Description>
            </div>
            {layer === 'L2' && (
              <div>
                <Button
                  label="Stake"
                  style={{ width: '100%' }}
                  disabled={!Boolean(state.max_Float_String !== '0.0')}
                  onClick={() =>
                    dispatch(openModal({ modal: 'StakeDepositModal' }))
                  }
                />
              </div>
            )}
          </S.BlockContainer>
        </S.PaddingContainer>
        <S.PaddingContainer>
          <S.BlockContainer>
            <div>
              <Typography variant="title">Staking Period</Typography>
              <Description>
                Each staking period lasts 2 weeks. If you do not unstake after a
                <br />
                staking period, your stake will be automatically renewed.
              </Description>
            </div>
            <div>
              <Typography variant="title">Unstaking Window</Typography>
              <Description>
                The first two days of every staking period, except for the first
                <br />
                staking period, are the unstaking window. You can only unstake
                <br />
                during the unstaking window.
              </Description>
            </div>
          </S.BlockContainer>
        </S.PaddingContainer>
      </S.GridContainer>
      <>
        <S.PaddingContainer>
          <S.TitleContainer>
            <Typography variant="title">Staking History</Typography>
          </S.TitleContainer>
        </S.PaddingContainer>
        <S.MobileTableContainer>
          {(!stakeInfo && layer === 'L2') ||
          (!Object.keys(stakeInfo).length && layer === 'L2') ? (
            <Loader />
          ) : (
            <>
              <S.StakeItemContainer>
                {Object.keys(stakeInfo).map((v, i) => {
                  if (stakeInfo[i].isActive) {
                    return <TransactionList stakeInfo={stakeInfo[i]} key={v} />
                  }
                  return null
                })}
              </S.StakeItemContainer>
            </>
          )}
        </S.MobileTableContainer>
      </>
    </S.StakePageContainer>
  )
}

export default Save
