const L2BillingContractABI = [
  'function collectFee() nonpayable',
  'function exitFee() view returns (uint256)',
  'function feeTokenAddress() view returns (address)',
  'function initialize(address _feeTokenAddress, address _l2FeeWallet, uint256 _exitFee) nonpayable',
  'function l2FeeWallet() view returns (address)',
  'function owner() view returns (address)',
  'function transferOwnership(address _newOwner) nonpayable',
  'function updateExitFee(uint256 _exitFee) nonpayable',
  'function withdraw() nonpayable',
]
export default L2BillingContractABI
