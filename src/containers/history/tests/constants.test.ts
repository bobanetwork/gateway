import { Chains } from '../constants'
import { CHAIN_NAME } from '../types'

describe('Constants', () => {
  it('should contain correct chain configurations', () => {
    const sepoliaSUT = Chains['11155111']
    expect(sepoliaSUT.imgSrc).toBeDefined()
    expect(sepoliaSUT.name).toEqual(CHAIN_NAME.Sepolia)
    expect(sepoliaSUT.symbol).toEqual('ETH')
    expect(sepoliaSUT.transactionUrlPrefix).toBeDefined()

    const bobaSepoliaSUT = Chains['28882']
    expect(bobaSepoliaSUT.imgSrc).toBeDefined()
    expect(bobaSepoliaSUT.name).toEqual(CHAIN_NAME.Boba_Sepolia)
    expect(bobaSepoliaSUT.symbol).toEqual('ETH')
    expect(bobaSepoliaSUT.transactionUrlPrefix).toBeDefined()
  })
})
