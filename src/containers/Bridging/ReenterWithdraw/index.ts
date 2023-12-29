import networkService from '../../../services/networkService'

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

  const l2BridgeLogs = await latestL2BridgeLogs(address)
  const l2toL1Logs = await latestL2ToL1MessagePasseLogs()
  const withdrawalHashesLogs = await findWithdrawHashesFromLogs(
    l2BridgeLogs,
    l2toL1Logs
  )
  console.log('hi')
  const withdrawalsProven = await findProvenWithdrawals()
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
  const withdrawalsFinalized = await findFinalizedWithdrawals()
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

const findProvenWithdrawals = async () => {
  return networkService.OptimismPortal!.queryFilter(
    networkService.OptimismPortal!.filters.WithdrawalProven(),
    undefined,
    undefined
  )
}

const findFinalizedWithdrawals = async () => {
  return networkService.OptimismPortal!.queryFilter(
    networkService.OptimismPortal!.filters.WithdrawalFinalized(),
    undefined,
    undefined
  )
}
const latestL2BridgeLogs = async (address: string) => {
  return (
    await networkService.L2StandardBridgeContract!.queryFilter(
      networkService.L2StandardBridgeContract!.filters.WithdrawalInitiated(),
      undefined,
      undefined
    )
  ).filter((entry) => entry.args?.from === address)
}

const latestL2ToL1MessagePasseLogs = async () => {
  return networkService.L2ToL1MessagePasser!.queryFilter(
    networkService.L2ToL1MessagePasser!.filters.MessagePassed(),
    undefined,
    undefined
  )
}

const findWithdrawHashesFromLogs = (bridgeLogsArr, l2tol1Logs) => {
  const transactionHashSet = new Set(
    bridgeLogsArr.map((obj) => obj.transactionHash)
  )
  return l2tol1Logs.filter((obj) => transactionHashSet.has(obj.transactionHash))
}
