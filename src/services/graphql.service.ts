import {
  ApolloClient,
  DocumentNode,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { NetworkType } from 'util/network/network.util'
import networkService from './networkService'
import { BigNumberish } from 'ethers'
import { NetworkDetailChainConfig } from '../util/network/config/network-details.types'
import {
  DepositState,
  WithdrawProcessStep,
  WithdrawState,
} from './anchorage.service'

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

export type GQPWithdrawalInitiatedEvent = {
  id: string
  to: string
  from: string
  contractId_: string
  timestamp_: string
  block_number: string
  transactionHash_: string
  l1Token: string
  l2Token: string
  amount: string
  extraData: string
}

export type GQL2ToL1MessagePassedEvent = {
  id: string
  block_number: string
  timestamp_: string
  transactionHash_: string
  contractId_: string
  nonce: string
  sender: string
  target: string
  value: string
  gasLimit: string
  data: string
  withdrawalHash: string
}

export type GQLWithdrawalFinalizedEvent = {
  id: string
  block_number: string
  timestamp_: string
  transactionHash_: string
  contractId_: string
  withdrawalHash: string
  success: string
}

export type GQLWithdrawalProvenEvent = {
  id: string
  block_number: string
  timestamp_: string
  transactionHash_: string
  withdrawalHash: string
  contractId_: string
  from: string
  to: string
}

export type GQLDepositFinalizedEvent = {
  id: string
  block_number: string
  timestamp_: number
  transactionHash_: string
  contractId_: string
  l1Token: string
  l2Token: string
  from: string
  to: string
  amount: string
  extraData: string
  __typename: DepositState
}
//#endregion

enum EGraphQLService {
  AnchorageBridge = 1,
  LightBridge = 2,
  DAO = 3,
}

class GraphQLService {
  GRAPHQL_ENDPOINTS = {
    // Boba ETH
    288: {
      [EGraphQLService.DAO]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/dao-boba-eth/v1/gn',
        local: '',
      },
    },
    // Boba BNB
    56288: {
      [EGraphQLService.LightBridge]: {
        gql: '', // TODO
        local: '',
      },
    },
    // TODO: Add other mainnets
    // Goerli
    5: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-goerli/v1/gn',
        local: '',
      },
      [EGraphQLService.DAO]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/dao-boba-goerli/v1/gn',
        local: '',
      },
    },
    // BNB testnet
    97: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-chapel/v1/gn',
        local: '',
      },
    },
    // Boba Goerli
    2888: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-boba-goerli/v1/gn',
        local: 'http://127.0.0.1:8000/subgraphs/name/boba/Bridges',
      },
    },
    // Boba BNB testnet
    9728: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-boba-bnb-testnet/v1/gn',
        local: 'http://127.0.0.1:8002/subgraphs/name/boba/Bridges',
      },
    },
    // Arbitrum Goerli
    421613: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-arbitrum-goerli/v1/gn',
        local: '',
      },
    },
    // Optimism Goerli
    420: {
      [EGraphQLService.LightBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-optimism-goerli/v1/gn',
        local: '',
      },
    },
    // Sepolia
    11155111: {
      [EGraphQLService.AnchorageBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/anchorage-bridging-sepolia/v1/gn',
      },
    },
    // Boba Sepolia
    28882: {
      [EGraphQLService.AnchorageBridge]: {
        gql: 'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/anchorage-bridging-boba-sepolia/v1/gn',
      },
    },
  }

  getBridgeEndpoint = (chainId, service: EGraphQLService, useLocal = false) => {
    return this.GRAPHQL_ENDPOINTS[chainId][service][useLocal ? 'local' : 'gql']
  }

  async conductQuery(
    query: DocumentNode,
    variables = {},
    sourceChainId: BigNumberish,
    service: EGraphQLService,
    useLocalGraphEndpoint = false
  ) {
    const uri = this.getBridgeEndpoint(
      sourceChainId,
      service,
      useLocalGraphEndpoint
    )
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
      `query {
          proposalCreateds{
            idParam
            values
            description
            proposer
         }
      }`
    )

    return this.conductQuery(
      query,
      undefined,
      sourceChainId,
      EGraphQLService.DAO
    )
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
      await this.conductQuery(
        query,
        variables,
        sourceChainId,
        EGraphQLService.LightBridge,
        this.useLocal
      )
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
      await this.conductQuery(
        query,
        variables,
        destChainId,
        EGraphQLService.LightBridge,
        this.useLocal
      )
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
      await this.conductQuery(
        query,
        variables,
        destChainId,
        EGraphQLService.LightBridge,
        this.useLocal
      )
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
      await this.conductQuery(
        query,
        variables,
        destChainId,
        EGraphQLService.LightBridge,
        this.useLocal
      )
    )?.data?.disbursementRetrySuccesses
    if (events?.length) {
      return events[0] // just first (should always just be one)
    }
    return undefined
  }
}

