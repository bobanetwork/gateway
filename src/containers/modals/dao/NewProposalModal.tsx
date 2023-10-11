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

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openAlert } from 'actions/uiAction'

import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import Input from 'components/input/Input'

import {
  selectProposalThreshold,
  selectDaoLoading,
  selectErrorText,
} from 'selectors'

import { createDaoProposal, createTextError } from 'actions/daoAction'
import { Dropdown } from 'components/global/dropdown'
import { Options } from './types'
import { ButtonContainer, StyledDescription, Container } from './styles'
import { proposalConfig, options } from './CONST'

const NewProposalModal = ({ open }) => {
  const dispatch = useDispatch<any>()
  const loading = useSelector(selectDaoLoading)
  const errorText = useSelector(selectErrorText)
  const [state, setState] = useState<any>({
    //move to reducer
    action: '',
    selectedAction: '',
    tokens: [],
    votingThreshold: '',
    LPfeeMin: '',
    LPfeeMax: '',
    LPfeeOwn: '',
    proposeText: '',
    proposalUri: '',
  })

  const {
    action,
    selectedAction,
    tokens,
    votingThreshold,
    LPfeeMin,
    LPfeeMax,
    LPfeeOwn,
    proposeText,
    proposalUri,
  } = state

  const proposalThreshold = useSelector(selectProposalThreshold)

  useEffect(() => {
    const tokensSum = tokens.reduce((c, i) => c + Number(i.balance), 0)
    const error =
      tokensSum < proposalThreshold
        ? `Insufficient govBOBA to create a new proposal. You need at least ${proposalThreshold} govBOBA to create a proposal.`
        : ''
    dispatch(createTextError(error))
  }, [tokens, proposalThreshold])

  const handleStateChange = (actionEvent: any) => {
    const newState = {
      ...state,
      votingThreshold: '',
      LPfeeMin: '',
      LPfeeMax: '',
      LPfeeOwn: '',
      proposeText: '',
      proposalUri: '',
    }

    if (actionEvent) {
      newState.selectedAction = actionEvent
      newState.action = actionEvent.value
    } else {
      newState.action = ''
    }

    setState(newState)

    if (!actionEvent) {
      dispatch(closeModal('newProposalModal'))
    }
  }

  const submit = async () => {
    const tokenIds = tokens.map((t) => t.value)

    if (!proposalConfig[action]) {
      return
    }

    const { value, text } = proposalConfig[action]

    const res = await dispatch(
      createDaoProposal({
        action,
        tokenIds,
        value: value(),
        text: typeof text === 'function' ? text() : text,
      })
    )

    if (res) {
      dispatch(openAlert(`Proposal has been submitted. It will be listed soon`))
    }
    handleStateChange(null)
  }

  const isInvalidFee = (fee) => {
    return Number(fee) < 0.0 || Number(fee) > 5.0
  }

  const disabled = () => {
    if (!proposalThreshold) {
      return true
    }

    if (action === 'change-threshold') {
      return !votingThreshold
    } else if (action === 'text-proposal') {
      return !proposeText
    } else if (action === 'change-lp1-fee' || action === 'change-lp2-fee') {
      if (
        isInvalidFee(LPfeeMin) ||
        isInvalidFee(LPfeeMax) ||
        Number(LPfeeMax) <= Number(LPfeeMin) ||
        isInvalidFee(LPfeeOwn) ||
        LPfeeMin === '' ||
        LPfeeMax === '' ||
        LPfeeOwn === ''
      ) {
        return true //aka disabled
      }
      return false
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => handleStateChange(null)}
      title="Create Proposal"
    >
      <Container>
        {action === '' && (
          <StyledDescription>
            Currently, the DAO can change the voting threshold, propose
            free-form text proposals, and change to the bridge fee limits for
            the L1 and L2 bridge pools.
          </StyledDescription>
        )}
        <Dropdown
          style={{ zIndex: 1 }}
          onItemSelected={(e) => handleStateChange(e)}
          defaultItem={{
            label: 'Select Proposal type',
          }}
          items={options}
        />

        {action === 'change-threshold' && (
          <>
            <StyledDescription>
              The minimum number of votes required for an account to create a
              proposal. The current value is {proposalThreshold}.
            </StyledDescription>
            <Input
              label="DAO voting threshold"
              placeholder="New voting threshold (e.g. 65000)"
              value={votingThreshold}
              type="number"
              onChange={(i) =>
                setState({ ...state, votingThreshold: i.target.value })
              }
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
          </>
        )}
        {(action === 'change-lp1-fee' || action === 'change-lp2-fee') && (
          <>
            <StyledDescription>
              Possible settings range from 0.0% to 5.0%. All three values must
              be specified and the maximum fee must be larger than the minimum
              fee.
            </StyledDescription>
            <Input
              label="New LP minimium fee (%)"
              placeholder="Minimium fee (e.g. 1.0)"
              value={LPfeeMin}
              type="number"
              onChange={(i) => setState({ ...state, LPfeeMin: i.target.value })}
              fullWidth
            />
            <Input
              label="New LP maximum fee (%)"
              placeholder="Maximum fee (e.g. 3.0)"
              value={LPfeeMax}
              type="number"
              onChange={(i) => setState({ ...state, LPfeeMax: i.target.value })}
              fullWidth
            />
            <Input
              label="New LP operator fee (%)"
              placeholder="Operator fee (e.g. 1.0)"
              value={LPfeeOwn}
              type="number"
              onChange={(i) => setState({ ...state, LPfeeOwn: i.target.value })}
              fullWidth
            />
          </>
        )}
        {action === 'text-proposal' && (
          <>
            <StyledDescription>
              Your proposal title is limited to 100 characters. Use the link
              field below to provide more information.
            </StyledDescription>
            <Input
              placeholder="Title (<100 characters)"
              value={proposeText}
              onChange={(i) =>
                setState({
                  ...state,
                  proposeText: i.target.value.slice(0, 100),
                })
              }
            />
            <StyledDescription>
              You should provide additional information (technical
              specifications, diagrams, forum threads, and other material) on a
              seperate website. The link length is limited to 150 characters.
              You may need to use a link shortener.
            </StyledDescription>
            <Input
              placeholder="URI, https://..."
              value={proposalUri}
              onChange={(i) =>
                setState({
                  ...state,
                  proposalUri: i.target.value.slice(0, 150),
                })
              }
            />
          </>
        )}
        {errorText ? (
          <StyledDescription error={true}>{errorText}</StyledDescription>
        ) : null}
      </Container>
      <ButtonContainer>
        <Button
          onClick={() => {
            submit()
          }}
          color="primary"
          variant="outlined"
          tooltip={
            loading
              ? 'Your transaction is still pending. Please wait for confirmation.'
              : 'Click here to submit a new proposal'
          }
          loading={loading}
          disabled={disabled() || !!errorText}
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
