import {
  ApolloClient,
  DocumentNode,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { NetworkType } from 'util/network/network.util'
import networkService from './networkService'
import { BigNumber, BigNumberish, Event } from 'ethers'
import { NetworkDetailChainConfig } from '../util/network/config/network-details.types'
import {
  DepositState,
  WithdrawProcessStep,
  WithdrawState,
} from '../containers/modals/MultiStepWithdrawalModal/withdrawal'

//#region types
export type LightBridgeDisbursementEvents =
  | LightBridgeDisbursementSuccessEvent
  | LightBridgeDisbursementFailedEvent
  | LightBridgeDisbursementRetrySuccessEvent
export type LightBridgeAssetReceivedEvent = {
  __typename: 'TeleportationAssetReceivedEvent'
  token: string
  sourceChainId: string
  toChainId: string
  depositId: string
  emitter: string
  amount: BigNumberish
  transactionHash_: string
  block_number: string
  timestamp_: string
}

export type LightBridgeDisbursementSuccessEvent = {
  __typename: 'TeleportationDisbursementSuccessEvent'
  depositId: string
  to: string
  token: string
  amount: BigNumberish
  sourceChainId: string
  transactionHash_: string
  block_number: string
  timestamp_: string
}

export type LightBridgeDisbursementFailedEvent = {
  __typename: 'TeleportationDisbursementFailedEvent'
  depositId: string
  to: string
  amount: BigNumberish
  sourceChainId: string
  transactionHash_: string
  block_number: string
  timestamp_: string
}

export type LightBridgeDisbursementRetrySuccessEvent = {
  __typename: 'TeleportationDisbursementRetrySuccessEvent'
  depositId: string
  to: string
  amount: BigNumberish
  sourceChainId: string
  transactionHash_: string
  block_number: string
  timestamp_: string
}
//#endregion

class GraphQLService {
  GRAPHQL_ENDPOINTS = {
    // Boba ETH
    288: {
      gql: '', // TODO
      local: '',
    },
    // Boba BNB
    56288: {
      gql: '', // TODO
      local: '',
    },
    // Goerli
    5: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-goerli/v1/gn',
      local: '',
    },
    // BNB testnet
    97: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-chapel/v1/gn',
      local: '',
    },
    // Boba Goerli
    2888: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-boba-goerli/v1/gn',
      local: 'http://127.0.0.1:8000/subgraphs/name/boba/Bridges',
    },
    // Boba BNB testnet
    9728: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-boba-bnb-testnet/v1/gn',
      local: 'http://127.0.0.1:8002/subgraphs/name/boba/Bridges',
    },
    // Arbitrum Goerli
    421613: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-arbitrum-goerli/v1/gn',
      local: '',
    },
    // Optimism Goerli
    420: {
      gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-optimism-goerli/v1/gn',
      local: '',
    },
  }

  getBridgeEndpoint = (chainId, useLocal = false) => {
    return this.GRAPHQL_ENDPOINTS[chainId][useLocal ? 'local' : 'gql']
  }

  async conductQuery(
    query: DocumentNode,
    variables = {},
    sourceChainId: BigNumberish,
    useLocalGraphEndpoint = false
  ) {
    const uri = this.getBridgeEndpoint(sourceChainId, useLocalGraphEndpoint)
    if (!uri) {
      return
    }
    const client = new ApolloClient({
      uri,
      link: new HttpLink({
        uri,
        fetch,
      }),
      cache: new InMemoryCache(),
    })

    return client.query({
      query,
      variables,
    })
  }

  async queryBridgeProposalCreated({ sourceChainId }) {
    const query = gql(
      `query { governorProposalCreateds { proposalId values description proposer } }`
    )

    /*
    curl -g -X POST \
    -H "Content-Type: application/json" \
    -d '{"query":"{ governorProposalCreateds {proposalId values description proposer}}"}' \
    https://graph.goerli.boba.network/subgraphs/name/boba/Bridges

    curl -g -X POST \
    -H "Content-Type: application/json" \
    -d '{"query":"{ governorProposalCreateds {proposalId values description proposer}}"}' \
    https://api.thegraph.com/subgraphs/name/bobanetwork/boba-l2-subgraph

    */

    if (NetworkType.TESTNET === networkService.networkType) {
      // As there is no subgraph node for goerli L2 disable it.
      return {
        data: { governorProposalCreateds: [] },
      }
    }

    return this.conductQuery(query, undefined, sourceChainId)
  }
}

