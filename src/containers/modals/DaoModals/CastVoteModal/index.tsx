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

import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openAlert } from 'actions/uiAction'
import { castProposalVote } from 'actions/daoAction'

import { selectLoading } from 'selectors'

import Modal from 'components/modal/Modal'
import { Dropdown, IDropdownItem } from 'components/global/dropdown'
import { Button } from 'components/global/button'

import { CastVoteModalInterface } from './types'
import { VoteOptions } from './CONST'
import { Container } from './styles'

const CastVoteModal: React.FC<CastVoteModalInterface> = ({
  open,
  proposalId,
}) => {
  const dispatch = useDispatch()
  const [selectedVoteType, setselectedVoteType] =
    useState<IDropdownItem | null>(null)

  const loading = useSelector(selectLoading(['PROPOSAL/CAST/VOTE']))

  const onVoteTypeChange = (voteType) => {
    setselectedVoteType(voteType)
  }

  const handleClose = () => {
    dispatch(closeModal('castVoteModal'))
  }

  const submit = async () => {
    const res = await dispatch(
      castProposalVote({
        id: Number(proposalId),
        userVote: selectedVoteType ? selectedVoteType.value : null,
      })
    )

    if (res) {
      dispatch(openAlert(`Your vote has been submitted successfully.`))
    }
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={`Cast Vote on proposal ${proposalId}`}
      testId="castvote-proposal-modal"
    >
      <div>
        <Container>
          <Dropdown
            style={{ zIndex: 2 }}
            onItemSelected={(option) => onVoteTypeChange(option)}
            defaultItem={{
              label: 'Select a Vote type',
            }}
            items={VoteOptions}
          />
        </Container>
      </div>
      <Button
        onClick={async () => submit()}
        loading={loading}
        disabled={!selectedVoteType}
        label="Submit"
      />
    </Modal>
  )
}

export default React.memo(CastVoteModal)