class AnchorageGraphQLService extends GraphQLService {
  async findWithdrawalsProven(
    withdrawalHashes: string[]
  ): Promise<GQLWithdrawalProvenEvent[]> {
    try {
      const qry = gql`
        query getWithdrawalProven($withdrawalHash: [String!]!) {
          withdrawalProvens(where: { withdrawalHash_in: $withdrawalHash }) {
            id
            block_number
            timestamp_
            transactionHash_
            contractId_
            from
            to
          }
        }
      `
      return (
        await this.conductQuery(
          qry,
          { withdrawalHash: withdrawalHashes },
          28882,
          EGraphQLService.AnchorageBridge
        )
      )?.data.withdrawalProvens
    } catch (e) {
      console.log('Error while fetching: PROVEN')
      return []
    }
  }

  async findWithdrawalsFinalized(
    withdrawalHashes: string[]
  ): Promise<GQLWithdrawalFinalizedEvent[]> {
    try {
      const graphqlQuery = gql`
        query getWithdrawalsFinalized($withdrawalHash: [String!]!) {
          withdrawalFinalizeds(where: { withdrawalHash_in: $withdrawalHash }) {
            id
            block_number
            timestamp_
            transactionHash_
            contractId_
            withdrawalHash
            success
          }
        }
      `
      return (
        await this.conductQuery(
          graphqlQuery,
          { withdrawalHash: withdrawalHashes },
          28882,
          EGraphQLService.AnchorageBridge
        )
      )?.data.withdrawalFinalizeds
    } catch (e) {
      return []
    }
  }

  async findWithdrawalsInitiated(
    address: string
  ): Promise<GQPWithdrawalInitiatedEvent[]> {
    try {
      const qry = gql`
        query GetWithdrawalInitiateds($address: String!) {
          withdrawalInitiateds(where: { from: $address }) {
            id
            to
            from
            contractId_
            timestamp_
            transactionHash_
            block_number
            l1Token
            l2Token
            amount
            extraData
          }
        }
      `
      return (
        await this.conductQuery(
          qry,
          { address: address.toLowerCase() },
          28882,
          EGraphQLService.AnchorageBridge
        )
      )?.data.withdrawalInitiateds
    } catch (e) {
      return []
    }
  }

  async findWithdrawalMessagedPassed(): Promise<GQL2ToL1MessagePassedEvent[]> {
    try {
      const qry = gql`
        query GetWithdrawalInitiateds($withdrawalHash: String!) {
          messagePasseds(where: { withdrawalHash: $withdrawalHash }) {
            id
            block_number
            timestamp_
            transactionHash_
            contractId_
            nonce
            sender
            target
            value
            gasLimit
            data
            withdrawalHash
          }
        }
      `
      return (
        await this.conductQuery(qry, {}, 28882, EGraphQLService.AnchorageBridge)
      )?.data.messagePasseds
    } catch (e) {
      return []
    }
  }

  async findWithdrawalMessagesPassed(
    blockNumbers: string[]
  ): Promise<GQL2ToL1MessagePassedEvent[]> {
    try {
      const qry = gql`
        query getMessagePasseds($blockNumbers: [String!]!) {
          messagePasseds(where: { block_number_in: $blockNumbers }) {
            id
            block_number
            timestamp_
            transactionHash_
            contractId_
            nonce
            sender
            target
            value
            gasLimit
            data
            withdrawalHash
          }
        }
      `
      return (
        await this.conductQuery(
          qry,
          { blockNumbers },
          28882,
          EGraphQLService.AnchorageBridge
        )
      )?.data.messagePasseds
    } catch (e) {
      return []
    }
  }

  async queryDepositTransactions(
    address: string,
    networkConfig: NetworkDetailChainConfig
  ) {
    try {
      const graphqlQuery = gql`
        query GetDepositsFinalized($address: String!) {
          depositFinalizeds(where: { from: $address }) {
            id
            to
            from
            contractId_
            timestamp_
            transactionHash_
            block_number
            l1Token
            l2Token
            amount
            extraData
          }
        }
      `
      const depositsFinalized: GQLDepositFinalizedEvent[] = (
        await this.conductQuery(
          graphqlQuery,
          {
            address: address.toLowerCase(),
          },
          28882,
          EGraphQLService.AnchorageBridge
        )
      )?.data.depositFinalizeds

      return Promise.all(
        depositsFinalized.map((event) => {
          return this.mapDepositToTransaction(
            networkService.L2Provider,
            networkConfig,
            event,
            'status'
          )
        })
      )
    } catch (e) {
      return []
    }
  }

