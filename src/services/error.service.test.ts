import { WebWalletError } from './error.service'

describe('Error Services', () => {
  it('should construct an instance with custom error message', () => {
    const originalError = new Error('Original error message')
    const customErrorMessage = 'Custom error message'

    const webWalletError = new WebWalletError({
      originalError,
      customErrorMessage,
    })

    expect(webWalletError.message).toBe('Original error message')
    expect(webWalletError._originalError).toBe(originalError)
    expect(webWalletError._customErrorMessage).toBe(customErrorMessage)
  })

  it('should not report certain errors', () => {
    const originalError1 = new Error('user denied')
    const originalError2 = new Error('Some other error')
    const metamaskHeaderNotFoundCode = -3200

    const webWalletError1 = new WebWalletError({
      originalError: originalError1,
      customErrorMessage: 'Custom error message 1',
    })

    const webWalletError2 = new WebWalletError({
      originalError: originalError2,
      customErrorMessage: 'Custom error message 2',
    })

    expect(webWalletError1.report()).toBeUndefined()
    expect(webWalletError2.report()).toBeUndefined()

    const webWalletError3 = new WebWalletError({
      originalError: new Error('Another user denied error'),
      customErrorMessage: 'User denied error message',
    })

    const webWalletError4 = new WebWalletError({
      originalError: new Error('Metamask error'),
      customErrorMessage: 'Metamask error message',
    })

    expect(webWalletError3.report()).toBeUndefined()
    expect(webWalletError4.report()).toBeUndefined()
  })
})
