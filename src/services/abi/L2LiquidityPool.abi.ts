const L2LiquidityPoolABI = [
  'function DAO() view returns (address)',
  'function addLiquidity(uint256 _amount, address _tokenAddress) payable',
  'function clientDepositL2(uint256 _amount, address _tokenAddress) payable',
  'function configureFee(uint256 _userRewardMinFeeRate, uint256 _userRewardMaxFeeRate, uint256 _ownerRewardFeeRate)',
  'function configureFeeExits(uint256 _userRewardMinFeeRate, uint256 _userRewardMaxFeeRate, uint256 _ownerRewardFeeRate)',
  'function getUserRewardFeeRate(address _l2TokenAddress) view returns (uint256 userRewardFeeRate)',
  'function initialize(address _l2CrossDomainMessenger, address _L1LiquidityPoolAddress)',
  'function owner() view returns (address)',
  'function ownerRewardFeeRate() view returns (uint256)',
  'function poolInfo(address) view returns (address l1TokenAddress, address l2TokenAddress, uint256 userDepositAmount, uint256 lastAccUserReward, uint256 accUserReward, uint256 accUserRewardPerShare, uint256 accOwnerReward, uint256 startTime)',
  'function userInfo(address, address) view returns (uint256 amount, uint256 rewardDebt, uint256 pendingReward)',
  'function userRewardMaxFeeRate() view returns (uint256)',
  'function userRewardMinFeeRate() view returns (uint256)',
  'function withdrawLiquidity(uint256 _amount, address _tokenAddress, address _to)',
  'function withdrawReward(uint256 _amount, address _tokenAddress, address _to)',
]
export default L2LiquidityPoolABI
