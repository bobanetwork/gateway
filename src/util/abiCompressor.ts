/**
 * Script to prepare the human readable abi from the json.
 * based on the functions used out of the abi in network service.
 *
 * to prepare abi execute like
 * ```sh
 *  node ./util/abiCompressor.ts
 * ```
 *
 *
 */

import { ethers } from 'ethers'
import * as fs from 'fs'

const smart_contract_abi_paths = [
  './node_modules/@bobanetwork/core_contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json',
  './node_modules/@bobanetwork/core_contracts/artifacts/contracts/standards/L2StandardERC20.sol/L2StandardERC20.json',
  './node_modules/@bobanetwork/core_contracts/artifacts/contracts/L2/predeploys/OVM_GasPriceOracle.sol/OVM_GasPriceOracle.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/DiscretionaryExitFee.sol/DiscretionaryExitFee.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/LP/L1LiquidityPool.sol/L1LiquidityPool.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/Teleportation.sol/Teleportation.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/LP/L2LiquidityPool.sol/L2LiquidityPool.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/BobaFixedSavings.sol/BobaFixedSavings.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/DAO/governance-token/BOBA.sol/BOBA.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/DAO/governance/GovernorBravoDelegate.sol/GovernorBravoDelegate.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/DAO/governance/GovernorBravoDelegator.sol/GovernorBravoDelegator.json',
  './node_modules/@bobanetwork/contracts/artifacts/contracts/L2BillingContract.sol/L2BillingContract.json',
  './src/deployment/contracts/L1ERC20.json',
  './src/deployment/contracts/NFTMonsterV2.json',
  './src/deployment/contracts/AuthenticatedFaucet.json',
  './src/deployment/contracts/WAGMIv0.json',
  './src/deployment/contracts/WAGMIv1.json',
  './src/deployment/contracts/crosschain/EthBridge.json',
  './src/deployment/contracts/crosschain/L2StandardERC20.json',
  './src/deployment/contracts/crosschain/LZEndpointMock.json',
]

const networkServicesStr = fs.readFileSync(
  './src/services/networkService.ts',
  'utf8'
)

const compress = () => {
  for (const path of smart_contract_abi_paths) {
    const rawData = fs.readFileSync(path, 'utf8')
    const abiObject = JSON.parse(rawData)
    const name = abiObject.contractName
    let abi = abiObject.abi
    abi = abi.filter((component) => {
      if (component['type'] === 'function' && component['name']) {
        if (networkServicesStr.includes(component['name'])) {
          return true
        }
        return false
      }
    })
    const abiInterface = new ethers.utils.Interface(abi)
    const humanReadableABI = abiInterface.format(ethers.utils.FormatTypes.full)
    const stringifiedHumanReadableABI = JSON.stringify(humanReadableABI)
    const result = `const ${name}ABI = ${stringifiedHumanReadableABI}\n export default ${name}ABI`
    fs.writeFile(`./src/services/abi/${name}.abi.ts`, result, () => {
      console.log(`wrote ${name}`)
    })
  }
}

;(() => {
  compress()
})()
