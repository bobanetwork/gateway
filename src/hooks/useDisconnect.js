import {useDispatch,useSelector} from 'react-redux';
import {
  setLayer,
  setConnect,
  setConnectBOBA,
  setConnectETH,
  setEnableAccount,
  setWalletConnected
} from 'actions/setupAction';

import networkService from 'services/networkService';
import {useEffect} from 'react';
import {selectChainIdChanged} from 'selectors';
import {setActiveNetwork,setActiveNetworkType,setNetwork} from 'actions/networkAction';
import {CHAIN_ID_LIST,NETWORK_TYPE,NetworkList} from 'util/network/network.util';

const useDisconnect = () => {
  const dispatch = useDispatch();
  const chainIdChanged = useSelector(selectChainIdChanged())

  const disconnect = async () => {
    await networkService.walletService.disconnect()
    dispatch(setLayer(null))
    dispatch(setConnect(false))
    dispatch(setConnectBOBA(false))
    dispatch(setConnectETH(false))
    dispatch(setWalletConnected(false))
    dispatch(setEnableAccount(false))
  }

  useEffect(() => {

    const switchChain = () => {
      const {networkType,chain} = CHAIN_ID_LIST[Number(chainIdChanged)]
      const {
        chain: network,
        icon: networkIcon,
        name
      } = NetworkList[networkType].find(network => network.chain === chain);

      dispatch(setActiveNetworkType({networkType}))
      dispatch(
        setNetwork({
          networkType,
          network,
          networkIcon,
          name
        })
      )
      dispatch(setActiveNetwork())
    }

    const disconnectAndSwitch = async () => {
      // on changing network from metamask disconnect wallet,
      // restart connect flow again with new network by updating state.
      if (chainIdChanged) {
        await disconnect();
        switchChain();
      } 
    }

    disconnectAndSwitch()
  },[chainIdChanged,disconnect])

  return {disconnect}
}

export default useDisconnect
