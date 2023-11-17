import { BigNumberish } from 'ethers'

export type TxPayload = {
  from: string
  to: string
  value: BigNumberish
  data: string
}
