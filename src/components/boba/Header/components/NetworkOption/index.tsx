import Dropdown from '@/components/boba/Dropdown';

import bnbImg from "@/assets/chain-logos/bnb.svg";
import bobaBnbImg from "@/assets/chain-logos/boba-bnb.svg";
import bobaEthImg from "@/assets/chain-logos/boba-eth.svg";
import ethImg from "@/assets/chain-logos/ethereum.svg";
import { useNetworkSwitch } from '@/hooks/useNetworkSwitch';
import { boba, bsc, mainnet } from 'wagmi/chains';
import { BOBABSC_CHAIN } from '@/config/chainConfig/bobaBnb';
import { useAccount } from 'wagmi';
import { NetworkSwitchModal } from '@/components/boba/NetworkSwitchModal';

const NetworkOption = () => {
  const { chainId } = useAccount()
  const {
    switchToChain,
    switchState,
    targetChain,
    error,
    isModalOpen,
    confirmSwitch,
    addNetwork,
    closeModal, } = useNetworkSwitch()


  const networkMenu = {
    menu: [
      {
        id: mainnet.id,
        label: 'Ethereum',
        type: 'button',
        iconLeft: <img src={ethImg} alt="network icon" className="w-6 h-6 object-cover" />,
        onClick: () => {
          switchToChain(mainnet)
        }
      },
      {
        id: bsc.id,
        label: 'Binance Smart Chain',
        type: 'button',
        iconLeft: <img src={bnbImg} alt="network icon" className="w-6 h-6 object-cover" />,
        onClick: () => {
          switchToChain(bsc)
        }
      },
      {
        id: boba.id,
        label: 'Boba ETH',
        type: 'button',
        iconLeft: <img src={bobaEthImg} alt="network icon" className="w-6 h-6 object-cover" />,
        onClick: () => {
          switchToChain(boba)
        }
      },
      {
        id: BOBABSC_CHAIN.id,
        label: 'Boba BNB',
        type: 'button',
        iconLeft: <img src={bobaBnbImg} alt="network icon" className="w-6 h-6 object-cover" />,
        onClick: () => {
          switchToChain(BOBABSC_CHAIN)
        }
      },
    ]
  }

  const renderLabel = () => {
    if (chainId) {
      const currentChain = networkMenu.menu.find((c) => c.id === chainId);
      if (currentChain) {
        return <>
          {currentChain?.iconLeft}
          <span className="font-medium text-sm">{currentChain?.label}</span>
        </>
      }
    }

    return "Change Network"
  }

  return (
    <>
      <Dropdown
        buttonLabel={renderLabel()}
        menuGroups={[networkMenu]}
      />
      <NetworkSwitchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        state={switchState}
        targetChain={targetChain}
        error={error}
        onConfirm={confirmSwitch}
        onAddNetwork={addNetwork}
      />
    </>
  )
}

export default NetworkOption
