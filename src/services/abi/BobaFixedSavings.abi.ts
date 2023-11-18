const BobaFixedSavingsABI = [
  'function initialize(address l2BobaAddress, address xBobaAddress)',
  'function l2Boba() view returns (address)',
  'function owner() view returns (address)',
  'function personalStakeCount(address) view returns (uint256)',
  'function personalStakePos(address, uint256) view returns (uint256)',
  'function stake(uint256 _amount)',
  'function stakeDataMap(uint256) view returns (uint256 stakeId, address account, uint256 depositAmount, uint256 depositTimestamp, bool isActive)',
  'function unstake(uint256 stakeId)',
  'function xBoba() view returns (address)',
]
export default BobaFixedSavingsABI