  async mapDepositToTransaction(
    provider,
    networkConfig: NetworkDetailChainConfig,
    event: GQLDepositFinalizedEvent,
    status: any
  ) {
    const isTokenDeposit = (token) => {
      return token !== '0x0000000000000000000000000000000000000000'
    }
    const transaction = await provider!.getTransaction(event.transactionHash_)
    const block = await provider!.getBlock(transaction.blockHash)

    return {
      timeStamp: block.timestamp,
      layer: 'l2',
      chainName: networkConfig.L1.name,
      originChainId: networkConfig.L1.chainId,
      destinationChainId: networkConfig.L2.chainId,
      UserFacingStatus: status,
      contractAddress: event.contractId_,
      hash: event.transactionHash_,
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
      from: event.from,
      to: event.to,
      action: {
        amount: event.amount,
        sender: event.from,
        status: 'succeeded',
        to: event.to,
        token: isTokenDeposit(event.l1Token) ? event.l1Token : null,
      },
      isTeleportation: false,
    }
  }

  async mapWithdrawalToTransaction(
    service,
    networkConfig: NetworkDetailChainConfig,
    event: any,
    status: WithdrawState
  ) {
    const provider =
      status !== WithdrawState.initialized
        ? service.L1Provider
        : service.L2Provider

    const transaction = await provider!.getTransaction(event.transactionHash_)
    const block = await provider!.getBlock(transaction.blockNumber)

    return {
      timeStamp: block.timestamp,
      layer: 'l2',
      chainName: networkConfig.L2.name,
      originChainId: networkConfig.L2.chainId,
      destinationChainId: networkConfig.L1?.chainId,
      UserFacingStatus: status,
      contractAddress: event.contractId_,
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
      from: event.from,
      to: event.to,
      action: {
        amount: event.value,
        sender: event.from,
        status: status === WithdrawState.finalized ? 'succeeded' : status,
        to: event.to,
        token: event.l1Token,
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
              withdrawalHash: event.withdrawalHash,
              blockNumber: event.blockNumber,
              blockHash: event.blockHash,
            },
    }
  }

  async queryWithdrawalTransactionsHistory(
    address,
    networkConfig: NetworkDetailChainConfig
  ) {
    const withdrawalsInitiated = await this.findWithdrawalsInitiated(address)
    const messagesPassed = await this.findWithdrawalMessagesPassed(
      withdrawalsInitiated.map((wI) => wI.block_number)
    )
    const withdrawalHashes = messagesPassed.map((mP) => mP.withdrawalHash)
    const provenWithdrawals = await this.findWithdrawalsProven(withdrawalHashes)
    const finalizedWithdrawals =
      await this.findWithdrawalsFinalized(withdrawalHashes)
    const withdrawalTransactions: any[] = []
    for (const withdrawalHashCandidate of withdrawalHashes) {
      const provenEvent = provenWithdrawals.find(
        (e) => e!.withdrawalHash === withdrawalHashCandidate
      )
      if (provenEvent) {
        const finalizedEvent = finalizedWithdrawals.find(
          (e) => e!.withdrawalHash === withdrawalHashCandidate
        )
        if (finalizedEvent) {
          withdrawalTransactions.push(
            await this.mapWithdrawalToTransaction(
              networkService,
              networkConfig,
              finalizedEvent,
              WithdrawState.finalized
            )
          )
        } else {
          withdrawalTransactions.push(
            await this.mapWithdrawalToTransaction(
              networkService,
              networkConfig,
              provenEvent,
              WithdrawState.proven
            )
          )
        }
      } else {
        withdrawalTransactions.push(
          await this.mapWithdrawalToTransaction(
            networkService,
            networkConfig,
            messagesPassed.find(
              (message) => message.withdrawalHash === withdrawalHashCandidate
            ),
            WithdrawState.initialized
          )
        )
      }
    }

    return withdrawalTransactions
  }

  findWithdrawHashesFromLogs(
    bridgeLogsArr: GQPWithdrawalInitiatedEvent[],
    l2tol1Logs: GQL2ToL1MessagePassedEvent[]
  ) {
    const transactionHashSet = new Set(
      bridgeLogsArr.map((obj) => obj.transactionHash_)
    )
    return l2tol1Logs.filter((obj) =>
      transactionHashSet.has(obj.transactionHash_)
    )
  }
}

const graphQLService = new GraphQLService()
const lightBridgeGraphQLService = new TeleportationGraphQLService()
const anchorageGraphQLService = new AnchorageGraphQLService()

export { graphQLService, lightBridgeGraphQLService, anchorageGraphQLService }
