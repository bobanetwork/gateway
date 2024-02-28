import { ethers } from 'ethers'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'
import { L2StandardERC20ABI } from './abi'
import networkService from './networkService'
import {
  anchorageGraphQLService,
  GQL2ToL1MessagePassedEvent,
} from './graphql.service'

export enum DepositState {
  deposited = 'TransactionDeposited',
  finalized = 'DepositFinalized',
}
export enum WithdrawProcessStep {
  'Initialized' = 3,
  'Proven' = 5,
}

export enum WithdrawState {
  initialized = 'initialized',
  proven = 'proven',
  finalized = 'finalized',
}

export interface IReenterWithdrawConfig {
  state: WithdrawState
  step: WithdrawProcessStep
  withdrawalHash: `${'0x'}${string}`
  blockHash: `${'0x'}${string}`
  blockNumber: number
}

export interface IHandleProveWithdrawalConfig {
  blockNumber: number
  withdrawalHash?: string
  blockHash?: string
}

export const approvalRequired = async (token, amount) => {
  if (
    !token ||
    token.address === networkService.addresses.NETWORK_NATIVE_TOKEN
  ) {
    return false
  }
  const tokenContract = new ethers.Contract(
    token.address,
    L2StandardERC20ABI,
    networkService.provider!.getSigner()
  )
  return (
    (
      await tokenContract.allowance(
        networkService.account,
        networkService.addresses.L2StandardBridgeAddress
      )
    ).toString() <= amount
  )
}

export const handleInitiateWithdrawal = async (amount: string, token?: any) => {
  try {
    const signer = networkService.provider?.getSigner()
    if (!signer) {
      return { error: 'No signer' }
    }
    let initWithdraw
    if (!token) {
      initWithdraw = await signer!.sendTransaction({
        to: networkService.addresses.L2StandardBridgeAddress, // L2StandardBridge
        value: amount,
      })
    } else {
      const tokenContract = new ethers.Contract(
        token.address,
        L2StandardERC20ABI,
        networkService.provider!.getSigner()
      )

      const allowance = await tokenContract.allowance(
        signer.getAddress(),
        networkService.addresses.L2StandardBridgeAddress
      )

      if (allowance.toString() < amount) {
        const approveTx = await tokenContract!.approve(
          networkService.addresses.L2StandardBridgeAddress, // todo L2StandardBridge CHECK AGAIN
          amount
        )
        await approveTx.wait()
      }

      initWithdraw = await networkService
        .L2StandardBridgeContract!.connect(signer)
        .withdraw(token.address, amount, 30000, '0x')
    }

    const receipt = await initWithdraw.wait()

    return receipt.blockNumber
  } catch (error) {
    console.log(`error handle initiate withdrawal`, error)
    return null
  }
}

