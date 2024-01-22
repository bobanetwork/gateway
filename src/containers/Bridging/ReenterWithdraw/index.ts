import networkService from '../../../services/networkService'
import { bedrockGraphQLService } from '../../../services/graphql.service'

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
    await bedrockGraphQLService.findWithdrawalsInitiated(address)
  const l2toL1Logs = await bedrockGraphQLService.findWithdrawalMessagesPassed()
  const withdrawalHashesLogs =
    await bedrockGraphQLService.findWithdrawHashesFromLogs(
      l2BridgeLogs,
      l2toL1Logs
    )
  const withdrawalsProven = await bedrockGraphQLService.findWithdrawalsProven()
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
    await bedrockGraphQLService.findWithdrawalsFinalized()
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
