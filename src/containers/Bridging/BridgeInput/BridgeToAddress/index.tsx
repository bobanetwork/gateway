import React, { FC, memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectBridgeDestinationAddress,
  selectBridgeDestinationAddressAvailable,
  selectBridgeType,
  selectLayer,
} from 'selectors'
import { setBridgeDestinationAddress } from 'actions/bridgeAction'
import { ReceiveContainer } from '../styles'
import { Label } from '../../styles'
import InputWithButton from 'components/global/inputWithButton'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { LAYER } from 'util/constant'

type Props = {}

const BridgeToAddress: FC<Props> = ({}) => {
  const dispatch = useDispatch<any>()
  const destinationAddress = useSelector(selectBridgeDestinationAddress())
  const bridgeToAddressEnable = useSelector(
    selectBridgeDestinationAddressAvailable()
  )

  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())

  const [isAvailable, setIsAvailable] = useState(true)

  const onAddressChange = (e: any) => {
    const text = e.target.value
    dispatch(setBridgeDestinationAddress(text))
  }

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        dispatch(setBridgeDestinationAddress(text))
      }
    } catch (err) {
      // navigator clipboard api not supported in client browser
    }
  }

  useEffect(() => {
    if (layer !== LAYER.L1 || bridgeType !== BRIDGE_TYPE.CLASSIC) {
      setIsAvailable(false)
    } else {
      setIsAvailable(true)
    }
  }, [layer, bridgeType])

  if (!bridgeToAddressEnable || !isAvailable) {
    return null
  }

  return (
    <ReceiveContainer>
      <Label>Destination Address</Label>
      <InputWithButton
        type="string"
        value={destinationAddress}
        placeholder="Enter destination address"
        buttonLabel="Paste"
        name="address"
        onButtonClick={onPaste}
        onChange={onAddressChange}
      />
    </ReceiveContainer>
  )
}

export default memo(BridgeToAddress)
