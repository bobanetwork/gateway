const DiscretionaryExitFeeABI = [
  'constructor(address _l2Bridge)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'function billingContractAddress() view returns (address)',
  'function configureBillingContractAddress(address _billingContractAddress)',
  'function l2Bridge() view returns (address)',
  'function owner() view returns (address)',
  'function payAndWithdraw(address _l2Token, uint256 _amount, uint32 _l1Gas, bytes _data) payable',
  'function renounceOwnership()',
  'function transferOwnership(address newOwner)',
]
export default DiscretionaryExitFeeABI
