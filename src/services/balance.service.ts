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
  async getL1FeeBalance() {
    return L1FeeBalance()
  }

  async getL2BalanceETH() {
    return L2BalanceETH()
  }

  async getL2BalanceBOBA() {
    return L2BalanceBOBA()
  }

  async getL2LPPending(tokenAddress: string) {
    return L2LPPending()
  }

  async getL1LPBalance(tokenAddress: string): Promise<string> {
    return L1LPBalance(tokenAddress)
  }

  async getL1LPLiquidity(tokenAddress: string) {
    return L1LPLiquidity(tokenAddress)
  }

  async getL2LPBalance(tokenAddress: string): Promise<string> {
    return L2LPBalance(tokenAddress)
  }

  async getBalances() {
    return Balances()
  }

  async getL1LPPending(tokenAddress: string) {
    return L1LPPending(tokenAddress)
  }

  async getL2LPLiquidity(tokenAddress: string) {
    return L2LPLiquidity(tokenAddress)
  }
}

const balanceService = new BalanceService()

export default balanceService
