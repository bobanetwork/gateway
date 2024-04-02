import { BRIDGE_TYPE } from '../../Bridging/BridgeTypeSelector'
import { ethers } from 'ethers'

export const bridgeConfig = {
  [BRIDGE_TYPE.LIGHT]: {
    getBalance: ({ l1Balance, l2Balance, layer, getBridgeableTokens }) => {
      const balances = layer === 'L2' ? l2Balance : l1Balance
      return getBridgeableTokens(balances).then((supportedTokens) => {
        const supportedAddresses = supportedTokens
          .map((token) => {
            return token.token === ethers.constants.AddressZero
              ? '0x4200000000000000000000000000000000000006'
              : token.token
          })
          .filter((b) => b !== undefined)
        return balances.filter((balance) =>
          supportedAddresses.includes(balance.address)
        )
      })
    },
  },
  default: {
    getBalance: ({ l1Balance, l2Balance, layer }) =>
      Promise.resolve(layer === 'L2' ? l2Balance : l1Balance),
  },
}
