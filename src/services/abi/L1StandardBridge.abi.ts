import { ENABLE_ANCHORAGE } from '../../util/constant'

export const L1StandardBridgeABI = ENABLE_ANCHORAGE
  ? [
      {
        type: 'receive',
        stateMutability: 'payable',
      },
      {
        type: 'function',
        name: 'MESSENGER',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract CrossDomainMessenger',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'OTHER_BRIDGE',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract StandardBridge',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'bridgeERC20',
        inputs: [
          {
            name: '_localToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_remoteToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_minGasLimit',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'bridgeERC20To',
        inputs: [
          {
            name: '_localToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_remoteToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_minGasLimit',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'bridgeETH',
        inputs: [
          {
            name: '_minGasLimit',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'payable',
      },
      {
        type: 'function',
        name: 'bridgeETHTo',
        inputs: [
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_minGasLimit',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'payable',
      },

      {
        type: 'function',
        name: 'deposits',
        inputs: [
          {
            name: '',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '',
            type: 'address',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'finalizeBridgeERC20',
        inputs: [
          {
            name: '_localToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_remoteToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'finalizeBridgeETH',
        inputs: [
          {
            name: '_from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'payable',
      },
      {
        type: 'function',
        name: 'finalizeERC20Withdrawal',
        inputs: [
          {
            name: '_l1Token',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_l2Token',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'finalizeETHWithdrawal',
        inputs: [
          {
            name: '_from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_extraData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
        outputs: [],
        stateMutability: 'payable',
      },
      {
        type: 'function',
        name: 'initialize',
        inputs: [
          {
            name: '_messenger',
            type: 'address',
            internalType: 'contract CrossDomainMessenger',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'l2TokenBridge',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'address',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'messenger',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract CrossDomainMessenger',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'otherBridge',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract StandardBridge',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'version',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'string',
            internalType: 'string',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'event',
        name: 'ERC20BridgeFinalized',
        inputs: [
          {
            name: 'localToken',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'remoteToken',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: false,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ERC20BridgeInitiated',
        inputs: [
          {
            name: 'localToken',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'remoteToken',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: false,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ERC20DepositInitiated',
        inputs: [
          {
            name: 'l1Token',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'l2Token',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: false,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ERC20WithdrawalFinalized',
        inputs: [
          {
            name: 'l1Token',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'l2Token',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: false,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ETHBridgeFinalized',
        inputs: [
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ETHBridgeInitiated',
        inputs: [
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ETHDepositInitiated',
        inputs: [
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ETHWithdrawalFinalized',
        inputs: [
          {
            name: 'from',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'extraData',
            type: 'bytes',
            indexed: false,
            internalType: 'bytes',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'Initialized',
        inputs: [
          {
            name: 'version',
            type: 'uint8',
            indexed: false,
            internalType: 'uint8',
          },
        ],
        anonymous: false,
      },
    ]
  : [
      'function depositETH(uint32 _l2Gas, bytes calldata _data) external payable',
      'function depositETHTo(address _to, uint32 _l2Gas, bytes calldata _data) external payable',
      'function depositERC20(address _l1Token,address _l2Token, uint256 _amount, uint32 _l2Gas,bytes calldata _data) external',
      'function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _l2Gas,bytes calldata _data) external',
      'function depositNativeToken(uint32 _l2Gas, bytes calldata _data) external payable',
      'function depositNativeTokenTo(address _to,uint32 _l2Gas,bytes calldata _data) external payable',
    ]
