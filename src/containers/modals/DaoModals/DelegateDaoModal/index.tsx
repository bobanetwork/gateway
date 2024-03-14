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
import { Dropdown, IDropdownItem } from 'components/global/dropdown'
import { getCoinImage } from 'util/coinImage'
import { TabComponent } from 'components/global/tabs'
import { DescriptionStyled, ButtonContainer, Detail } from './styles'
import { ModalInterface } from '../../types'

const DelegateDaoModal: React.FC<ModalInterface> = ({ open }) => {
  const [recipient, setRecipient] = useState('')
  const [isDelegating, setIsDelegating] = useState(false)
  const [selectedToken, setSelectedToken] = useState<IDropdownItem | null>(null)

  const dispatch = useDispatch()
  const wAddress = networkService.account || ''

  const handleClose = () => {
    setRecipient('')
    dispatch(closeModal('delegateDaoModal'))
  }

  const submit = async (isSelfDelegation) => {
    if (!selectedToken) {
      return null
    }

    const recipientAddress = isSelfDelegation ? wAddress : recipient

    setIsDelegating(true)

    const res = await dispatch(
      selectedToken?.value === 'xboba'
        ? delegateVotesX({ recipient: recipientAddress })
        : delegateVotes({ recipient: recipientAddress })
    )

    setIsDelegating(false)
    if (res) {
      dispatch(
        openAlert(
          `Votes ${
            isSelfDelegation ? 'self-delegated' : 'delegated'
          } successfully!`
        )
      )
    }

    handleClose()
  }

  const SelectToken = () => (
    <Dropdown
      error={!selectedToken}
      onItemSelected={(token) => setSelectedToken(token)}
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

  const delegateLayout = (isSelfDelegation: boolean) => (
    <>
      <DescriptionStyled>
        My address: <br />
        {wAddress}
        <Detail>Choose which BOBA to delegate BOBA voting power to</Detail>
      </DescriptionStyled>
      <SelectToken />
      {!isSelfDelegation && (
        <Input
          label="Destination Address:"
          placeholder="Enter Address here (0x...)"
          value={recipient}
          onChange={(i) => setRecipient(i.target.value)}
        />
      )}
      <ButtonContainer>
        <Button
          onClick={async () => submit(isSelfDelegation)}
          loading={isDelegating}
          disabled={(!isSelfDelegation && !recipient) || isDelegating}
          label="Delegate"
        />
        <Button onClick={() => handleClose()} transparent label="Cancel" />
      </ButtonContainer>
    </>
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title="Delegate Vote"
      testId="delegate-dao-modal"
    >
      <TabComponent
        tabs={[
          {
            label: 'To Myself',
            content: delegateLayout(true),
          },
          {
            label: 'To Someone Else',
            content: delegateLayout(false),
          },
        ]}
      />
    </Modal>
  )
}

export default React.memo(DelegateDaoModal)
