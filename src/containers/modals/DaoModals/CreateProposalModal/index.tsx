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
import { Button } from 'components/global/button'
import Input from 'components/input/Input'

import { createDaoProposal } from 'actions/daoAction'
import { selectProposalThreshold } from 'selectors'
import { Dropdown, IDropdownItem } from 'components/global/dropdown'

import { tokensType } from './types'
import { ModalContainer, ButtonContainer, StyledDescription } from './styles'

const CreateProposalModal = ({ open }) => {
  const dispatch = useDispatch<any>()

  const [action, setAction] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [tokens, setTokens] = useState<tokensType[]>([])
  const [votingThreshold, setVotingThreshold] = useState('')

  const [errorText, setErrorText] = useState('')

  const [LPfeeMin, setLPfeeMin] = useState('')
  const [LPfeeMax, setLPfeeMax] = useState('')
  const [LPfeeOwn, setLPfeeOwn] = useState('')

  const [proposeText, setProposeText] = useState('')
  const [proposalUri, setProposalUri] = useState('')

  const loading = false //ToDo useSelector(selectLoading([ 'PROPOSAL_DAO/CREATE' ]))

  const proposalThreshold = useSelector(selectProposalThreshold)

  useEffect(() => {
    const tokensSum = tokens.reduce((c, i) => c + Number(i.balance), 0)
    if (tokensSum < proposalThreshold) {
      setErrorText(
        `Insufficient govBOBA to create a new proposal. You need at least ${proposalThreshold} govBOBA to create a proposal.`
      )
    } else {
      setErrorText('')
    }
  }, [tokens, proposalThreshold])

  const onActionChange = (e) => {
    setVotingThreshold('')
    setLPfeeMin('')
    setLPfeeMax('')
    setLPfeeOwn('')
    setProposeText('')
    setProposalUri('')
    setSelectedAction(e)
    setAction(e.value)
  }

  const handleClose = () => {
    setVotingThreshold('')
    setLPfeeMin('')
    setLPfeeMax('')
    setLPfeeOwn('')
    setAction('')
    setProposeText('')
    setProposalUri('')
    dispatch(closeModal('createProposalModal'))
  }

  const options: IDropdownItem[] = [
    { value: 'change-threshold', label: 'Change Voting Threshold' },
    { value: 'text-proposal', label: 'Freeform Text Proposal' },
    { value: 'change-lp1-fee', label: 'Change L1 LP fees' },
    { value: 'change-lp2-fee', label: 'Change L2 LP fees' },
  ]

  const submit = async () => {
    let res = null
    const tokenIds = tokens.map((t) => t?.value)

    if (action === 'change-threshold') {
      res = await dispatch(
        createDaoProposal({
          action,
          tokenIds,
          value: [votingThreshold],
          text: '', //extra text if any
        })
      )
    } else if (action === 'text-proposal') {
      res = await dispatch(
        createDaoProposal({
          action,
          tokenIds,
          text: `${proposeText}@@${proposalUri}`,
        })
      )
    } else if (action === 'change-lp1-fee' || action === 'change-lp2-fee') {
      res = await dispatch(
        createDaoProposal({
          action,
          tokenIds,
          value: [
            Math.round(Number(LPfeeMin) * 10),
            Math.round(Number(LPfeeMax) * 10),
            Math.round(Number(LPfeeOwn) * 10),
          ],
          text: '',
        })
      )
    }

    if (res) {
      dispatch(openAlert(`Proposal has been submitted. It will be listed soon`))
    }
    handleClose()
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
      const isValidRange =
        Number(LPfeeMin) >= 0.0 &&
        Number(LPfeeMin) < 5.0 &&
        Number(LPfeeMax) > 0.0 &&
        Number(LPfeeMax) <= 5.0 &&
        Number(LPfeeMax) > Number(LPfeeMin)

      if (
        !isValidRange ||
        Number(LPfeeOwn) < 0.0 ||
        Number(LPfeeOwn) > 5.0 ||
        LPfeeMin === '' ||
        LPfeeMax === '' ||
        LPfeeOwn === ''
      ) {
        return true // aka disabled
      }

      return false
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title="Create Proposal"
    >
      <div>
        <ModalContainer>
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
                onChange={(i) => setVotingThreshold(i.target.value)}
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
                onChange={(i) => setLPfeeMin(i.target.value)}
                fullWidth
              />
              <Input
                label="New LP maximum fee (%)"
                placeholder="Maximum fee (e.g. 3.0)"
                value={LPfeeMax}
                type="number"
                onChange={(i) => setLPfeeMax(i.target.value)}
                fullWidth
              />
              <Input
                label="New LP operator fee (%)"
                placeholder="Operator fee (e.g. 1.0)"
                value={LPfeeOwn}
                type="number"
                onChange={(i) => setLPfeeOwn(i.target.value)}
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
                onChange={(i) => setProposeText(i.target.value.slice(0, 100))}
              />
              <StyledDescription>
                You should provide additional information (technical
                specifications, diagrams, forum threads, and other material) on
                a seperate website. The link length is limited to 150
                characters. You may need to use a link shortener.
              </StyledDescription>
              <Input
                placeholder="URI, https://..."
                value={proposalUri}
                onChange={(i) => setProposalUri(i.target.value.slice(0, 150))}
              />
            </>
          )}
          {errorText ? (
            <StyledDescription error={true}>{errorText}</StyledDescription>
          ) : null}
        </ModalContainer>
      </div>
      <ButtonContainer>
        <Button
          onClick={() => {
            submit()
          }}
          loading={loading}
          disable={disabled() || !!errorText}
          label="Submit"
        />
      </ButtonContainer>
    </Modal>
  )
}

export default React.memo(CreateProposalModal)
