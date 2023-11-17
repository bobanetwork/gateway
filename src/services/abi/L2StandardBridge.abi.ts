const L2StandardBridgeABI = [
  'function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _data) nonpayable',
  'function l1TokenBridge() view returns (address)',
  'function messenger() view returns (address)',
  'function withdraw(address _l2Token, uint256 _amount, uint32 _l1Gas, bytes _data) nonpayable',
  'function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _l1Gas, bytes _data) nonpayable',
]
export default L2StandardBridgeABI
