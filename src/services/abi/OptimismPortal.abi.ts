export const OptimismPortalABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_mint',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: '_gasLimit',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: '_isCreation',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'depositERC20Transaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: '_gasLimit',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: '_isCreation',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'depositTransaction',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'gasLimit',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct Types.WithdrawalTransaction',
        name: '_tx',
        type: 'tuple',
      },
    ],
    name: 'finalizeWithdrawalTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'finalizedWithdrawals',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'guardian',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_l2OutputIndex',
        type: 'uint256',
      },
    ],
    name: 'isOutputFinalized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l2Oracle',
    outputs: [
      {
        internalType: 'contract L2OutputOracle',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l2Sender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_byteCount',
        type: 'uint64',
      },
    ],
    name: 'minimumGasLimit',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'params',
    outputs: [
      {
        internalType: 'uint128',
        name: 'prevBaseFee',
        type: 'uint128',
      },
      {
        internalType: 'uint64',
        name: 'prevBoughtGas',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'prevBlockNum',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: 'paused_',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'gasLimit',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct Types.WithdrawalTransaction',
        name: '_tx',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_l2OutputIndex',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'version',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'stateRoot',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'messagePasserStorageRoot',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'latestBlockhash',
            type: 'bytes32',
          },
        ],
        internalType: 'struct Types.OutputRootProof',
        name: '_outputRootProof',
        type: 'tuple',
      },
      {
        internalType: 'bytes[]',
        name: '_withdrawalProof',
        type: 'bytes[]',
      },
    ],
    name: 'proveWithdrawalTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'provenWithdrawals',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'outputRoot',
        type: 'bytes32',
      },
      {
        internalType: 'uint128',
        name: 'timestamp',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'l2OutputIndex',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: '_decimals',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: '_name',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_symbol',
        type: 'bytes32',
      },
    ],
    name: 'setGasPayingToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'superchainConfig',
    outputs: [
      {
        internalType: 'contract SuperchainConfig',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'systemConfig',
    outputs: [
      {
        internalType: 'contract SystemConfig',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'opaqueData',
        type: 'bytes',
      },
    ],
    name: 'TransactionDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'withdrawalHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    name: 'WithdrawalFinalized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'withdrawalHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'WithdrawalProven',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BadTarget',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CallPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ContentLengthMismatch',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EmptyItem',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GasEstimation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidDataRemainder',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidHeader',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LargeCalldata',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NonReentrant',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyCustomGasToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OutOfGas',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SmallGasLimit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Unauthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnexpectedList',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnexpectedString',
    type: 'error',
  },
]
