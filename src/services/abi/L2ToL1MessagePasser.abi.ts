export const L2ToL1MessagePasserABI = [
  'function initiateWithdrawal(address _target, uint256 _gasLimit, bytes memory _data) public payable',
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
]
