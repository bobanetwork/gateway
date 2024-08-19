import { BigNumber, constants, Contract, utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import {
  L1ERC20ABI,
  L1StandardBridgeABI,
  L2OutputOracleABI,
  L2StandardBridgeABIAnchorage,
  L2StandardERC20ABI,
  L2ToL1MessagePasserABI,
  OptimismPortalABI,
} from 'services/abi'
import { L2ToL1MessagePasserAddress } from 'services/app.service'
import networkService from 'services/networkService'
import { ERROR_CODE } from 'util/constant'

interface IDepositErc20 {
  recipient?: string
  amount: string
  currency: string
  currencyL2: string
}

interface IDepositErc20Optimism {
  recipient?: string
  amount: string
  currency: string
}

interface IDepositNative {
  recipient?: null | string
  amount: string
}

export class BridgeService {
  async anchorageDepositNative({ recipient, amount }: IDepositNative) {
    try {
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`${ERROR_CODE} invalid optimism portal address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found`)
      }

      const optimismContract = new Contract(
        networkService.addresses.OptimismPortalProxy,
        OptimismPortalABI,
        networkService.L1Provider
      )

      let depositTx: any

      if (recipient) {
        depositTx = await optimismContract
          .connect(signer!)
          .depositTransaction(recipient, 0, 100000, false, [], {
            value: amount,
          })
      } else {
        depositTx = await signer!.sendTransaction({
          to: optimismContract.address,
          value: amount,
        })
      }

      const txResponse = await depositTx.wait()

      return txResponse
    } catch (error) {
      console.log(`BS: deposit native`, error)
      return error
    }
  }

  async anchorageDepositERC20({
    recipient,
    amount,
    currency,
    currencyL2,
  }: IDepositErc20) {
    try {
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      const l1StdBridgeAddress = networkService.addresses.L1StandardBridgeProxy

      if (!l1StdBridgeAddress) {
        throw new Error(`${ERROR_CODE} invalid L1StandardBridge address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found!`)
      }

      const bobaL1Contract = new Contract(
        networkService.tokenAddresses!.BOBA?.L1,
        L1ERC20ABI,
        networkService.L1Provider
      )

      const bobaTokenContract = bobaL1Contract!.attach(currency)
      const bobaL1Balance = await bobaTokenContract.balanceOf(
        networkService.account
      )

      if (bobaL1Balance.lt(amount)) {
        throw new Error(`${ERROR_CODE} insufficient L1 token balance`)
      }

      const allowance_BN = await bobaTokenContract.allowance(
        networkService.account,
        l1StdBridgeAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(amount))

      if (!allowed) {
        const L1ApproveTx = await bobaTokenContract
          .connect(signer!)
          .approve(l1StdBridgeAddress, amount)
        await L1ApproveTx.wait()
      }

      let depositTx: any

      const l1StandardBridgeContract = new Contract(
        l1StdBridgeAddress,
        L1StandardBridgeABI,
        networkService.L1Provider
      )

      const signedContract = l1StandardBridgeContract!.connect(signer)

      if (recipient) {
        depositTx = await signedContract.depositERC20To(
          currency,
          currencyL2,
          recipient,
          amount,
          999999,
          '0x'
        )
      } else {
        depositTx = await signedContract.depositERC20(
          currency,
          currencyL2,
          amount,
          999999,
          '0x'
        )
      }

      const depositReceipt = await depositTx.wait()

      console.log(`✔ Deposit ${formatEther(amount)} tokens to L2`)
      return depositReceipt
    } catch (error) {
      console.log(`BS: deposit ERC20`, error)
      return error
    }
  }

  async anchorageDepositERC20Optimism({
    recipient,
    amount,
    currency,
  }: IDepositErc20Optimism) {
    try {
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      const opContractAddress = networkService.addresses.OptimismPortalProxy

      if (!opContractAddress) {
        throw new Error(`${ERROR_CODE} invalid optimismPortalProxy address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found`)
      }

      const bobaL1Contract = new Contract(
        networkService.tokenAddresses!.BOBA?.L1,
        L1ERC20ABI,
        networkService.L1Provider
      )

      const bobaTokenContract = bobaL1Contract!.attach(currency!)
      const bobaL1Balance = await bobaTokenContract.balanceOf(
        networkService.account
      )

      if (bobaL1Balance.lt(amount)) {
        throw new Error(`${ERROR_CODE} insufficient L1 token balance`)
      }

      const allowance_BN = await bobaTokenContract.allowance(
        networkService.account,
        opContractAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(amount))

      if (!allowed) {
        const L1ApproveTx = await bobaTokenContract
          .connect(signer!)
          .approve(opContractAddress, amount)
        await L1ApproveTx.wait()
      }

      let depositTx: any

      const optimismContract = new Contract(
        opContractAddress,
        OptimismPortalABI,
        networkService.L1Provider
      )

      if (recipient) {
        console.log(`deposit BOBA to `, recipient, amount)
        depositTx = await optimismContract
          .connect(signer!)
          .depositERC20Transaction(recipient, 0, amount, 100000, false, [])
      } else {
        depositTx = await optimismContract
          .connect(signer!)
          .depositERC20Transaction(
            networkService.account,
            amount,
            0,
            100000,
            false,
            []
          )
      }

      const depositReceipt = await depositTx.wait()

      console.log(`✔ Deposited ${formatEther(amount)} tokens to L2`)
      return depositReceipt
    } catch (error) {
      console.log(`BS: deposit ERC20`, error)
      return error
    }
  }

  async anchorageWithdrawNativeToken({
    amount,
    isActiveNetworkBnb = false,
  }: {
    amount: string
    isActiveNetworkBnb?: boolean
  }) {
    try {
      const signer = networkService.provider?.getSigner()

      let initWithdraw

      if (!isActiveNetworkBnb) {
        if (!networkService.addresses.L2StandardBridgeAddress) {
          throw new Error(`${ERROR_CODE} L2StandardBridge invalid address!`)
        }

        initWithdraw = await signer!.sendTransaction({
          to: networkService.addresses.L2StandardBridgeAddress, // L2StandardBridge
          value: amount,
        })
      } else {
        // withdrawing BOBA for bnb
        const contract = new Contract(
          L2ToL1MessagePasserAddress, /// it's predeployed contract
          L2ToL1MessagePasserABI,
          signer
        )

        initWithdraw = await contract.initiateWithdrawal(
          networkService.account,
          100000,
          [],
          { value: amount }
        )
      }

      const receipt = await initWithdraw.wait()
      return receipt.blockNumber
    } catch (error) {
      console.log(`Anchorage native withdrawal failed`, error)
      return error
    }
  }

  async anchorageWithdrawErc20Token({ amount, token }) {
    try {
      if (!networkService.addresses.L2StandardBridgeAddress) {
        throw new Error(`${ERROR_CODE} L2StandardBridge invalid address!`)
      }

      const signer = networkService.provider!.getSigner()

      const tokenContract = new Contract(token, L2StandardERC20ABI, signer)

      const allowance = await tokenContract.allowance(
        signer.getAddress(),
        networkService.addresses.L2StandardBridgeAddress
      )

      if (allowance.toString() < amount) {
        const approveTx = await tokenContract!.approve(
          networkService.addresses.L2StandardBridgeAddress,
          amount
        )
        await approveTx.wait()
      }

      const L2StdBridgeContract = new Contract(
        networkService.addresses.L2StandardBridgeAddress,
        L2StandardBridgeABIAnchorage,
        networkService.provider?.getSigner()
      )

      const initWithdraw = await L2StdBridgeContract.withdraw(
        token,
        amount,
        30000,
        '0x'
      )

      const receipt = await initWithdraw.wait()

      return receipt.blockNumber
    } catch (error) {
      console.log(`anchorage erc20 withdrawal failed`, error)
      return error
    }
  }

  async prooveTransactionWithdrawal({ txInfo }) {
    try {
      if (!networkService.addresses.L2OutputOracleProxy) {
        throw new Error(`${ERROR_CODE} L2OutputOracle invalid address!`)
      }

      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      }

      const L2ToL1MessagePasserContract = new Contract(
        L2ToL1MessagePasserAddress,
        L2ToL1MessagePasserABI,
        networkService.L2Provider
      )

      let logs: Array<any> = await L2ToL1MessagePasserContract.queryFilter(
        L2ToL1MessagePasserContract.filters.MessagePassed(),
        txInfo.blockNumber,
        txInfo.blockNumber
      )

      if (txInfo.withdrawalHash) {
        logs = logs.filter(
          (b) => b!.args.withdrawalHash === txInfo.withdrawalHash
        )
      }

      if (!logs || logs.length === 0 || !logs[0]) {
        throw new Error(`${ERROR_CODE} No L2ToL1MessagePasser logs`)
      }

      const types = [
        'uint256',
        'address',
        'address',
        'uint256',
        'uint256',
        'bytes',
      ]

      const encoded = utils.defaultAbiCoder.encode(types, [
        logs[0].args.nonce,
        logs[0].args.sender,
        logs[0].args.target,
        logs[0].args.value,
        logs[0].args.gasLimit,
        logs[0].args.data,
      ])

      const slot = utils.keccak256(encoded)

      const withdrawalHash = logs[0].args.withdrawalHash

      if (withdrawalHash !== slot) {
        throw new Error(`Withdrawal hash does not match`)
      }

      const messageSlot = utils.keccak256(
        utils.defaultAbiCoder.encode(
          ['bytes32', 'uint256'],
          [slot, constants.HashZero]
        )
      )

      const l2OutputOracleContract = new Contract(
        networkService.addresses.L2OutputOracleProxy,
        L2OutputOracleABI,
        networkService.L1Provider
      )

      // LOOPING TO CHECK THE LATEST BLOCK NUMBER.
      let latestBlockOnL1 = await l2OutputOracleContract.latestBlockNumber()
      while (latestBlockOnL1 < txInfo.blockNumber) {
        await new Promise((resolve) => setTimeout(resolve, 12000))
        latestBlockOnL1 = await l2OutputOracleContract.latestBlockNumber()
      }

      const l2OutputIndex = await l2OutputOracleContract.getL2OutputIndexAfter(
        txInfo.blockNumber
      )
      const proposal = await l2OutputOracleContract.getL2Output(l2OutputIndex)
      const proposalBlockNumber = proposal.l2BlockNumber
      const proposalBlock = await networkService.L2Provider!.send(
        'eth_getBlockByNumber',
        [proposalBlockNumber.toNumber(), false]
      )

      console.log('requesting proof', proposalBlock, messageSlot)
      const proof = await networkService.L2Provider!.send('eth_getProof', [
        L2ToL1MessagePasserAddress,
        [messageSlot],
        proposalBlock.number, // reading hex block number.
      ])

      const signer = networkService.provider!.getSigner()

      const optimismPortalContract = new Contract(
        networkService.addresses.OptimismPortalProxy,
        OptimismPortalABI,
        signer
      )

      const proveTx = await optimismPortalContract.proveWithdrawalTransaction(
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
          constants.HashZero,
          proposalBlock.stateRoot,
          proof.storageHash,
          proposalBlock.hash,
        ],
        proof.storageProof[0].proof
      )
      console.log(`waiting for prove tx!!`)
      const txReceipt = await proveTx.wait()
      console.log(`txReceipt`, txReceipt)
      return logs
    } catch (error) {
      console.log(`Err: proveWithdrwal`, error)
      return error
    }
  }

  // can be usable to show the value of gas on UI
  async estimateGasFinalWithdrawal({ logs }) {
    try {
      if (!logs.length || !logs[0]) {
        throw new Error(`${ERROR_CODE} invalid logs passed!`)
      }
      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      }

      const optimismPortalContract = new Contract(
        networkService.addresses.OptimismPortalProxy,
        OptimismPortalABI,
        networkService.L1Provider
      )

      const gas =
        await optimismPortalContract.estimateGas.finalizeWithdrawalTransaction([
          logs[0].nonce,
          logs[0].sender,
          logs[0].target,
          logs[0].value,
          logs[0].gasLimit,
          logs[0].data,
        ])
      console.log(`estimated gas`, gas, logs)
      return gas
    } catch (error) {
      console.log(`Err estimateGasFinalWithdrawal`, error)
      return error
    }
  }

  async finalizeTransactionWithdrawal({ logs }: { logs: any[] }) {
    try {
      if (!logs.length || !logs[0]) {
        throw new Error(`${ERROR_CODE} invalid logs passed!`)
      }
      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      }

      const signer = networkService.provider!.getSigner()

      const optimismPortalContract = new Contract(
        networkService.addresses.OptimismPortalProxy,
        OptimismPortalABI,
        signer
      )

      const finalSubmitTx =
        await optimismPortalContract.finalizeWithdrawalTransaction([
          logs[0].nonce,
          logs[0].sender,
          logs[0].target,
          logs[0].value,
          logs[0].gasLimit,
          logs[0].data,
        ])

      return finalSubmitTx.wait()
    } catch (error) {
      console.log(`Err: ClaimWithdrawal`, error)
      return error
    }
  }
}

export const bridgeService = new BridgeService()
