const GovernorBravoDelegatorABI = [
  'constructor(address timelock_, address bobaToken_, address xbobaToken_, address admin_, address implementation_, uint256 votingPeriod_, uint256 votingDelay_, uint256 proposalThreshold_)',
  'event NewAdmin(address oldAdmin, address newAdmin)',
  'event NewImplementation(address oldImplementation, address newImplementation)',
  'event NewPendingAdmin(address oldPendingAdmin, address newPendingAdmin)',
  'event ProposalCanceled(uint256 id)',
  'event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startTimestamp, uint256 endTimestamp, string description)',
  'event ProposalExecuted(uint256 id)',
  'event ProposalQueued(uint256 id, uint256 eta)',
  'event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold)',
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason)',
  'event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay)',
  'event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod)',
  'function _setImplementation(address implementation_)',
  'function admin() view returns (address)',
  'function implementation() view returns (address)',
  'function pendingAdmin() view returns (address)',
]
export default GovernorBravoDelegatorABI
