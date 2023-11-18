const L2StandardBridgeABI = [
  'constructor(address _l2CrossDomainMessenger, address _l1TokenBridge)',
  'event DepositFailed(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
  'event DepositFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
  'event WithdrawalInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
  'function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _data)',
  'function l1TokenBridge() view returns (address)',
  'function messenger() view returns (address)',
  'function withdraw(address _l2Token, uint256 _amount, uint32 _l1Gas, bytes _data)',
  'function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _l1Gas, bytes _data)',
]
export default L2StandardBridgeABI
