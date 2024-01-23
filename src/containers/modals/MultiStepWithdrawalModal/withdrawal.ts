import { ethers } from 'ethers'
import networkService from '../../../services/networkService'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'
import { L2StandardERC20ABI } from '../../../services/abi'
import { bedrockGraphQLService } from '../../../services/graphql.service'

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

export interface ReenterWithdrawConfig {
  state: WithdrawState
  step: WithdrawProcessStep
  withdrawalHash: `${'0x'}${string}`
  blockHash: `${'0x'}${string}`
  blockNumber: number
}

export interface HandleProveWithdrawalConfig {
  blockNumber: number
  withdrawalHash?: string
  blockHash?: string
}

export const approvalRequired = async (token, amount) => {
  if (
    !token ||
    token.address === '0x4200000000000000000000000000000000000006'
  ) {
    return false
  }
  const signer = await networkService.provider?.getSigner()
  const tokenContract = new ethers.Contract(
    token.address,
    L2StandardERC20ABI,
    networkService.provider!.getSigner()
  )
  return (
    (
      await tokenContract.allowance(
        signer!.getAddress(),
        '0x4200000000000000000000000000000000000010'
      )
    ).toString() <= amount
  )
}

export const handleInitiateWithdrawal = async (amount: string, token?: any) => {
  const signer = await networkService.provider?.getSigner()
  if (!signer) {
    return { error: 'No signer' }
  }

  let initWithdraw
  if (!token) {
    initWithdraw = await signer!.sendTransaction({
      to: '0x4200000000000000000000000000000000000010', // L2StandardBridge TODO outsource
      value: amount,
    })
  } else {
    const tokenContract = new ethers.Contract(
      token.address,
      L2StandardERC20ABI,
      networkService.provider!.getSigner()
    )

    // check prior, if already approved
    const allowance = await tokenContract.allowance(
      signer.getAddress(),
      '0x4200000000000000000000000000000000000010'
    )

    if (allowance.toString() < amount) {
      console.log('requesting approval...')
      const approveTx = await tokenContract!.approve(
        '0x4200000000000000000000000000000000000010', // L2StandardBridge TODO outsource
        amount
      )
      await approveTx.wait()
    }

    initWithdraw = await networkService
      .L2StandardBridgeContract!.connect(signer)
      .withdraw(token.address, amount, 30000, '0x')
  }

  const receipt = await initWithdraw.wait()
  console.log('init done! --> ', receipt)
  const L2BlockNumber = receipt.blockNumber
  let latestBlockOnL1 = await networkService.L2OutputOracle!.latestBlockNumber()
  while (latestBlockOnL1 < L2BlockNumber) {
    await new Promise((resolve) => setTimeout(resolve, 12000))
    latestBlockOnL1 = await networkService.L2OutputOracle!.latestBlockNumber()
    console.log(
      `Waiting for L2 block: ${L2BlockNumber} - Latest L2 block on L1: ${latestBlockOnL1}`
    )
  }

  console.log(
    'L2 Initial Withdrawal transaction sent and waiting period over',
    L2BlockNumber
  )
  return L2BlockNumber
}

export const handleProveWithdrawal = async (
  txInfo: HandleProveWithdrawalConfig
) => {
  console.log('received withdrawalConfig: ', txInfo)
  if (
    !networkService.OptimismPortal ||
    !networkService.L2ToL1MessagePasser ||
    !networkService.L2OutputOracle
  ) {
    return { error: 'OptimismPortal / L2ToL1MessagePasser not initialized!' }
  }

  console.log('txInfo: blop', txInfo)
  let logs = await bedrockGraphQLService.findWithdrawalMessagesPassed(
    txInfo.blockNumber,
    txInfo.blockNumber
  )

  console.log('before filtering: ', logs)
  if (txInfo.withdrawalHash) {
    console.log('found reenter, will filter for withdrawalhash')
    logs = logs.filter((b) => b.args!.withdrawalHash === txInfo.withdrawalHash)
  }

  if (!logs || logs.length !== 1 || !logs[0].args) {
    return Promise.reject({ error: 'length not 1' })
  }

  const types = ['uint256', 'address', 'address', 'uint256', 'uint256', 'bytes']
  const encoded = defaultAbiCoder.encode(types, [
    logs[0].args.nonce,
    logs[0].args.sender,
    logs[0].args.target,
    logs[0].args.value,
    logs[0].args.gasLimit,
    logs[0].args.data,
  ])

  const slot = keccak256(encoded)
  const withdrawalHash = logs[0].args.withdrawalHash
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

  console.log('--> Requesting proof now')

  const filter = txInfo.blockHash
    ? { blockHash: txInfo.blockHash }
    : { blockNumber: txInfo.blockNumber }

  const proof = await networkService.L2Provider!.send('eth_getProof', [
    '0x4200000000000000000000000000000000000016', // todo adapt
    [messageSlot],
    filter,
  ])
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

  const hash = keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'bytes32'],
      [
        ethers.constants.HashZero,
        proposalBlock.stateRoot,
        proof.storageHash,
        proposalBlock.hash,
      ]
    )
  )

  const signer = await networkService.provider?.getSigner()
  const proveTx = await networkService.OptimismPortal.connect(
    signer
  ).proveWithdrawalTransaction(
    [
      logs[0].args.nonce,
      logs[0].args.sender,
      logs[0].args.target,
      logs[0].args.value,
      logs[0].args.gasLimit,
      logs[0].args.data,
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

export const claimWithdrawal = async (logs) => {
  const gasEstimationFinalSubmit = async () => {
    if (!networkService.OptimismPortal || !logs[0]?.args) {
      return { error: 'OptimismPortal not initialized' }
    }
    const gas =
      await networkService.OptimismPortal.estimateGas.finalizeWithdrawalTransaction(
        [
          logs[0].args.nonce,
          logs[0].args.sender,
          logs[0].args.target,
          logs[0].args.value,
          logs[0].args.gasLimit,
          logs[0].args.data,
        ]
      )
    console.log(
      'Gas estimation for finalizeWithdrawalTransaction',
      gas.toString()
    )
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log('estimated gas for logs: ', logs)

  while (true) {
    try {
      await gasEstimationFinalSubmit()
      break
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      console.log(
        `Failed to get gas estimation for finalizeWithdrawalTransaction`
      )
    }
  }

  console.log('current network: ', await networkService.provider?.getNetwork())

  const finalSubmitTx = await networkService
    .OptimismPortal!.connect(networkService.provider!.getSigner())
    .finalizeWithdrawalTransaction([
      logs[0].args.nonce,
      logs[0].args.sender,
      logs[0].args.target,
      logs[0].args.value,
      logs[0].args.gasLimit,
      logs[0].args.data,
    ])
  const txFinal = await finalSubmitTx.wait()
  console.log(`Finalized withdrawal transaction!`)
  return txFinal
}
