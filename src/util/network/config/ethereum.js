export const ethereumConfig = {
  Testnet: {
    OMGX_WATCHER_URL: `https://api-watcher.goerli.boba.network/`,
    VERIFIER_WATCHER_URL: `https://api-verifier.goerli.boba.network/`,
    META_TRANSACTION: `https://api-meta-transaction.goerli.boba.network/`,
    MM_Label: `Goerli`,
    addressManager: `0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148`,
    L1: {
      name: "Goerli",
      chainId: 5,
      chainIdHex: '0x5',
      rpcUrl: [
        `https://goerli.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI`,
        `https://rpc.ankr.com/eth_goerli`,
      ],
      transaction: `https://goerli.etherscan.io/tx/`,
      blockExplorerUrl: `https://goerli.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: "BOBA Goerli L2",
      chainId: 2888,
      chainIdHex: '0xB48',
      rpcUrl: [ `https://goerli.boba.network` ],
      blockExplorer: `https://testnet.bobascan.com/`,
      transaction: `https://testnet.bobascan.com/tx/`,
      blockExplorerUrl: `https://testnet.bobascan.com/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    payloadForL1SecurityFee: {
      from: '0x122816e7A7AeB40601d0aC0DCAA8402F7aa4cDfA',
      to: '0x4df04E20cCd9a8B82634754fcB041e86c5FF085A',
      value: '0x174876e800',
      data:
        '0x7ff36ab500000000000000000000000000000000000000000000000003939808cc6852cc0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000122816e7a7aeb40601d0ac0dcaa8402f7aa4cdfa0000000000000000000000000000000000000000000000000000008c14b4a17a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddead00000000000000000000000000004204a0af0991b2066d2d617854d5995714a79132',
    },
    gasEstimateAccount: `0xdb5a187FED81c735ddB1F6E47F28f2A5F74639b2`
  },
  Mainnet: {
    OMGX_WATCHER_URL: `https://api-watcher.mainnet.boba.network/`,
    VERIFIER_WATCHER_URL: `https://api-verifier.mainnet.boba.network/`,
    META_TRANSACTION: `https://api-meta-transaction.mainnet.boba.network/`,
    MM_Label: `Mainnet`,
    addressManager: `0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089`,
    L1: {
      name: "Mainnet",
      chainId: 1,
      chainIdHex: '0x1',
      rpcUrl: [
        'https://mainnet.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI',
        `https://rpc.ankr.com/eth`,
        `https://cloudflare-eth.com`
      ],
      transaction: ` https://etherscan.io/tx/`,
      blockExplorerUrl: `https://etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: "BOBA L2",
      chainId: 288,
      chainIdHex: '0x120',
      rpcUrl: [
        `https://mainnet.boba.network`,
        `https://boba-ethereum.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI`,
      ],
      blockExplorer: `https://bobascan.com/`,
      transaction: `https://bobascan.com/tx/`,
      blockExplorerUrl: `https://bobascan.com/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    payloadForL1SecurityFee: {
      from: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      to: '0x17C83E2B96ACfb5190d63F5E46d93c107eC0b514',
      value: '0x38d7ea4c68000',
      data:
        '0x7ff36ab5000000000000000000000000000000000000000000000000132cc41aecbfbace00000000000000000000000000000000000000000000000000000000000000800000000000000000000000005e7a06025892d8eef0b5fa263fa0d4d2e5c3b54900000000000000000000000000000000000000000000000000000001c73d14500000000000000000000000000000000000000000000000000000000000000002000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddead00000000000000000000000000005008f837883ea9a07271a1b5eb0658404f5a9610',
    },
    gasEstimateAccount: `0xdb5a187FED81c735ddB1F6E47F28f2A5F74639b2`
  }
}
