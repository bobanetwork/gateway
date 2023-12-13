import { ModalInterface } from '../../types'

export interface CastVoteModalInterface extends ModalInterface {
  proposalId: number
  destNetworkSelection?: boolean
}
