import { BRIDGE_TYPE } from '../../Bridging/BridgeTypeSelector'
import { ethers } from 'ethers'

export const bridgeConfig = {
  [BRIDGE_TYPE.LIGHT]: {
    getBalance: ({ l1Balance, l2Balance, layer, getBridgeableTokens }) => {
      const balances = layer === 'L2' ? l2Balance : l1Balance
      return getBridgeableTokens(balances).then((supportedTokens) => {
        console.log(`supportedTokens`, supportedTokens, balances)
        return balances.filter((balance) => {
          return supportedTokens
            .map((b) => b.token)
            .includes(
              balance.address.replace(
                '0x4200000000000000000000000000000000000006',
                ethers.constants.AddressZero
              )
            )
        })
      })
    },
  },
  default: {
    getBalance: ({ l1Balance, l2Balance, layer }) =>
      Promise.resolve(layer === 'L2' ? l2Balance : l1Balance),
  },
}
