import { renderHook } from '@testing-library/react-hooks'
import { useSelector } from 'react-redux'
import useThirdPartyBridges from '.'
import { loadThirdPartyBridges } from 'services/data.service'
import { NetworkType } from 'util/network/network.util'

// Mock useSelector
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

// Mock loadThirdPartyBridges
jest.mock('services/data.service', () => ({
  loadThirdPartyBridges: jest.fn(),
}))

describe('useThirdPartyBridges', () => {
  beforeEach(() => {
    ;(useSelector as jest.Mock).mockReturnValue(NetworkType.MAINNET) // Set the default network type for testing
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return loading true while fetching data', async () => {
    ;(loadThirdPartyBridges as jest.Mock).mockResolvedValueOnce({ data: null })

    const { result, waitForNextUpdate } = renderHook(() =>
      useThirdPartyBridges()
    )

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate() // Wait for useEffect to complete

    expect(result.current.loading).toBe(false)
  })

  it('should return bridges data when loaded successfully', async () => {
    const bridgesData = [
      {
        name: 'celer bridge',
      },
    ]
    ;(loadThirdPartyBridges as jest.Mock).mockResolvedValueOnce(bridgesData)

    const { result, waitForNextUpdate } = renderHook(() =>
      useThirdPartyBridges()
    )

    await waitForNextUpdate()

    expect(result.current.bridges).toEqual(bridgesData)
  })

  it('should return error when data loading fails', async () => {
    const errorMessage = 'Failed to load bridges'
    ;(loadThirdPartyBridges as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useThirdPartyBridges()
    )

    await waitForNextUpdate()

    expect(result.current.error).toBe(errorMessage)
  })

  it('should not load data if network type is TESTNET', () => {
    ;(useSelector as jest.Mock).mockReturnValueOnce(NetworkType.TESTNET)

    renderHook(() => useThirdPartyBridges())

    expect(loadThirdPartyBridges).not.toHaveBeenCalled()
  })

  it('should clean up when unmounting', async () => {
    const { result, unmount } = renderHook(() => useThirdPartyBridges())

    unmount()

    expect(result.current.bridges).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(true)
  })
})
