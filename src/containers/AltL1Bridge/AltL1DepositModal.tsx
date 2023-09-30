// TODO: remove me once light bridge is ready for access.
import { fetchAltL1DepositFee, fetchL1FeeBalance } from 'actions/balanceAction'
import { depositErc20ToL1 } from 'actions/networkAction'
import { closeModal, openAlert, setActiveHistoryTab } from 'actions/uiAction'
import BN from 'bn.js'
import { Button as NewButton, Typography } from 'components/global'
import Modal from 'components/modal/Modal'
import Select from 'components/select/Select'
import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAltL1DepositCost,
  selectL1FeeBalance,
  selectLoading,
  selectLookupPrice,
} from 'selectors'
import networkService from 'services/networkService'
import { amountToUsd, logAmount } from 'util/amountConvert'
import { getCoinImage } from 'util/coinImage'

import InputWithButton from 'components/global/inputWithButton'
import styled from 'styled-components'
import { BridgeInfoContainer } from 'containers/Bridging/BridgeInput/styles'
import BridgeAlert from 'containers/Bridging/BridgeAlert'
import { clearBridgeAlert, setBridgeAlert } from 'actions/bridgeAction'

export const AltL1DepositModalBody = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`
export const AltL1DepositModalAction = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`

export const AltL1ChainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  & {
    "div[class^='select_select__']": {
      width: 100%;
    }
  }
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const InputContainerLabel = styled(Typography).attrs({
  variant: 'body3',
})`
  color: ${({ theme, error }) =>
    error ? theme.colors.red[300] : theme.colors.color};
  align-self: flex-end;
  font-weight: 400;
`

