import {
  ApolloClient,
  DocumentNode,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { NetworkType } from 'util/network/network.util'
import networkService from './networkService'
import { BigNumberish, Event } from 'ethers'
import { NetworkDetailChainConfig } from '../util/network/config/network-details.types'

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

class BedrockGraphQLService extends GraphQLService {
  async findProvenWithdrawals() {
    return networkService.OptimismPortal!.queryFilter(
      networkService.OptimismPortal!.filters.WithdrawalProven(),
      undefined,
      undefined
    )
  }

  async findFinalizedWithdrawals() {
    return networkService.OptimismPortal!.queryFilter(
      networkService.OptimismPortal!.filters.WithdrawalFinalized(),
      undefined,
      undefined
    )
  }

  async latestL2InitWithdrawalLogs(address: string) {
    return (
      await networkService.L2StandardBridgeContract!.queryFilter(
        networkService.L2StandardBridgeContract!.filters.WithdrawalInitiated(),
        undefined,
        undefined
      )
    ).filter((entry) => entry.args?.from === address)
  }

  async latestL2ToL1MessagePassedLogs() {
    return networkService.L2ToL1MessagePasser!.queryFilter(
      networkService.L2ToL1MessagePasser!.filters.MessagePassed(),
      undefined,
      undefined
    )
  }

  async findWithdrawHashesFromLogs(bridgeLogsArr, l2tol1Logs) {
    const transactionHashSet = new Set(
      bridgeLogsArr.map((obj) => obj.transactionHash)
    )
    return l2tol1Logs.filter((obj) =>
      transactionHashSet.has(obj.transactionHash)
    )
  }

  async queryWithdrawalTransactions(
    address,
    networkConfig: NetworkDetailChainConfig
  ) {
    const [
      withdrawalsInitiatedEvents,
      messagePassedEvents,
      withdrawalsProvenEvents,
      withdrawalsFinalizedEvents,
    ] = await Promise.all([
      this.latestL2InitWithdrawalLogs(address),
      this.latestL2ToL1MessagePassedLogs(),
      this.findProvenWithdrawals(),
      this.findFinalizedWithdrawals(),
    ])
    const mapToTransaction = async (event, status) => {
      console.log('event is ', event)
      console.log('provider is: ', networkService.provider)
      const block = await networkService.provider!.getBlock(event.blockHash)
      const transaction = await networkService.provider!.getTransaction(
        event.transactionHash
      )
      return {
        timeStamp: block.timestamp,
        layer: 'l2',
        chainName: networkConfig.L2.name,
        originChainId: networkConfig.L2.chainId,
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
        action: {
          amount: event.args!.value.toString(),
          sender: event.args!.sender,
          status: status === 'finalized' ? 'succeeded' : status,
          to: event.args!.target,
          token: event.args!.value ? 'native' : 'find token',
        },
        isTeleportation: false,
        actionRequired:
          status === 'finalized'
            ? null
            : {
                type: 'reenterWithdraw',
                state: status,
                step:
                  status === 'initialized' ? 3 : status === 'proven' ? 4 : 5,
                withdrawalHash: event.args!.withdrawalHash,
                blockNumber: event.blockNumber,
              },
      }
    }
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
              await mapToTransaction(initializeEvent, 'finalized')
            )
          } else {
            result.proven.push(
              await mapToTransaction(initializeEvent, 'proven')
            )
          }
        } else {
          result.initialized.push(
            await mapToTransaction(initializeEvent, 'initialized')
          )
        }
      }
    }
    return [...result.finalized, ...result.proven, ...result.initialized]
  }
}

const graphQLService = new GraphQLService()
const lightBridgeGraphQLService = new TeleportationGraphQLService()
const bedrockGraphQLService = new BedrockGraphQLService()

export { graphQLService, lightBridgeGraphQLService, bedrockGraphQLService }