class TeleportationGraphQLService extends GraphQLService {
  useLocal = false

  async queryAssetReceivedEvent(
    walletAddress: string,
    sourceChainId: BigNumberish
  ): Promise<LightBridgeAssetReceivedEvent[]> {
    const query =
      gql(`query Teleportation($wallet: String!, $sourceChainId: BigInt!) {
  assetReceiveds(
    where: {and: [{emitter_contains_nocase: $wallet}, { sourceChainId: $sourceChainId }]}
  ) {
    token
    sourceChainId
    toChainId
    depositId
    emitter
    amount
    block_number
    timestamp_
    transactionHash_
  }
}`)

    const variables = {
      wallet: walletAddress,
      sourceChainId: sourceChainId.toString(),
    }

    return (
      await this.conductQuery(query, variables, sourceChainId, this.useLocal)
    )?.data?.assetReceiveds
  }

  async queryDisbursementSuccessEvent(
    walletAddress: string,
    sourceChainId: BigNumberish,
    destChainId: BigNumberish,
    token: string,
    amount: BigNumberish,
    depositId: BigNumberish
  ): Promise<LightBridgeDisbursementSuccessEvent | undefined> {
    if (!token) {
      return undefined
    }
    const query =
      gql(`query Teleportation($wallet: String!, $sourceChainId: BigInt!, $token: String!, $amount: String!, $depositId: String!) {
  disbursementSuccesses(
    where: { and: [{ to_contains_nocase: $wallet }, { sourceChainId: $sourceChainId }, { token_contains_nocase: $token }, { amount: $amount }, { depositId: $depositId }] }
  ) {
    depositId
    to
    token
    amount
    sourceChainId
    block_number
    timestamp_
    transactionHash_
  }
}
`)

    const variables = {
      wallet: walletAddress,
      sourceChainId: sourceChainId.toString(),
      token,
      amount: amount.toString(),
      depositId: depositId.toString(),
    }
    const events = (
      await this.conductQuery(query, variables, destChainId, this.useLocal)
    )?.data?.disbursementSuccesses
    if (events?.length) {
      return events[0] // just first (should always just be one)
    }
    return undefined
  }

  async queryDisbursementFailedEvent(
    walletAddress: string,
    sourceChainId: BigNumberish,
    destChainId: BigNumberish,
    amount: BigNumberish,
    depositId: BigNumberish
  ) {
    const query =
      gql(`query Teleportation($wallet: String!, $sourceChainId: BigInt!, $amount: String!, $depositId: String!) {
  disbursementFaileds(
    where: { and: [{ to_contains_nocase: $wallet }, { sourceChainId: $sourceChainId }, { amount: $amount }, { depositId: $depositId }] }
  ) {
    depositId
    to
    amount
    sourceChainId
    block_number
    timestamp_
    transactionHash_
  }
}
`)

    const variables = {
      wallet: walletAddress,
      sourceChainId: sourceChainId.toString(),
      amount: amount.toString(),
      depositId: depositId.toString(),
    }
    const events = (
      await this.conductQuery(query, variables, destChainId, this.useLocal)
    )?.data?.disbursementFaileds
    if (events?.length) {
      if (events.length > 1) {
        console.warn(
          'Found more than one disbursementFailedEvent, should always be 1:',
          events
        )
      }
      return events[0] // just first (should always just be one)
    }
    return undefined
  }

  async queryDisbursementRetrySuccessEvent(
    walletAddress: string,
    sourceChainId: BigNumberish,
    destChainId: BigNumberish,
    amount: BigNumberish,
    depositId: BigNumberish
  ) {
    const query =
      gql(`query Teleportation($wallet: String!, $sourceChainId: BigInt!, $amount: String!, $depositId: String!) {
  disbursementRetrySuccesses(
    where: { and: [{ to_contains_nocase: $wallet }, { sourceChainId: $sourceChainId }, { amount: $amount }, { depositId: $depositId }] }
  ) {
    depositId
    to
    amount
    sourceChainId
    block_number
    timestamp_
    transactionHash_
  }
}
`)

    const variables = {
      wallet: walletAddress,
      sourceChainId: sourceChainId.toString(),
      amount: amount.toString(),
      depositId: depositId.toString(),
    }
    const events = (
      await this.conductQuery(query, variables, destChainId, this.useLocal)
    )?.data?.disbursementRetrySuccesses
    if (events?.length) {
      return events[0] // just first (should always just be one)
    }
    return undefined
  }
}

