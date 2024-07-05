import { BigNumber } from 'ethers'
import {
  amountToUsd,
  formatLargeNumber,
  logAmount,
  powAmount,
  toWei_String,
} from './amountConvert'

describe('logAmount', () => {
  it('should correctly calculate the amount with power and without truncation', () => {
    const amount = BigNumber.from(1000)
    const power = 2
    const result = logAmount(amount, power)
    expect(result).toBe('10')
  })

  it('should correctly calculate the amount with power and with truncation', () => {
    const amount = BigNumber.from(1234)
    const power = 2
    const truncate = 1
    const result = logAmount(amount, power, truncate)
    expect(result).toBe('12.3')
  })

  it('should handle amount as a string', () => {
    const amount = '5000'
    const power = 3
    const result = logAmount(amount, power)
    expect(result).toBe('5')
  })

  it('should handle zero amount correctly', () => {
    const amount = BigNumber.from(0)
    const power = 2
    const result = logAmount(amount, power)
    expect(result).toBe('0')
  })

  it('should return the correct value when truncate is zero', () => {
    const amount = BigNumber.from(999)
    const power = 2
    const truncate = 0
    const result = logAmount(amount, power, truncate)
    expect(result).toBe('9.99')
  })

  it('should return the correct value when truncate is greater than zero', () => {
    const amount = BigNumber.from(999)
    const power = 2
    const truncate = 3
    const result = logAmount(amount, power, truncate)
    expect(result).toBe('9.990')
  })
})

describe('powAmount', () => {
  test('should correctly calculate the power amount', () => {
    expect(powAmount(2, 3)).toBe('2000')
    expect(powAmount(5, 2)).toBe('500')
    expect(powAmount(0, 5)).toBe('0')
    expect(powAmount(1, 0)).toBe('1')
  })

  test('should handle large numbers correctly', () => {
    expect(powAmount(123456789, 8)).toBe('12345678900000000')
    expect(powAmount(1.23456789, 10)).toBe('12345678900')
  })

  test('should handle decimal amounts correctly', () => {
    expect(powAmount(1.5, 2)).toBe('150')
    expect(powAmount(0.5, 3)).toBe('500')
  })
})

describe('toWei_String', () => {
  test('should correctly convert to wei string', () => {
    expect(toWei_String(2, 3)).toBe('2000')
    expect(toWei_String(5, 2)).toBe('500')
    expect(toWei_String(0, 5)).toBe('0')
    expect(toWei_String(1, 0)).toBe('1')
  })

  test('should handle large numbers correctly', () => {
    expect(toWei_String(123456789, 8)).toBe('12345678900000000')
    expect(toWei_String(1.23456789, 10)).toBe('12345678900')
  })

  test('should handle decimal amounts correctly', () => {
    expect(toWei_String(1.5, 2)).toBe('150')
    expect(toWei_String(0.5, 3)).toBe('500')
  })
})

describe('formatLargeNumber', () => {
  it('should return "0" for input 0', () => {
    expect(formatLargeNumber(0)).toBe('0')
  })

  it('should format numbers less than 1000 correctly', () => {
    expect(formatLargeNumber(123)).toBe('123')
    expect(formatLargeNumber(999)).toBe('999')
  })

  it('should format numbers in thousands, millions, billions correctly', () => {
    expect(formatLargeNumber(1000)).toBe('1.00k')
    expect(formatLargeNumber(2500)).toBe('2.50k')
    expect(formatLargeNumber(999999)).toBe('1000.00k')
    expect(formatLargeNumber(1000000)).toBe('1.00M')
    expect(formatLargeNumber(2500000)).toBe('2.50M')
    expect(formatLargeNumber(999999999)).toBe('1000.00M')
    expect(formatLargeNumber(1000000000)).toBe('1.00B')
    expect(formatLargeNumber(2500000000)).toBe('2.50B')
    expect(formatLargeNumber(999999999999)).toBe('1000.00B')
  })

  it('should handle negative numbers correctly', () => {
    expect(formatLargeNumber(-123)).toBe('123')
    expect(formatLargeNumber(-1000)).toBe('1.00k')
    expect(formatLargeNumber(-2500000)).toBe('2.50M')
  })

  it('should handle very small numbers correctly', () => {
    expect(formatLargeNumber(0.001)).toBe('0.001')
    expect(formatLargeNumber(0.00025)).toBe('0.00025')
  })

  it('should handle NaN cases gracefully', () => {
    expect(formatLargeNumber(NaN)).toBe('0')
  })

  it('should handle Infinity cases gracefully', () => {
    expect(formatLargeNumber(Infinity)).toBe('0')
    expect(formatLargeNumber(-Infinity)).toBe('0')
  })
})

describe('amountToUsd', () => {
  const lookupPrice = {
    ethereum: { usd: 2000 },
    'boba-network': { usd: 1.5 },
    oolongswap: { usd: 0.05 },
    omisego: { usd: 3 },
    'usd-coin': { usd: 1 },
    binancecoin: { usd: 300 },
    eth: { usd: 2000 },
    usdc: { usd: 1 },
  }

  it('should convert amount to USD for ETH', () => {
    const amount = 2
    const token = { symbol: 'ETH' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(4000)
  })

  it('should convert amount to USD for BOBA', () => {
    const amount = 10
    const token = { symbol: 'BOBA' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(15)
  })

  it('should return 0 if token symbol is not found in lookupMap and lookupPrice', () => {
    const amount = 1
    const token = { symbol: 'UNKNOWN' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(0)
  })

  it('should return 0 if token symbol is not provided', () => {
    const amount = 1
    const token = {}
    expect(amountToUsd(amount, lookupPrice, token)).toBe(0)
  })

  it('should convert amount to USD for symbol found in lookupPrice but not in lookupMap', () => {
    const amount = 2
    const token = { symbol: 'ETH' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(4000)
  })

  it('should convert amount to USD for symbol found in both lookupMap and lookupPrice', () => {
    const amount = 3
    const token = { symbol: 'USDC' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(3)
  })

  it('should convert amount to USD for symbol case-insensitive match in lookupPrice', () => {
    const amount = 1.5
    const token = { symbol: 'usdc' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(1.5)
  })

  it('should convert amount to USD for token using provider in lookupPrice', () => {
    const amount = 0.5
    const token = { symbol: 'BNB' }
    expect(amountToUsd(amount, lookupPrice, token)).toBe(150)
  })

  it('should handle amount with decimals correctly', () => {
    const amount = 1.123
    const token = { symbol: 'ETH' }
    expect(amountToUsd(amount, lookupPrice, token)).toBeCloseTo(2246, 2)
  })
})
