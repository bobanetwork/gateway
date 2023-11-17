const AuthenticatedFaucetABI = [
  'function apiUrl() view returns (string)',
  'function getNonce(address from) view returns (uint256)',
  'function sendFunds(address to_, string twitterPostID_) nonpayable',
  'function sendFundsMeta(address to_, string twitterPostID_, bytes32 hashedMessage_, bytes signature_) nonpayable',
  'function turingHelper() view returns (address)',
  'function verifyMessage(bytes32 _hashedMessage, bytes signature) pure returns (address)',
]
export default AuthenticatedFaucetABI
