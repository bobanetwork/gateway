const GovernorBravoDelegateABI = [
  'function _setProposalThreshold(uint256 newProposalThreshold)',
  'function boba() view returns (address)',
  'function castVote(uint256 proposalId, uint8 support)',
  'function execute(uint256 proposalId) payable',
  'function getActions(uint256 proposalId) view returns (address[] targets, uint256[] values, string[] signatures, bytes[] calldatas)',
  'function initialize(address timelock_, address bobaToken_, address xbobaToken_, uint256 votingPeriod_, uint256 votingDelay_, uint256 proposalThreshold_)',
  'function name() view returns (string)',
  'function proposalCount() view returns (uint256)',
  'function proposalThreshold() view returns (uint256)',
  'function proposals(uint256) view returns (uint256 id, address proposer, uint256 eta, string description, uint256 startBlock, uint256 startTimestamp, uint256 endTimestamp, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool canceled, bool executed)',
  'function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) returns (uint256)',
  'function queue(uint256 proposalId)',
  'function state(uint256 proposalId) view returns (uint8)',
]
export default GovernorBravoDelegateABI
