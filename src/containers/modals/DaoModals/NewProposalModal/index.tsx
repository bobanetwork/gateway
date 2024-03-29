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

import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openAlert } from 'actions/uiAction'

import Button from 'components/button/Button'
import Modal from 'components/modal/Modal'

import { createDaoProposal } from 'actions/daoAction'
import { Dropdown } from 'components/global/dropdown'
import {
  selectDaoVotes,
  selectDaoVotesX,
  selectProposalThreshold,
} from 'selectors'

import { ModalInterface } from '../../types'
import { options } from './CONST'
import { BoxContainer, ButtonContainer, StyledDescription } from './styles'

import { LPFeeSection, TextProposalSection, ThresholdSection } from './views'

const NewProposalModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch()
  const votes = useSelector(selectDaoVotes)
  const votesX = useSelector(selectDaoVotesX)
  const [action, setAction] = useState('')
  const [selectedAction, setSelectedAction] = useState<any>(null)
  const [votingThreshold, setVotingThreshold] = useState('')

  const [errorText, setErrorText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [LPfeeMin, setLPfeeMin] = useState('')
  const [LPfeeMax, setLPfeeMax] = useState('')
  const [LPfeeOwn, setLPfeeOwn] = useState('')

  const [proposeText, setProposeText] = useState('')
  const [proposalUri, setProposalUri] = useState('')

  const proposalThreshold = useSelector(selectProposalThreshold)

  useEffect(() => {
    const totalVotes = Number(votes) + Number(votesX)
    if (totalVotes < Number(proposalThreshold)) {
      setErrorText(
        `Your voting power is insufficient to initiate a new proposal. To create a proposal, you must have a minimum of ${proposalThreshold} BOBA + xBOBA voting power`
      )
    } else {
      setErrorText('')
    }
  }, [votes, votesX, proposalThreshold])

  const resetState = () => {
    setVotingThreshold('')
    setLPfeeMin('')
    setLPfeeMax('')
    setLPfeeOwn('')
    setAction('')
    setProposeText('')
    setProposalUri('')
  }

  const onActionChange = (e) => {
    resetState()
    setSelectedAction(e)
    setAction(e.value)
  }

  const handleClose = () => {
    resetState()
    dispatch(closeModal('newProposalModal'))
  }

  const submit = async () => {
    let res = null
    const roundValues = (min, max, own) => [
      Math.round(Number(min) * 10),
      Math.round(Number(max) * 10),
      Math.round(Number(own) * 10),
    ]

    const actionConfig = {
      'change-threshold': {
        value: [votingThreshold],
      },
      'text-proposal': {
        text: `${proposeText}@@${proposalUri}`,
      },
      'change-lp1-fee': {
        value: roundValues(LPfeeMin, LPfeeMax, LPfeeOwn),
      },
      'change-lp2-fee': {
        value: roundValues(LPfeeMin, LPfeeMax, LPfeeOwn),
      },
    }

    const actionParams = actionConfig[action] || { text: '' }

    try {
      setIsLoading(true)
      res = await dispatch(createDaoProposal({ action, ...actionParams }))
      setIsLoading(false)
    } catch (error) {
      console.error('Error submitting proposal:', error)
    }

    if (res) {
      dispatch(
        openAlert(`The proposal has been submitted and will be listed shortly!`)
      )
    }

    handleClose()
  }

  const disabled = () => {
    const actionConfig = {
      'change-threshold': () => !votingThreshold,
      'text-proposal': () => !proposeText,
      'change-lp1-fee': () => {
        if (Number(LPfeeMin) < 0.0 || Number(LPfeeMin) > 5.0) {
          return true // aka disabled
        }
        if (Number(LPfeeMax) < 0.0 || Number(LPfeeMax) > 5.0) {
          return true // aka disabled
        }
        if (Number(LPfeeMax) <= Number(LPfeeMin)) {
          return true // aka disabled
        }
        if (Number(LPfeeOwn) < 0.0 || Number(LPfeeOwn) > 5.0) {
          return true
        }
        if (LPfeeMin === '' || LPfeeMax === '' || LPfeeOwn === '') {
          return true
        }
        return false
      },
    }

    const actionDisabledCheck = actionConfig[action] || (() => true)

    return !proposalThreshold || actionDisabledCheck()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title="Create Proposal"
      testId="newproposal-dao-modal"
    >
      <div>
        <BoxContainer>
          {action === '' && (
            <StyledDescription>
              Currently, the DAO can change the voting threshold, propose
              free-form text proposals, and change to the bridge fee limits for
              the L1 and L2 bridge pools.
            </StyledDescription>
          )}
          <Dropdown
            style={{ zIndex: 1 }}
            onItemSelected={onActionChange}
            defaultItem={
              selectedAction || {
                label: 'Select Proposal type',
              }
            }
            items={options}
          />

          {action === 'change-threshold' && (
            <ThresholdSection
              votingThreshold={votingThreshold}
              setVotingThreshold={setVotingThreshold}
            />
          )}
          {(action === 'change-lp1-fee' || action === 'change-lp2-fee') && (
            <LPFeeSection
              LPfeeMin={LPfeeMin}
              setLPfeeMin={setLPfeeMin}
              LPfeeMax={LPfeeMax}
              setLPfeeMax={setLPfeeMax}
              LPfeeOwn={LPfeeOwn}
              setLPfeeOwn={setLPfeeOwn}
            />
          )}
          {action === 'text-proposal' && (
            <TextProposalSection
              proposeText={proposeText}
              setProposeText={setProposeText}
              proposalUri={proposalUri}
              setProposalUri={setProposalUri}
            />
          )}
          {errorText ? (
            <StyledDescription error={true}>{errorText}</StyledDescription>
          ) : null}
        </BoxContainer>
      </div>
      <ButtonContainer>
        <Button
          onClick={() => {
            submit()
          }}
          color="primary"
          variant="outlined"
          tooltip={
            isLoading
              ? 'Your transaction is still pending. Please wait for confirmation.'
              : 'Click here to submit a new proposal'
          }
          loading={isLoading}
          disabled={disabled() || !!errorText || isLoading}
          fullWidth={true}
          size="large"
        >
          Submit
        </Button>
      </ButtonContainer>
    </Modal>
  )
}

export default React.memo(NewProposalModal)