const AltL1DepositModal = ({ token, isBridge, open }: any) => {
  const getImageComponent = (symbol) => {
    return (
      <img
        src={getCoinImage(symbol)}
        height="35"
        width="35"
        alt={symbol}
        style={{ padding: 5 }}
      />
    )
  }

  const options = [
    {
      value: 'BNB',
      title: 'BNB',
      icon: getCoinImage('BNB'),
    },
    {
      value: 'Avalanche',
      title: 'Avalanche',
      icon: getCoinImage('AVAX'),
    },
  ].filter((i) => networkService.supportedAltL1Chains.includes(i.value))

  const dispatch = useDispatch<any>()

  const [value, setValue] = useState('')
  const [altL1Bridge, setAltL1Bridge] = useState('BNB')

  const [validValue, setValidValue] = useState(false)
  const depositLoading = useSelector(selectLoading(['DEPOSIT_ALTL1/CREATE']))

  const lookupPrice = useSelector(selectLookupPrice)
  const depositFees = useSelector(selectAltL1DepositCost)
  const feeBalance = useSelector(selectL1FeeBalance) //amount of ETH on L1 to pay gas

  const maxValue = logAmount(token.balance, token.decimals)

  const setAmount = (value) => {
    const tooSmall = new BN(Number(value)).lte(new BN(0.0))
    const tooBig = new BN(Number(value)).gt(new BN(Number(maxValue)))

    if (tooSmall) {
      dispatch(
        setBridgeAlert({
          meta: 'VALUE_TOO_SMALL',
          type: 'error',
          text: `Value too small: the value must be greater than 0`,
        })
      )
    } else if (tooBig) {
      dispatch(
        setBridgeAlert({
          meta: 'VALUE_TOO_LARGE',
          type: 'error',
          text: `Value too large: the value must be smaller than ${Number(
            maxValue
          ).toFixed(5)}`,
        })
      )
    }

    if (tooSmall || tooBig) {
      setValidValue(false)
    } else {
      dispatch(
        clearBridgeAlert({
          keys: ['VALUE_TOO_LARGE', 'VALUE_TOO_SMALL'],
        })
      )
      setValidValue(true)
    }

    setValue(value)
  }

  const handleClose = () => {
    dispatch(
      clearBridgeAlert({
        keys: ['ALT_L1_ALERT', 'VALUE_TOO_LARGE', 'VALUE_TOO_SMALL'],
      })
    )
    dispatch(closeModal('ALTL1DEPOSITMODAL'))
  }

  const doDeposit = async () => {
    console.log([
      `Trigger deposit to alt l1`,
      {
        value,
        type: altL1Bridge,
      },
    ])
    const res = await dispatch(
      depositErc20ToL1({
        value,
        type: altL1Bridge,
      })
    )

    if (res) {
      dispatch(
        openAlert(
          `Successfully bridge ${token.symbol} to alt L1 ${altL1Bridge}!`
        )
      )
      dispatch(setActiveHistoryTab('Bridge between L1s'))
      handleClose()
    } else {
      console.log(`🤦 opps something wrong!`)
      handleClose()
    }
  }

  useEffect(() => {
    dispatch(fetchL1FeeBalance()) //ETH balance for paying gas
    dispatch(fetchAltL1DepositFee())
  }, [dispatch])

  let buttonLabel_1 = 'Cancel'
  if (depositLoading) {
    buttonLabel_1 = 'Close'
  }

  let convertToUSD = false

  if (
    Object.keys(lookupPrice) &&
    !!value &&
    validValue &&
    !!amountToUsd(value, lookupPrice, token)
  ) {
    convertToUSD = true
  }

  if (Number(logAmount(token.balance, token.decimals)) === 0) {
    //no token in this account
    return (
      <div>
        <Typography variant="body2">
          Sorry, nothing to deposit - no {token.symbol} in this wallet
        </Typography>
        <NewButton onClick={handleClose} label="Cancel" outline={true} />
      </div>
    )
  }

  const onBridgeChange = (e: any) => {
    setAltL1Bridge(e.value)
  }

  let warning = false

  if (depositFees[altL1Bridge]) {
    if (Number(depositFees[altL1Bridge].fee) > Number(feeBalance)) {
      warning = true
      dispatch(
        setBridgeAlert({
          meta: 'ALT_L1_ALERT',
          type: 'error',
          text: `WARNING: your L1 ${
            networkService.L1NativeTokenSymbol
          } balance of ${Number(feeBalance).toFixed(
            4
          )} is not sufficient to cover this transaction.`,
        })
      )
    } else {
      warning = false
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title={`Bridge ${token && token.symbol ? token.symbol : ''} to Alt L1s`}
      transparent={false}
    >
      <>
        <BridgeAlert />
        <AltL1DepositModalBody>
          <AltL1ChainContainer>
            <Typography variant="body2">Select Alt L1 Chain</Typography>

            <Select
              options={options}
              label=""
              onSelect={onBridgeChange}
              value={altL1Bridge === 'BNB' ? options[0] : options[1]}
              loading={false}
              className=""
              isMulti={false}
              newSelect
            />
          </AltL1ChainContainer>

          <InputContainerLabel error={!validValue}>
            Balance: {maxValue} {token ? token.symbol : ''}
          </InputContainerLabel>

          <InputWithButton
            placeholder={`Amount to bridge to Alt L1`}
            buttonLabel="max"
            type="number"
            name="bridgeAmount"
            disabled={!token}
            value={value}
            onButtonClick={() => setAmount(maxValue)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(e.target.value)
            }}
          />

          <BridgeInfoContainer>
            {!!altL1Bridge && depositFees ? (
              <InfoRow>
                <Typography variant="body3">Estimated fee</Typography>
                <Typography variant="body3">
                  {depositFees[altL1Bridge].fee} ETH
                </Typography>
              </InfoRow>
            ) : null}

            {!!convertToUSD && (
              <InfoRow>
                <Typography variant="body3">Amount in USD</Typography>
                <Typography variant="body3">
                  {amountToUsd(value, lookupPrice, token).toFixed(4)}
                </Typography>
              </InfoRow>
            )}
          </BridgeInfoContainer>
        </AltL1DepositModalBody>
        <AltL1DepositModalAction>
          <NewButton tiny onClick={handleClose} outline label={buttonLabel_1} />
          <NewButton
            tiny
            onClick={doDeposit}
            label="Bridge"
            loading={depositLoading}
            disable={!validValue || !altL1Bridge || warning}
          />
        </AltL1DepositModalAction>
      </>
    </Modal>
  )
}

export default AltL1DepositModal
