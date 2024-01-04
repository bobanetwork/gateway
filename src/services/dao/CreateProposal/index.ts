import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { utils } from 'ethers'

export const CreateProposal = async (payload) => {
  if (
    networkService.L1orL2 !== 'L2' ||
    !networkService.delegateContract ||
    !walletService.account
  ) {
    return
  }

  let signatures = ['']
  let value1 = 0
  let value2 = 0
  let value3 = 0
  let description = ''
  let address = ['']
  let callData = ['']
  // FIXME: Ve DAO From here
  /*
        let tokenIds = payload.tokenIds
        // create proposal only on latest contracts.
        const delegateCheck = await this.delegateContract.attach(this.addresses.GovernorBravoDelegatorV2)
  
      */
  // FIXME: Ve DAO Till here

  const delegateCheck = await networkService.delegateContract.attach(
    networkService.addresses.GovernorBravoDelegator
  )

  if (payload.action === 'text-proposal') {
    address = ['0x000000000000000000000000000000000000dEaD']
    description = payload.text.slice(0, 252) //100+150+2
    callData = [
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    ]
  } else if (payload.action === 'change-lp1-fee') {
    signatures = ['configureFeeExits(uint256,uint256,uint256)']
    value1 = Number(payload.value[0])
    value2 = Number(payload.value[1])
    value3 = Number(payload.value[2])
    description = `Change L1 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
    address = [networkService.addresses.L2LPAddress]
    callData = [
      utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'uint256'],
        [value1, value2, value3]
      ),
    ]
  } else if (payload.action === 'change-lp2-fee') {
    address = [delegateCheck.address]
    signatures = ['configureFee(uint256,uint256,uint256)']
    value1 = Number(payload.value[0])
    value2 = Number(payload.value[1])
    value3 = Number(payload.value[2])
    description = `Change L2 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
    address = [networkService.addresses.L2LPAddress]
    callData = [
      utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'uint256'],
        [value1, value2, value3]
      ),
    ]
  } else if (payload.action === 'change-threshold') {
    address = [delegateCheck.address]
    signatures = ['_setProposalThreshold(uint256)']
    value1 = Number(payload.value[0])
    description = `Change Proposal Threshold to ${value1} BOBA`
    callData = [utils.defaultAbiCoder.encode(['uint256'], [value1])]
  }

  try {
    const values = [0] //amount of ETH to send, generally, zero
    return await delegateCheck
      .connect(walletService.provider!.getSigner())
      .propose(address, values, signatures, callData, description)
  } catch (error) {
    console.log('NS: createProposal error:', error)
    return error
  }
}
