import { graphQLService, lightBridgeGraphQLService } from './graphql.service'
import { ApolloClient, gql } from '@apollo/client'

import networkService from './networkService'

jest.mock('@apollo/client', () => {
  const actualApollo = jest.requireActual('@apollo/client')
  // Mock de ApolloClient con una implementación específica para `query`
  return {
    ...actualApollo,
    ApolloClient: jest.fn(() => ({
      query: jest
        .fn()
        .mockImplementation(({ query, variables }) =>
          Promise.resolve({ data: 'mockData' })
        ),
    })),
    HttpLink: jest.fn(),
    InMemoryCache: jest.fn(() => ({})),
    gql: actualApollo.gql,
  }
})

jest.mock('./networkService', () => ({
  networkType: 'TESTNET',
}))

const GRAPHQL_ENDPOINTS = {
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

describe('GraphQLService', () => {
  test('getBridgeEndpoint should return light-bridge-goerli ', () => {
    const endpoint = graphQLService.getBridgeEndpoint(5, false)
    expect(endpoint).toBe(
      'https://api.goldsky.com/api/public/project_clq6jph4q9t2p01uja7p1f0c3/subgraphs/light-bridge-goerli/v1/gn'
    )
  })

  test('getBridgeEndpoint should return light-bridge-chapel', () => {
    const chain = 97
    const endpoint = graphQLService.getBridgeEndpoint(chain, false)
    expect(endpoint).toBe(GRAPHQL_ENDPOINTS[chain].gql)
  })
  test('getBridgeEndpoint should return light-bridge-boba-goerli', () => {
    const chain = 2888
    const endpoint = graphQLService.getBridgeEndpoint(chain, false)
    expect(endpoint).toBe(GRAPHQL_ENDPOINTS[chain].gql)
  })
  test('getBridgeEndpoint should return light-bridge-boba-bnb-testnet', () => {
    const chain = 9728
    const endpoint = graphQLService.getBridgeEndpoint(chain, false)
    expect(endpoint).toBe(GRAPHQL_ENDPOINTS[chain].gql)
  })
  test('getBridgeEndpoint should return Arbitrum Goerli', () => {
    const chain = 421613
    const endpoint = graphQLService.getBridgeEndpoint(chain, false)
    expect(endpoint).toBe(GRAPHQL_ENDPOINTS[chain].gql)
  })
  test('getBridgeEndpoint should return Optimism Goerli', () => {
    const chain = 420
    const endpoint = graphQLService.getBridgeEndpoint(chain, false)
    expect(endpoint).toBe(GRAPHQL_ENDPOINTS[chain].gql)
  })
})

//define data for test
const walletAddress = '0x123456789'
const sourceChainId = 5
const token = 'ETH'
const amount = '100'
const depositId = 1

const config = {
  walletAddress: '0x123456789',
  sourceChainId: 5,
  toChainId: '2888',
  token: 'ETH',
  amount: '100',
  depositId: 1,
  emitter: '',
  block_number: '',
  timestamp_: '',
  transactionHash_: '',
}
