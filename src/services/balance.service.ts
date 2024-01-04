import {
  L1FeeBalance,
  L2BalanceETH,
  L2BalanceBOBA,
  L1LPBalance,
  L2LPBalance,
  L1LPLiquidity,
  L2LPPending,
  L2LPLiquidity,
  L1LPPending,
  Balances,
} from './balances'
export class BalanceService {
  getL1FeeBalance = async () => L1FeeBalance()
  getL2BalanceETH = async () => L2BalanceETH()
  getL2BalanceBOBA = async () => L2BalanceBOBA()
  getL1LPBalance = async (tokenAddress: string) => L1LPBalance(tokenAddress)
  getL1LPLiquidity = async (tokenAddress: string) => L1LPLiquidity(tokenAddress)
  getL2LPBalance = async (tokenAddress: string) => L2LPBalance(tokenAddress)
  getL1LPPending = async (tokenAddress: string) => L1LPPending(tokenAddress)
  getL2LPPending = async (tokenAddress: string) => L2LPPending(tokenAddress)
  getL2LPLiquidity = async (tokenAddress: string) => L2LPLiquidity(tokenAddress)
  getBalances = async () => Balances()
}

const balanceService = new BalanceService()

export default balanceService
