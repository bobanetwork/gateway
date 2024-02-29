import { filterLatestGroupedSupportedTokens } from '../graphql.utils'

describe('GraphQL Utils', () => {
  it('should return the latest supported events only', () => {
    const testData = [
      { id: 1, token: '0x0', block_number: 1, supported: true },

      { id: 2, token: '0x1', block_number: 2, supported: false },
      { id: 3, token: '0x1', block_number: 3, supported: true },
      { id: 4, token: '0x1', block_number: 4, supported: false },
      { id: 5, token: '0x1', block_number: 5, supported: true },

      { id: 6, token: '0x2', block_number: 6, supported: false },
      { id: 7, token: '0x2', block_number: 7, supported: true },
      { id: 8, token: '0x2', block_number: 8, supported: false },

      { id: 9, token: '0x3', block_number: 9, supported: true },
      { id: 10, token: '0x3', block_number: 10, supported: false },
    ]

    const result = filterLatestGroupedSupportedTokens(testData)

    const Token0 = result.find((t) => t.token === '0x0')
    const Token1 = result.find((t) => t.token === '0x1')
    const Token2 = result.find((t) => t.token === '0x2')
    const Token3 = result.find((t) => t.token === '0x3')

    expect(result.length).toEqual(2)
    expect(Token0.supported).toEqual(true)
    expect(Token1.supported).toEqual(true)
    expect(Token2).toBeUndefined()
    expect(Token3).toBeUndefined()
  })
})