class AnchorageGraphQLService extends GraphQLService {
  // will be replaced with goldsky
  async getBlockRange() {
    try {
      const avgBlockTime = 15
      const timeBackInSeconds = 750_000
      const latestBlock = await networkService.provider?.getBlockNumber()
      return [
        latestBlock! - Math.floor(timeBackInSeconds / avgBlockTime),
        latestBlock,
      ]
    } catch (e) {
      return [undefined, undefined]
    }
  }

  async findWithdrawalsProven() {
    try {
      const range = await this.getBlockRange()
      return networkService.OptimismPortal!.queryFilter(
        networkService.OptimismPortal!.filters.WithdrawalProven(),
        range[0],
        range[1]
      )
    } catch (e) {
      return []
    }
  }

  async findWithdrawalsFinalized() {
    try {
      const range = await this.getBlockRange()
      return networkService.OptimismPortal!.queryFilter(
        networkService.OptimismPortal!.filters.WithdrawalFinalized(),
        range[0],
        range[1]
      )
    } catch (e) {
      return []
    }
  }

  async findWithdrawalsInitiated(address: string) {
    try {
      return (
        await networkService.L2StandardBridgeContract!.queryFilter(
          networkService.L2StandardBridgeContract!.filters.WithdrawalInitiated(),
          undefined,
          undefined
        )
      ).filter((entry) => {
        return entry.args?.from === address
      })
    } catch (e) {
      return []
    }
  }

  async findWithdrawalMessagesPassed(fromBlock?: number, toBlock?: number) {
    try {
      return networkService.L2ToL1MessagePasser!.queryFilter(
        networkService.L2ToL1MessagePasser!.filters.MessagePassed(),
        fromBlock ?? undefined,
        toBlock ?? undefined
      )
    } catch (e) {
      return []
    }
  }

  async queryDepositTransactions(networkConfig: NetworkDetailChainConfig) {
    let eventsDepositFinalized: any[] = []
    try {
      eventsDepositFinalized =
        await networkService.L2StandardBridgeContract!.queryFilter(
          (
            networkService.L2StandardBridgeContract!.filters as any
          ).DepositFinalized(),
          undefined,
          undefined
        )
    } catch (e) {
      return eventsDepositFinalized
    }

    const events = [...eventsDepositFinalized]

    return Promise.all(
      events.map((event) => {
        return this.mapDepositToTransaction(
          networkService,
          networkConfig,
          event,
          'status'
        )
      })
    )
  }

  findWithdrawHashesFromLogs(bridgeLogsArr, l2tol1Logs) {
    const transactionHashSet = new Set(
      bridgeLogsArr.map((obj) => obj.transactionHash)
    )
    return l2tol1Logs.filter((obj) =>
      transactionHashSet.has(obj.transactionHash)
    )
  }

  async mapDepositToTransaction(
    service,
    networkConfig: NetworkDetailChainConfig,
    event: Event,
    status: any
  ) {
    let provider
    switch (event.event) {
      case DepositState.deposited: {
        provider = service.L1Provider
        break
      }
      case DepositState.finalized: {
        provider = service.L2Provider
        break
      }
      default: {
        return []
      }
    }

    const block = await provider!.getBlock(event.blockHash)
    const transaction = await provider!.getTransaction(event.transactionHash)
    const isNativeTransaction = transaction?.value?.gt(0)
    const action = {
      amount: isNativeTransaction
        ? transaction?.value?.toString()
        : event.args?.amount?.toString(),
      sender: isNativeTransaction ? event.args?.sender : event.args?.from,
      status: 'succeeded',
      to: isNativeTransaction ? event.args!.target : event.args!.to,
      token: isNativeTransaction ? null : event.args!.l1Token,
    }

    return {
      timeStamp: block.timestamp,
      layer: 'l1',
      chainName: networkConfig.L1.name,
      originChainId: networkConfig.L1.chainId,
      destinationChainId: networkConfig.L2.chainId,
      UserFacingStatus: status,
      contractAddress: event.address,
      hash: transaction.hash,
      crossDomainMessage: {
        crossDomainMessage: 1,
        crossDomainMessageEstimateFinalizedTime: 180,
        crossDomainMessageFinalize: 1,
        crossDomainMessageSendTime: 100,
        fromHash: '0x0',
        toHash: undefined,
        fast: 1,
      },
      contractName: '-',
      from: event.args!.from,
      to: event.args!.to,
      action,
      isTeleportation: false,
    }
  }

