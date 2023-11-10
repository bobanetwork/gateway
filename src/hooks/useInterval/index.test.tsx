import { renderHook } from '@testing-library/react-hooks'
import useInterval from './'

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should call the callback function with the specified interval', () => {
    const callback = jest.fn()
    const delay = 1000

    renderHook(() => useInterval(callback, delay))

    jest.advanceTimersByTime(delay)

    expect(callback).toHaveBeenCalled()
  })

  it('should change the interval when delay changes', () => {
    const callback = jest.fn()
    let delay = 1000
    const { rerender } = renderHook(() => useInterval(callback, delay))

    jest.advanceTimersByTime(delay)
    expect(callback).toHaveBeenCalled()

    delay = 2000
    rerender()

    jest.advanceTimersByTime(delay)
    expect(callback).toHaveBeenCalled()
  })
})
