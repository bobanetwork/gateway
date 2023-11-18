const OVM_GasPriceOracleABI = [
  'function decimals() view returns (uint256)',
  'function gasPrice() view returns (uint256)',
  'function getL1Fee(bytes _data) view returns (uint256)',
  'function owner() view returns (address)',
]
export default OVM_GasPriceOracleABI
