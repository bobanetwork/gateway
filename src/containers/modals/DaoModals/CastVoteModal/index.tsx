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

import { castProposalVote } from 'actions/daoAction'
import { closeModal, openAlert } from 'actions/uiAction'

import { Button } from 'components/global/button'
import { Dropdown, IDropdownItem } from 'components/global/dropdown'
import Modal from 'components/modal/Modal'

import { VoteOptions } from './CONST'
import { Container, StyledDescription } from './styles'
import { CastVoteModalInterface } from './types'

const CastVoteModal: React.FC<CastVoteModalInterface> = ({
  open,
  proposalId,
}) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVoteType, setselectedVoteType] =
    useState<IDropdownItem | null>(null)

  const onVoteTypeChange = (voteType) => {
    setselectedVoteType(voteType)
  }

  const handleClose = () => {
    dispatch(closeModal('castVoteModal'))
  }

  const submit = async () => {
    if (selectedVoteType) {
      setIsLoading(true)
      const res = await dispatch(
        castProposalVote({
          id: Number(proposalId),
          userVote: selectedVoteType ? selectedVoteType.value : null,
        })
      )
      setIsLoading(false)
      if (res) {
        dispatch(openAlert(`Your vote has been submitted successfully.`))
      }
    }
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={`Cast Your Vote on Proposal #${proposalId}`}
      testId="castvote-proposal-modal"
    >
      <Container>
        <StyledDescription>
          Select your stance on Proposal #${proposalId}:
        </StyledDescription>
        <Dropdown
          style={{ zIndex: 2 }}
          onItemSelected={(option) => onVoteTypeChange(option)}
          defaultItem={
            selectedVoteType || {
              label: 'Select a Vote type',
            }
          }
          items={VoteOptions}
        />
      </Container>
      <Button
        onClick={async () => submit()}
        loading={isLoading}
        disabled={!selectedVoteType || isLoading}
        label="Submit"
      />
    </Modal>
  )
}

export default React.memo(CastVoteModal)