  async mapWithdrawalToTransaction(
    service,
    networkConfig: NetworkDetailChainConfig,
    event: Event,
    status: WithdrawState,
    value?: BigNumber
  ) {
    const provider =
      status !== WithdrawState.initialized
        ? service.L1Provider
        : service.L2Provider

    const block = await provider!.getBlock(event.blockHash)
    const transaction = await provider!.getTransaction(event.transactionHash)

    return {
      timeStamp: block.timestamp,
      layer: 'l2',
      chainName: networkConfig.L2.name,
      originChainId: networkConfig.L2.chainId,
      destinationChainId: networkConfig.L1?.chainId,
      UserFacingStatus: status,
      contractAddress: event.address,
      hash: transaction.hash,
      crossDomainMessage: {
        crossDomainMessage: 1,
        crossDomainMessageEstimateFinalizedTime: 180,
        crossDomainMessageFinalize: 1,
        crossDomainMessageSendTime: 100,
        fromHash: '0x0',
        toHash: undefined,
        fast: 1,
      },
      contractName: '-',
      from: event.args!.from,
      to: event.args!.to,
      action: {
        amount: value?.toString() ?? '0',
        sender: event.args?.sender,
        status: status === WithdrawState.finalized ? 'succeeded' : status,
        to: event.args!.target,
        token: event.args!.value ? 'native' : 'find token',
      },
      isTeleportation: false,
      actionRequired:
        status === WithdrawState.finalized
          ? null
          : {
              type: 'reenterWithdraw',
              state: status,
              step:
                status === WithdrawState.initialized
                  ? WithdrawProcessStep.Initialized
                  : WithdrawProcessStep.Proven,
              withdrawalHash: event.args!.withdrawalHash,
              blockNumber: event.blockNumber,
              blockHash: event.blockHash,
            },
    }
  }

  async queryWithdrawalTransactionsHistory(
    address,
    networkConfig: NetworkDetailChainConfig
  ) {
    const [
      withdrawalsInitiatedEvents,
      messagePassedEvents,
      withdrawalsProvenEvents,
      withdrawalsFinalizedEvents,
    ] = await Promise.all([
      this.findWithdrawalsInitiated(address),
      this.findWithdrawalMessagesPassed(),
      this.findWithdrawalsProven(),
      this.findWithdrawalsFinalized(),
    ])
    const result: {
      initialized: any[]
      proven: any[]
      finalized: any[]
    } = {
      initialized: [],
      proven: [],
      finalized: [],
    }
    for (const entry of withdrawalsInitiatedEvents) {
      const blockHash = entry.blockHash
      if (messagePassedEvents.find((e) => e.blockHash === blockHash)) {
        const withdrawHashIndex = messagePassedEvents.findIndex(
          (e) => e.blockHash === blockHash
        )
        const initializeEvent: Event = messagePassedEvents[withdrawHashIndex]
        const provenEvent = withdrawalsProvenEvents.find(
          (e) => e.args!.withdrawalHash === initializeEvent.args!.withdrawalHash
        )
        if (provenEvent) {
          const finalizedEvent = withdrawalsFinalizedEvents.find(
            (e) =>
              e.args!.withdrawalHash === initializeEvent.args!.withdrawalHash
          )
          if (finalizedEvent) {
            result.finalized.push(
              await this.mapWithdrawalToTransaction(
                networkService,
                networkConfig,
                finalizedEvent,
                WithdrawState.finalized,
                initializeEvent.args?.value
              )
            )
          } else {
            result.proven.push(
              await this.mapWithdrawalToTransaction(
                networkService,
                networkConfig,
                provenEvent,
                WithdrawState.proven,
                initializeEvent.args?.value
              )
            )
          }
        } else {
          result.initialized.push(
            await this.mapWithdrawalToTransaction(
              networkService,
              networkConfig,
              initializeEvent,
              WithdrawState.initialized,
              initializeEvent.args?.value
            )
          )
        }
      }
    }
    return [...result.finalized, ...result.proven, ...result.initialized]
  }
}

const graphQLService = new GraphQLService()
const lightBridgeGraphQLService = new TeleportationGraphQLService()
const anchorageGraphQLService = new AnchorageGraphQLService()

export { graphQLService, lightBridgeGraphQLService, anchorageGraphQLService }
