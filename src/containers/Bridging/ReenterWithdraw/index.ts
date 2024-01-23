import networkService from '../../../services/networkService'
import { anchorageGraphQLService } from '../../../services/graphql.service'

interface WithdrawalSubmitted {
  blockHash: string
  withdrawalHash: string
}
interface ReenterWithdrawalResponse {
  message: string
  step: 3 | 5
  withdrawalHash: WithdrawalSubmitted
}

export const checkReenterWithdraw = async (
  address: string
): Promise<ReenterWithdrawalResponse | false> => {
  if (!address || !networkService.L2ToL1MessagePasser) {
    return false
  }
  const l2BridgeLogs =
    await anchorageGraphQLService.findWithdrawalsInitiated(address)
  const l2toL1Logs =
    await anchorageGraphQLService.findWithdrawalMessagesPassed()
  const withdrawalHashesLogs =
    await anchorageGraphQLService.findWithdrawHashesFromLogs(
      l2BridgeLogs,
      l2toL1Logs
    )
  const withdrawalsProven =
    await anchorageGraphQLService.findWithdrawalsProven()
  for (const withdrawalSubmit of withdrawalHashesLogs) {
    if (
      !withdrawalsProven.find(
        (proven) =>
          proven?.args?.withdrawalHash === withdrawalSubmit.withdrawalHash
      )
    ) {
      return {
        message: 'User has submitted a withdrawal, but not proven',
        step: 3, // needs approval
        withdrawalHash: withdrawalSubmit,
      }
    }
  }
  const withdrawalsFinalized =
    await anchorageGraphQLService.findWithdrawalsFinalized()
  for (const withdrawalSubmit of withdrawalHashesLogs) {
    if (
      !withdrawalsFinalized.find(
        (proven) =>
          proven?.args?.withdrawalHash === withdrawalSubmit.withdrawalHash
      )
    ) {
      return {
        message:
          'User has submitted a withdrawal, proven it but not claimed/finalized',
        step: 5,
        withdrawalHash: withdrawalSubmit,
      }
    }
  }
  return false
}
