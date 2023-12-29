import { ethers } from 'ethers'
import networkService from '../../../services/networkService'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'

export const handleInitiateWithdrawal = async (amount: string) => {
  const signer = await networkService.provider?.getSigner()
  if (!signer) {
    return { error: 'No signer' }
  }
  const initWithdraw = await signer!.sendTransaction({
    to: '0x4200000000000000000000000000000000000010', // L2StandardBridge TODO outsource
    value: amount,
  })
  const receipt = await initWithdraw.wait()
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

export const handleProveWithdrawal = async (txInfo: any) => {
  if (
    !networkService.OptimismPortal ||
    !networkService.L2ToL1MessagePasser ||
    !networkService.L2OutputOracle
  ) {
    return { error: 'OptimismPortal / L2ToL1MessagePasser not initialized!' }
  }

  const logs = await networkService.L2ToL1MessagePasser.queryFilter(
    networkService.L2ToL1MessagePasser.filters.MessagePassed(),
    txInfo.withdrawalHash.blockNumber, // todo adapt
    txInfo.withdrawalHash.blockNumber // todo adapt
  )

  if (!logs || logs.length !== 1 || !logs[0].args) {
    return { error: 'length not 1' }
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

  const proof = await networkService.L2Provider!.send('eth_getProof', [
    '0x4200000000000000000000000000000000000016', // todo adapt
    [messageSlot],
    txInfo.withdrawalHash.blockNumber,
  ])
  const l2OutputIndex =
    await networkService.L2OutputOracle.getL2OutputIndexAfter(
      txInfo.withdrawalHash.blockNumber
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
