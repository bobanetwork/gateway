const TeleportationABI = [
  'function initialize()',
  'function owner() view returns (address)',
  'function supportedTokens(address, uint32) view returns (bool supported, uint256 minDepositAmount, uint256 maxDepositAmount, uint256 maxTransferAmountPerDay, uint256 transferredAmount, uint256 transferTimestampCheckPoint)',
  'function teleportAsset(address _token, uint256 _amount, uint32 _toChainId) payable',
]
export default TeleportationABI
