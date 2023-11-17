const L2StandardERC20ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) nonpayable returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function burn(address _from, uint256 _amount) nonpayable',
  'function decimals() view returns (uint8)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) nonpayable returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) nonpayable returns (bool)',
  'function l1Token() view returns (address)',
  'function l2Bridge() view returns (address)',
  'function mint(address _to, uint256 _amount) nonpayable',
  'function name() view returns (string)',
  'function supportsInterface(bytes4 _interfaceId) pure returns (bool)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address recipient, uint256 amount) nonpayable returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) nonpayable returns (bool)',
]
export default L2StandardERC20ABI
