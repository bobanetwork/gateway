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

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { closeModal, openAlert } from 'actions/uiAction'

import Modal from 'components/modal/Modal'
import Input from 'components/input/Input'

import { delegateVotes, delegateVotesX } from 'actions/daoAction'

import networkService from 'services/networkService'

import { Button } from 'components/global/button'
import { Dropdown } from 'components/global/dropdown'
import { getCoinImage } from 'util/coinImage'
import { TabComponent } from 'components/global/tabs'
import { ButtonContainer, DescriptionStyled } from './styles'

import { TokenTypes } from './types'
import { ModalInterface } from '../types'

const DelegateDaoModal: React.FC<ModalInterface> = ({ open }) => {
  const [recipient, setRecipient] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenTypes | null>(null)
  const dispatch = useDispatch<any>()

  const disabled = !recipient
  const loading = false //ToDo useSelector(selectLoading([ 'DELEGATE_DAO/CREATE' ]))
  const wAddress = networkService.account || ''

  const handleClose = () => {
    setRecipient('')
    dispatch(closeModal('delegateDaoModal'))
  }

  const handleDelegate = async (recipientAddress) => {
    if (!selectedToken) {
      return null
    }

    const action =
      selectedToken.value === 'xboba' ? delegateVotesX : delegateVotes

    const res = await dispatch(action({ recipient: recipientAddress }))

    if (res) {
      const alertMessage =
        recipientAddress === wAddress
          ? `Vote self-delegation successful!`
          : `Votes delegated successfully!`
      dispatch(openAlert(alertMessage))
    }

    handleClose()
  }

  const submit = () => handleDelegate(recipient)
  const submitMe = () => handleDelegate(wAddress)

  const DescriptionAndSelector = () => (
    <>
      <DescriptionStyled>
        My address: <br />
        {wAddress}
        <br />
        <br />
        Choose which BOBA to delegate BOBA voting power to
      </DescriptionStyled>
      <SelectToken />
    </>
  )

  const RenderButtonContainer = ({ onSubmit, disabled = false }) => (
    <ButtonContainer>
      <Button
        onClick={onSubmit}
        loading={loading}
        disable={disabled}
        label="Delegate"
      />
      <Button onClick={handleClose} transparent label="Cancel" />
    </ButtonContainer>
  )

  const SelectToken = () => (
    <Dropdown
      error={selectedToken ? false : true}
      onItemSelected={(token) => setSelectedToken(token as TokenTypes)}
      defaultItem={
        selectedToken || {
          imgSrc: 'default',
          label: 'Choose type of BOBA',
        }
      }
      items={[
        { value: 'boba', label: 'Boba', imgSrc: getCoinImage('boba') },
        { value: 'xboba', label: 'xBoba', imgSrc: getCoinImage('xboba') },
      ]}
    />
  )

  return (
    <Modal open={open} onClose={handleClose} title="Delegate Vote">
      <TabComponent
        tabs={[
          {
            label: 'To Myself',
            content: (
              <>
                <DescriptionAndSelector />
                <RenderButtonContainer onSubmit={submitMe} />
              </>
            ),
          },
          {
            label: 'To Someone Else',
            content: (
              <>
                <DescriptionAndSelector />
                <Input
                  label="Destination Address:"
                  placeholder="Enter Address here (0x...)"
                  value={recipient}
                  onChange={(i) => setRecipient(i.target.value)}
                />
                <RenderButtonContainer onSubmit={submit} disabled={disabled} />
              </>
            ),
          },
        ]}
      />
    </Modal>
  )
}

export default React.memo(DelegateDaoModal)
