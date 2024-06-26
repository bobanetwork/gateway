import {
  purgeBridgeAlert,
  resetBridgeAmount,
  resetToken,
} from 'actions/bridgeAction'
import {
  approveERC20,
  depositErc20,
  depositErc20Anchorage,
  depositETHAnchorageL2,
  depositETHL2,
  depositWithLightBridge,
  exitBOBA,
} from 'actions/networkAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { BigNumberish, ethers } from 'ethers'
import { useNetworkInfo } from 'hooks/useNetworkInfo'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetwork,
  selectActiveNetworkType,
  selectAmountToBridge,
  selectBridgeDestinationAddress,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectLayer,
  selectTokenToBridge,
} from 'selectors'
import networkService from 'services/networkService'
import { toWei_String } from 'util/amountConvert'
import { Layer, LAYER } from 'util/constant'
import { INetwork, NetworkList } from '../../util/network/network.util'

export const useBridge = () => {
  const dispatch = useDispatch<any>()
  const bridgeType = useSelector(selectBridgeType())
  const layer = useSelector(selectLayer())
  const toL2Account = useSelector(selectBridgeDestinationAddress())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())
  const { isAnchorageEnabled } = useNetworkInfo()

  const activeNetworkType = useSelector(selectActiveNetworkType())
  const activeNetwork = useSelector(selectActiveNetwork())

  const destLayer = layer === Layer.L1 ? Layer.L2 : Layer.L1
  const destChainIdBridge =
    useSelector(selectDestChainIdTeleportation()) ??
    (NetworkList[activeNetworkType] as INetwork[])?.find(
      (n) => n.chain === activeNetwork
    )?.chainId[destLayer]

  if (bridgeType === BRIDGE_TYPE.LIGHT && !destChainIdBridge) {
    dispatch(openError('Failed to get destination chain id'))
    console.error(
      'Destination chainId is undefined, this should never happen: ',
      NetworkList,
      activeNetworkType,
      activeNetwork,
      destLayer
    )
  }

  const triggerDeposit = async (amountWei: any) => {
    let receipt
    if (token.address === ethers.constants.AddressZero) {
      if (!!isAnchorageEnabled) {
        receipt = await dispatch(
          depositETHAnchorageL2({
            recipient: toL2Account || '',
            L1DepositAmountWei: amountWei,
          })
        )
      } else {
        receipt = await dispatch(
          depositETHL2({
            recipient: toL2Account || '',
            value_Wei_String: amountWei,
          })
        )
      }
    } else {
      if (!!isAnchorageEnabled) {
        receipt = await dispatch(
          depositErc20Anchorage({
            recipient: toL2Account || '',
            L1DepositAmountWei: amountWei,
            currency: token.address,
            currencyL2: token.addressL2,
          })
        )
      } else {
        receipt = await dispatch(
          depositErc20({
            recipient: toL2Account || '',
            value_Wei_String: amountWei,
            currency: token.address,
            currencyL2: token.addressL2,
          })
        )
      }
    }

    return receipt
  }

  const triggerTeleportAsset = async (
    amountWei: BigNumberish,
    destChainId: BigNumberish
  ) => {
    if (
      token.address !== ethers.constants.AddressZero &&
      token.address !== '0x4200000000000000000000000000000000000006'
    ) {
      // ERC20 token fast bridging.
      // step -1  approve token
      // step -2  deposit to Teleportation.

      const { lightBridgeAddr } = networkService.getLightBridgeAddress()
      if (!lightBridgeAddr) {
        console.warn('Teleportation Address not available.')
        return
      }
      const approvalReceipt = await dispatch(
        approveERC20(amountWei, token.address, lightBridgeAddr)
      )

      if (approvalReceipt === false) {
        dispatch(
          openError('Failed to approve amount or user rejected signature')
        )
        return
      }
    }
    return dispatch(
      depositWithLightBridge(layer, token.address, amountWei, destChainId)
    )
  }

  const triggerExit = async (amountWei: any) => {
    // As anchorage is release to mainnet & sepolia supports 2 step bridging.
    if (!!isAnchorageEnabled) {
      dispatch(openModal({ modal: 'bridgeMultiStepWithdrawal', isNewTx: true }))
    } else {
      return dispatch(exitBOBA(token.address, amountWei))
    }
  }

  const triggerSubmit = async () => {
    const amountWei = toWei_String(amountToBridge, token.decimals)

    let receipt
    dispatch(openModal({ modal: 'bridgeInProgress' }))
    if (layer === LAYER.L1) {
      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        receipt = await triggerDeposit(amountWei)
      } else if (bridgeType === BRIDGE_TYPE.LIGHT) {
        receipt = await triggerTeleportAsset(amountWei, destChainIdBridge!)
      }
    } else {
      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        // Anchorage update, other bridges should keep working as before
        receipt = await triggerExit(amountWei)
      } else if (bridgeType === BRIDGE_TYPE.LIGHT) {
        receipt = await triggerTeleportAsset(amountWei, destChainIdBridge!)
      }
    }
    dispatch(closeModal('bridgeInProgress'))
    if (receipt) {
      dispatch(openModal({ modal: 'transactionSuccess' }))
      dispatch(resetToken())
      dispatch(purgeBridgeAlert())
      dispatch(resetBridgeAmount())
    }
  }

  return {
    triggerSubmit,
  }
}

export default useBridge
