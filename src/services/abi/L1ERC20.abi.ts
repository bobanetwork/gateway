const L1ERC20ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) nonpayable returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) nonpayable returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) nonpayable returns (bool)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address recipient, uint256 amount) nonpayable returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) nonpayable returns (bool)',
]
export default L1ERC20ABI
