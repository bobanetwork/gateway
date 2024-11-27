import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui';
import Text from '@/components/ui/text';
import { IconChevronDown, IconCopy, IconExternalLink } from '@tabler/icons-react';
import React from 'react';

// @todo all explorer links needs to be swap based on networkType.

type MenuItemTypes = 'link' | 'button' | 'label';

type iconType = boolean | React.ReactNode;

export interface MenuItemProps {
  iconLeft: iconType
  label: string
  iconRight: iconType
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
      {iconLeft && (typeof iconLeft === 'boolean' ? <IconCopy className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" /> : (iconLeft))}
      <span className="font-medium text-sm">{label}</span>
      {iconRight ? <IconExternalLink className="w-4 h-4 text-gray-600 dark:text-dark-gray-100" /> : null}
    </>
  );

  if (type === 'link' && url) {
    return <a href={url} target="_blank">
      <DropdownMenuItem
      className="flex justify-between rounded-sm items-center p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer">
        {renderContent()}
      </DropdownMenuItem>
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
      <Text variant='md' fontWeight='normal'>{label}</Text>
    </DropdownMenuLabel> : null}
    {menu.map((_menuItem: any) => <React.Fragment key={_menuItem.label}><MenuItem {..._menuItem} /></React.Fragment>)}
  </>
}

interface IMenuGroup {
  label?: string
  menu: Array<any>
}

interface DropdownProps {
  buttonLabel: string
  menuGroups: IMenuGroup[]
}

export const Dropdown: React.FC<DropdownProps> = ({
  buttonLabel,
  menuGroups
}) => {
  return <DropdownMenu>
    <DropdownMenuTrigger className="px-2.5 py-4 h-9 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium 
    transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
    gap-2 border border-gray-500 text-gray-800 bg-gray-50 dark:text-dark-gray-50 dark:border-dark-gray-200 dark:bg-dark-gray-400">
      {buttonLabel}
      <IconChevronDown className="w-4 h-4 stroke-gray-600 dark:stroke-gray-50" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      alignOffset={3}
      align="end"
      className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
    >
      {menuGroups.map((group, index) => {
        return <React.Fragment key={group.label || index} ><MenuGroup {...group} /></React.Fragment>
      })}
    </DropdownMenuContent>
  </DropdownMenu>
}

export default Dropdown;