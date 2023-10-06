import React from 'react'
import { setActiveNetworkType } from 'actions/networkAction'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveNetworkType } from 'selectors'
import { NETWORK_TYPE } from '../../../util/network/network.util'
import { FaucetTabItem, FaucetTabs } from './style'

const FaucetTabSelector = () => {
  const dispatch = useDispatch<any>()
  const activeNetworkType = useSelector(selectActiveNetworkType())

  const onTabClick = (payload: any) => {
    dispatch(
      setActiveNetworkType({
        networkType: payload,
      })
    )
  }

  return (
    <FaucetTabs>
      <FaucetTabItem
        active={activeNetworkType === NETWORK_TYPE.MAINNET}
        onClick={() => onTabClick(NETWORK_TYPE.MAINNET)}
      >
        {NETWORK_TYPE.MAINNET}
      </FaucetTabItem>
      <FaucetTabItem
        active={activeNetworkType === NETWORK_TYPE.TESTNET}
        onClick={() => onTabClick(NETWORK_TYPE.TESTNET)}
      >
        {NETWORK_TYPE.TESTNET}
      </FaucetTabItem>
    </FaucetTabs>
  )
}

export default FaucetTabSelector
