import { ModalInterface } from '../types'

export type optionsType = {
  value: string | number | undefined
  label: string
}

export type Options = optionsType[]

export type VoteType = optionsType | null

export interface CastVoteModalInterface extends ModalInterface {
  proposalId: string
}

export type TokenTypes = {
  label: string
  imgSrc?: string
  value?: string
}
