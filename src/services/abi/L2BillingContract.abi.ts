const L2BillingContractABI = [
  'event CollectFee(address, uint256)',
  'event TransferOwnership(address, address)',
  'event UpdateExitFee(uint256)',
  'event Withdraw(address, uint256)',
  'function collectFee()',
  'function exitFee() view returns (uint256)',
  'function feeTokenAddress() view returns (address)',
  'function initialize(address _feeTokenAddress, address _l2FeeWallet, uint256 _exitFee)',
  'function l2FeeWallet() view returns (address)',
  'function owner() view returns (address)',
  'function transferOwnership(address _newOwner)',
  'function updateExitFee(uint256 _exitFee)',
  'function withdraw()',
]
export default L2BillingContractABI
