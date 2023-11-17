const OVM_GasPriceOracleABI = [
  'function decimals() view returns (uint256)',
  'function gasPrice() view returns (uint256)',
  'function getExtraL2Gas(bytes _data) view returns (uint256)',
  'function getL1Fee(bytes _data) view returns (uint256)',
  'function getL1GasUsed(bytes _data) view returns (uint256)',
  'function l1BaseFee() view returns (uint256)',
  'function overhead() view returns (uint256)',
  'function owner() view returns (address)',
  'function renounceOwnership() nonpayable',
  'function scalar() view returns (uint256)',
  'function setDecimals(uint256 _decimals) nonpayable',
  'function setGasPrice(uint256 _gasPrice) nonpayable',
  'function setL1BaseFee(uint256 _baseFee) nonpayable',
  'function setOverhead(uint256 _overhead) nonpayable',
  'function setScalar(uint256 _scalar) nonpayable',
  'function transferOwnership(address newOwner) nonpayable',
]
export default OVM_GasPriceOracleABI
