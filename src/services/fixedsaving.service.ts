import { BigNumberish } from 'ethers'

import {
  AddSavings,
  SavingEstimate,
  FsSaves,
  FsInfo,
  WithdrawSavings,
} from './fixedsavings'
export class FixedSavingService {
  addFS_Savings = async (amountToStake: BigNumberish) =>
    AddSavings(amountToStake)
  savingEstimate = async () => SavingEstimate()
  withdrawFS_Savings = async (stakeId: number) => WithdrawSavings
  getFS_Saves = async () => FsSaves()
  getFS_Info = async () => FsInfo()
}

const fixedSavingService = new FixedSavingService()
export default fixedSavingService
