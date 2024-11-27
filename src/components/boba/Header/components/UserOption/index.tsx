import Dropdown from "@/components/boba/Dropdown"
import { IconBracketsAngle, IconCopy, IconLogout } from "@tabler/icons-react"
import useHeader from "../../useHeader"
import { useCopyToClipboard } from "usehooks-ts"
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react"

const explorerMenu = {
  label: 'Block Explorer',
  menu: [
    {
      label: "Etherscan",
      iconRight: true,
      type: "link",
      url: "https://etherscan.io"
    },
    {
      label: "Bobascan",
      iconRight: true,
      type: "link",
      url: "https://bobascan.com"
    },
    {
      label: "Binance Smart Chain",
      iconRight: true,
      type: "link",
      url: "https://bscscan.com"
    },
    {
      label: "Boba Bnb",
      iconRight: true,
      type: "link",
      url: "https://bnb.bobascan.com"
    },
    {
      label: "Optimism",
      iconRight: true,
      type: "link",
      url: "https://optimistic.etherscan.io/"
    },
    {
      label: "Arbitrum",
      iconRight: true,
      type: "link",
      url: "https://arbiscan.io/"
    },
  ]
}

const UserOption = () => {
  const { account, shortAccount } = useHeader()
  const [_, copyToClipboard] = useCopyToClipboard();
  const { isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const accountMenu = {
    label: 'Account',
    menu: [
      {
        label: "Copy Address",
        type: "button",
        iconLeft: <IconCopy className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />,
        onClick: () => {
          if (!account) return;
          copyToClipboard(account)
            .then(success => {
              if (success) {
                console.log(`Copied`);
              } else {
                console.log(`Failed to copy`);
              }
            });
        }
      },
      {
        label: "Disconnect",
        type: "button",
        iconLeft: <IconLogout className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />,
        onClick: () => {
          if (isConnected) {
            disconnect()
          }
        }
      },
      {
        label: "Switch to testnet",
        type: "button",
        iconLeft: <IconBracketsAngle className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />,
        onClick: () => {
          console.log(`switch to testnet!`)
        }
      },
    ]
  }

  return (
    <div>
      <Dropdown
        buttonLabel={shortAccount}
        menuGroups={[accountMenu, explorerMenu]}
      />
    </div>
  )
}

export default UserOption
