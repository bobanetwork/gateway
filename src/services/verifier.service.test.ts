import verifierService from './verifier.service'
import networkService from './networkService'

jest.mock('./networkService', () => {
  return {
    networkConfig: {
      L1: {
        chainId: 1,
      },
    },
  }
})

describe('VerifierService', () => {
  const vsInstance = verifierService
  let spyLog: any
  afterEach(() => {
    jest.restoreAllMocks()
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    spyLog = jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

  test('fetch verifier status when watcher instance undefined', async () => {
    // test
    const status = await vsInstance.getVerifierStatus()
    expect(status).toBeFalsy()
  })

  // TODO: Reactivate test that is failing due to a CORS issue
  test.skip('fetch verifier status when watcher instance defined', async () => {
    // prep
    networkService.networkConfig!.VERIFIER_WATCHER_URL =
      'https://api-verifier.mainnet.boba.network/'
    // test
    const status = await vsInstance.getVerifierStatus()
    expect(status?.isOK).toBeTruthy()
    expect(status?.matchedBlock).toBeDefined()
    expect(status?.matchedRoot).toBeDefined()
    expect(status?.timestamp).toBeGreaterThan(0)
  })
})