export const handleProveWithdrawal = async (
  txInfo: IHandleProveWithdrawalConfig
) => {
  if (
    !networkService.OptimismPortal ||
    !networkService.L2ToL1MessagePasser ||
    !networkService.L2OutputOracle
  ) {
    return { error: 'OptimismPortal / L2ToL1MessagePasser not initialized!' }
  }

  let logs = await anchorageGraphQLService.findWithdrawalMessagesPassed([
    txInfo.blockNumber.toString(),
  ])

  if (txInfo.withdrawalHash) {
    logs = logs.filter((b) => b!.withdrawalHash === txInfo.withdrawalHash)
  }

  if (!logs || logs.length !== 1 || !logs[0]) {
    return Promise.reject({ error: 'length not 1' })
  }

  const types = ['uint256', 'address', 'address', 'uint256', 'uint256', 'bytes']
  const encoded = defaultAbiCoder.encode(types, [
    logs[0].nonce,
    logs[0].sender,
    logs[0].target,
    logs[0].value,
    logs[0].gasLimit,
    logs[0].data,
  ])

  const slot = keccak256(encoded)
  const withdrawalHash = logs[0].withdrawalHash
  if (withdrawalHash !== slot) {
    return { error: 'Widthdraw hash does not match' }
  }
  const messageSlot = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'uint256'],
      [slot, ethers.constants.HashZero]
    )
  )

  if (!networkService.provider) {
    return { error: 'Networkservice provider not set' }
  }

  const filter = txInfo.blockHash
    ? { blockHash: txInfo.blockHash }
    : { blockNumber: txInfo.blockNumber }

  console.log('requesting proof...')
  const proof = await networkService.L2Provider!.send('eth_getProof', [
    networkService.addresses.L2ToL1MessagePasser,
    [messageSlot],
    filter,
  ])

  console.log('proof requested!')

  // waiting period before claiming
  let latestBlockOnL1 = await networkService.L2OutputOracle.latestBlockNumber()
  while (latestBlockOnL1 < txInfo.blockNumber) {
    await new Promise((resolve) => setTimeout(resolve, 12000))
    latestBlockOnL1 = await networkService.L2OutputOracle.latestBlockNumber()
  }

  const l2OutputIndex =
    await networkService.L2OutputOracle.getL2OutputIndexAfter(
      txInfo.blockNumber
    )
  const proposal =
    await networkService.L2OutputOracle.getL2Output(l2OutputIndex)
  const proposalBlockNumber = proposal.l2BlockNumber
  const proposalBlock = await networkService.L2Provider!.send(
    'eth_getBlockByNumber',
    [proposalBlockNumber.toNumber(), false]
  )

  const signer = await networkService.provider?.getSigner()
  const proveTx = await networkService.OptimismPortal.connect(
    signer
  ).proveWithdrawalTransaction(
    [
      logs[0].nonce,
      logs[0].sender,
      logs[0].target,
      logs[0].value,
      logs[0].gasLimit,
      logs[0].data,
    ],
    l2OutputIndex,
    [
      ethers.constants.HashZero,
      proposalBlock.stateRoot,
      proof.storageHash,
      proposalBlock.hash,
    ],
    proof.storageProof[0].proof,
    {
      gasLimit: 7_000_000,
    }
  )
  await proveTx.wait()
  return logs
}

export const claimWithdrawal = async (logs: GQL2ToL1MessagePassedEvent[]) => {
  const gasEstimationFinalSubmit = async () => {
    if (!networkService.OptimismPortal || !logs[0]) {
      return { error: 'OptimismPortal not initialized' }
    }
    const gas =
      await networkService.OptimismPortal.estimateGas.finalizeWithdrawalTransaction(
        [
          logs[0].nonce,
          logs[0].sender,
          logs[0].target,
          logs[0].value,
          logs[0].gasLimit,
          logs[0].data,
        ]
      )
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(gas)
      }, 2000)
    )
  }

  while (true) {
    try {
      await gasEstimationFinalSubmit()
      break
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      console.warn(
        `Failed to get gas estimation for finalizeWithdrawalTransaction`
      )
    }
  }

  const finalSubmitTx = await networkService
    .OptimismPortal!.connect(networkService.provider!.getSigner())
    .finalizeWithdrawalTransaction([
      logs[0].nonce,
      logs[0].sender,
      logs[0].target,
      logs[0].value,
      logs[0].gasLimit,
      logs[0].data,
    ])
  return finalSubmitTx.wait()
}

export const checkBridgeWithdrawalReenter =
  async (): Promise<IReenterWithdrawConfig | null> => {
    return anchorageGraphQLService
      .queryWithdrawalTransactionsHistory(
        networkService.account,
        networkService.networkConfig!
      )
      .then((events: any) => {
        // we should skip all finalized events and only send the latest on bridge.
        const filterEvents = events.filter(
          (e: any) => e.UserFacingStatus !== WithdrawState.finalized
        )
        if (filterEvents?.length > 0 && filterEvents[0]?.actionRequired) {
          return filterEvents[0].actionRequired
        } else {
          return null
        }
      })
      .catch((error) => {
        console.log(`error while fetching history`, error)
        return null
      })
  }
