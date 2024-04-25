import React, { FC, useEffect, useState } from 'react'
import {
  setTeleportationOfAssetSupported,
  setTeleportationDisburserBalance,
  updateToken,
} from 'actions/bridgeAction'
import {
  fetchBalances,
  getDisburserBalance,
  isTeleportationOfAssetSupported,
} from 'actions/networkAction'
import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import { isEqual } from 'util/lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetwork,
  selectActiveNetworkType,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectLayer,
  selectlayer1Balance,
  selectlayer2Balance,
  selectTokenToBridge,
} from 'selectors'
import { getCoinImage } from 'util/coinImage'
import { LAYER } from 'util/constant'
import {
  ActionLabel,
  ListLabel,
  TokenBalance,
  TokenLabel,
  TokenListItem,
  TokenPickerAction,
  TokenPickerList,
  TokenPickerModalContainer,
  TokenSearchContainer,
  TokenSearchInput,
  TokenSymbol,
} from './styles'
import { formatTokenAmount } from 'util/common'
import { Network, NetworkList } from '../../../util/network/network.util'
import bobaLogo from 'assets/images/Boba_Logo_White_Circle.png'
import { BRIDGE_TYPE } from '../../Bridging/BridgeTypeSelector'
import { constants, ethers } from 'ethers'

import { lightBridgeGraphQLService } from '@bobanetwork/graphql-utils'
import { bridgeConfig } from './config'
import { NETWORK_L2_OPTIONS } from '../../history/constants'
import { optimismConfig } from '../../../util/network/config/optimism'
import { arbitrumConfig } from '../../../util/network/config/arbitrum'
// the L2 token which can not be exited so exclude from dropdown in case of L2
const NON_EXITABLE_TOKEN = [
  'OLO',
  'xBOBA',
  'WAGMIv0',
  'WAGMIv1',
  'WAGMIv2',
  'WAGMIv2-Oolong',
]

interface TokenPickerModalProps {
  open: boolean
  tokenIndex: number
}

const TokenPickerModal: FC<TokenPickerModalProps> = ({ open, tokenIndex }) => {
  const layer = useSelector(selectLayer())
  const dispatch = useDispatch<any>()

  const bridgeType = useSelector(selectBridgeType())
  const l1Balance = useSelector(selectlayer1Balance, isEqual)
  const l2Balance = useSelector(selectlayer2Balance, isEqual)
  const tokenToBridge = useSelector(selectTokenToBridge())
  const activeNetwork = useSelector(selectActiveNetwork())
  const activeNetworkType = useSelector(selectActiveNetworkType())
  const destTeleportationChainId = useSelector(selectDestChainIdTeleportation())

  const [isMyToken, setIsMyToken] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [balances, setBalance] = useState([])

  useEffect(() => {
    const config = bridgeConfig[bridgeType] || bridgeConfig.default
    config
      .getBalance({ l1Balance, l2Balance, layer, getBridgeableTokens })
      .then((res) => {
        setBalance(res)
      })
  }, [bridgeType, l1Balance, l2Balance, layer])

  const getBridgeableTokens = async (allTokens) => {
    if (!allTokens.length) {
      return allTokens
    }

    const destChainId =
      destTeleportationChainId ??
      NetworkList[activeNetworkType].find((n) => n.chain === activeNetwork)
        .chainId[layer === LAYER.L1 ? LAYER.L2 : LAYER.L1]

    try {
      const networkId = NetworkList[activeNetworkType].find(
        (n) => n.chain === activeNetwork
      ).chainId[layer === LAYER.L1 ? LAYER.L1 : LAYER.L2]

      const res = (
        await lightBridgeGraphQLService.querySupportedTokensBridge(
          networkId,
          destChainId
        )
      ).filter(() => {
        return ![
          optimismConfig.Testnet.L2.chainId,
          arbitrumConfig.Testnet.L2.chainId,
          optimismConfig.Mainnet.L2.chainId,
          arbitrumConfig.Mainnet.L2.chainId,
        ].includes(Number(destChainId))
      })
      if (res.length) {
        return res
      } else {
        return allTokens
      }
    } catch (e) {
      console.log('error!: ', e)
      return allTokens
    }
  }

  useEffect(() => {
    dispatch(fetchBalances())
  }, [dispatch])

  const handleClose = () => {
    dispatch(closeModal('tokenPicker'))
  }

  const onTokenSelect = async (token: any) => {
    dispatch(updateToken({ token, tokenIndex: 0 }))

    const destChainId =
      destTeleportationChainId ??
      NetworkList[activeNetworkType].find((n) => n.chain === activeNetwork)
        .chainId[layer === LAYER.L1 ? LAYER.L2 : LAYER.L1]

    if (bridgeType === BRIDGE_TYPE.LIGHT) {
      const isSupported = await dispatch(
        isTeleportationOfAssetSupported(layer, token.address, destChainId)
      )
      const sourceChainId = NetworkList[activeNetworkType].find(
        (n) => n.chain === activeNetwork
      ).chainId[layer]
      const disburserBalance = await dispatch(
        getDisburserBalance(sourceChainId, destChainId, token.address)
      )
      dispatch(setTeleportationOfAssetSupported(isSupported))
      dispatch(setTeleportationDisburserBalance(disburserBalance))
    }
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title="Select Token"
      transparent={false}
      testId="token-picker-modal"
    >
      <TokenPickerModalContainer>
        <TokenSearchContainer>
          <TokenSearchInput
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search token name"
          />
        </TokenSearchContainer>
        <TokenPickerAction>
          <ActionLabel selected={isMyToken} onClick={() => setIsMyToken(true)}>
            My Tokens
          </ActionLabel>
          <ActionLabel
            selected={!isMyToken}
            onClick={() => setIsMyToken(false)}
          >
            All
          </ActionLabel>
        </TokenPickerAction>
        <ListLabel> Token Names </ListLabel>
        <TokenPickerList title="tokenList">
          {balances.length > 0
            ? balances
                .filter((token: any, index: number) => {
                  if (layer === LAYER.L2) {
                    return !(NON_EXITABLE_TOKEN.indexOf(token.symbol) > 0)
                  }
                  return true
                })
                .map((token: any) => {
                  const amount = formatTokenAmount(token)

                  if (isMyToken && Number(amount) <= 0) {
                    return null
                  }

                  if (
                    searchTerm &&
                    !token.symbol.includes(searchTerm.toUpperCase())
                  ) {
                    return null
                  }

                  return (
                    <TokenListItem
                      key={token.symbol}
                      selected={token.symbol === tokenToBridge?.symbol}
                      onClick={() =>
                        onTokenSelect({
                          ...token,
                          amount,
                        })
                      }
                    >
                      <TokenSymbol>
                        <img
                          src={
                            token.symbol === 'BOBA'
                              ? bobaLogo
                              : getCoinImage(token.symbol)
                          }
                          alt={`${token.symbol} logo`}
                          width="24px"
                          height="24px"
                        />
                      </TokenSymbol>
                      <TokenLabel>
                        {token.symbol}
                        <TokenBalance>{amount}</TokenBalance>
                      </TokenLabel>
                    </TokenListItem>
                  )
                })
            : null}
        </TokenPickerList>
      </TokenPickerModalContainer>
    </Modal>
  )
}

export default React.memo(TokenPickerModal)
