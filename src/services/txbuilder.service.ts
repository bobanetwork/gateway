import { Contract } from 'ethers'

export class TxBuilderService {
  parseResult(resultPR, outputsPR) {
    const parseResultPR: any = []
    if (outputsPR.length === 1) {
      return resultPR.toString()
    }
    for (let i = 0; i < outputsPR.length; i++) {
      try {
        const output = outputsPR[i]
        const key = output.name ? output.name : output.type
        if (output.type.includes('uint')) {
          parseResultPR.push({ [key]: resultPR[i].toString() })
        } else {
          parseResultPR.push({ [key]: resultPR[i] })
        }
      } catch (err) {
        return 'Error: Failed to parse result'
      }
    }
    return JSON.stringify(parseResultPR)
  }

  async submitTxBuilder(
    contract: Contract,
    methodIndex: number,
    methodName: string,
    inputs: any
  ) {
    let parseInput: any = Object.values(inputs)
    let value = 0
    const stateMutability =
      contract.interface.functions[methodName].stateMutability
    const outputs = contract.interface.functions[methodName].outputs
    if (stateMutability === 'payable') {
      value = parseInput[parseInput.length - 1]
      parseInput = parseInput.slice(0, parseInput.length - 1)
    }

    let result
    try {
      if (stateMutability === 'view' || stateMutability === 'pure') {
        result = await contract[methodName](...parseInput)
        return {
          methodIndex,
          result: { result: this.parseResult(result, outputs), err: null },
        }
      } else if (stateMutability === 'payable') {
        console.log({ value }, ...parseInput)
        const tx = await contract[methodName](...parseInput, { value })
        return { methodIndex, result: { transactionHash: tx.hash, err: null } }
      } else {
        const tx = await contract[methodName](...parseInput)
        return { methodIndex, result: { transactionHash: tx.hash, err: null } }
      }
    } catch (err) {
      return { methodIndex, result: { err: JSON.stringify(err) } }
    }
  }
}

const txBuilderService = new TxBuilderService()
export default txBuilderService
