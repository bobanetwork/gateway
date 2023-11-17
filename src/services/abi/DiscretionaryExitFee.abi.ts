const DiscretionaryExitFeeABI = [
  'function billingContractAddress() view returns (address)',
  'function configureBillingContractAddress(address _billingContractAddress) nonpayable',
  'function l2Bridge() view returns (address)',
  'function owner() view returns (address)',
  'function payAndWithdraw(address _l2Token, uint256 _amount, uint32 _l1Gas, bytes _data) payable',
  'function renounceOwnership() nonpayable',
  'function transferOwnership(address newOwner) nonpayable',
]
export default DiscretionaryExitFeeABI
