import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { ExitIcon } from '@radix-ui/react-icons'
import { IconBracketsAngle, IconCheck, IconChevronDown, IconCircle, IconCopy, IconExternalLink } from '@tabler/icons-react'

const userMenuGroups = [
  {
    label: 'Account',
    menu: [
      {
        label: "Copy Address",
        iconLeft: true,
        type: "button"
      },
      {
        label: "Disconnect",
        iconLeft: true,
        type: "button"
      },
      {
        label: "Switch to testnet",
        iconLeft: true,
        type: "button"
      },
    ]
  },
  {
    label: 'Block Explorer',
    menu: [
      {
        label: "Etherscan",
        iconRight: true,
        type: "link"
      },
      {
        label: "Bobascan",
        iconRight: true,
        type: "link"
      },
      {
        label: "Binance Smart Chain",
        iconRight: true,
        type: "link"
      },
      {
        label: "Boba Bnb",
        iconRight: true,
        type: "link"
      },
    ]
  },
]

type MenuItemTypes = 'link' | 'button' | 'label';

interface MenuItemProps {
  iconLeft: boolean
  label: string
  iconRight: boolean
  type: MenuItemTypes
  url: string
  onClick: (e: any) => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  iconLeft,
  label,
  iconRight,
  onClick,
  url,
  type
}) => {

  const renderContent = () => (
    <>
      {iconLeft ? <IconCopy className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" /> : null}
      <span className="font-medium text-sm">{label}</span>
      {iconRight ? <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" /> : null}
    </>
  );

  if (type === 'link' && url) {
    return <a
      className="flex justify-between rounded-sm items-center p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer">
      {renderContent()}
    </a>
  } else {
    return <DropdownMenuItem
      className="flex justify-start rounded-sm items-center p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
      onClick={onClick}
    >
      {renderContent()}
    </DropdownMenuItem>
  }

}

const MenuGroup: React.FC<any> = ({
  label, menu
}) => {
  return <>
    {label ? <DropdownMenuLabel
      className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
    >
      <Text variant='md' fontWeight='normal'>label</Text>
    </DropdownMenuLabel> : null}
    {menu.map((_menuItem: any) => <MenuItem {..._menuItem} />)}
  </>
}

export const Dropdown = () => {
  return <DropdownMenu>
    <DropdownMenuTrigger>
      <Button size="sm" variant="select">
        Boba Network
        <IconChevronDown className="w-4 h-4 stroke-gray-600 dark:stroke-gray-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      alignOffset={3}
      align="end"
      className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
    >
      <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
        <IconCircle className="w-9 h-9 text-blue-300" />
        <Text className="flex-1" variant="sm" fontWeight='medium'>Ethereum</Text>
        {/* <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" /> */}
      </DropdownMenuItem>
      <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
        <IconCircle className="w-9 h-9 text-blue-300" />
        <Text className="flex-1" variant="sm" fontWeight='medium'>Binance Smart Chain</Text>
        <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" />
      </DropdownMenuItem>

      {userMenuGroups.map((group) => {
        return <MenuGroup {...group} />
      })}

      <DropdownMenuLabel
        className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
      >
        <Text variant='md' fontWeight='normal'>Account</Text>
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          <IconCopy className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />
          <Text fontWeight='medium' variant="sm"> Copy Address</Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          <ExitIcon className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />
          Disconnect
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          <IconBracketsAngle className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />
          Switch to testnet
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuLabel
        className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
      >
        <Text variant='md' fontWeight='normal'>Block Explorer</Text>
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-between p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          Etherscan
          <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-between p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          Bobascan
          <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-between p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          Binance Smart Chain
          <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex rounded-sm items-center justify-between p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
        >
          Boba BNB
          <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default Dropdown;