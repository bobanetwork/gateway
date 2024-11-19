import Dropdown from '@/components/boba/Dropdown';

import bnbImg from "@/assets/chain-logos/bnb.svg";
import bobaBnbImg from "@/assets/chain-logos/boba-bnb.svg";
import bobaEthImg from "@/assets/chain-logos/boba-eth.svg";
import ethImg from "@/assets/chain-logos/ethereum.svg";


const networkMenu = {
  menu: [
    {
      label: 'Ethereum',
      type: 'button',
      iconLeft: <img src={ethImg} alt="network icon" className="w-6 h-6 object-cover" />
    },
    {
      label: 'Binance Smart Chain',
      type: 'button',
      iconLeft: <img src={bnbImg} alt="network icon" className="w-6 h-6 object-cover" />
    },
    {
      label: 'Boba ETH',
      type: 'button',
      iconLeft: <img src={bobaEthImg} alt="network icon" className="w-6 h-6 object-cover" />
    },
    {
      label: 'Boba BNB',
      type: 'button',
      iconLeft: <img src={bobaBnbImg} alt="network icon" className="w-6 h-6 object-cover" />
    },
  ]
}

const NetworkOption = () => {
  return (
    <>
      <Dropdown
        buttonLabel="Change Network"
        menuGroups={[networkMenu]}
      />
    </>
  )
}

export default NetworkOption
