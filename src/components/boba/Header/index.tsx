import bobaLogo from "@/assets/boba/boba-logo.svg";
import { Button, Text } from "@/components/ui";
import AppNotification from "./components/AppNotification";
import ThemeToggleButton from "./components/ThemeToggle";
import UserOption from "./components/UserOption";
import NetworkOption from "./components/NetworkOption";
import { FC, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/class-merge";

const navItems = [
  {
    label: 'Bridge',
    path: '/bridge'
  },
  {
    label: 'History',
    path: '/history'
  },
  {
    label: 'Stake',
    path: '/stake'
  },
  {
    label: 'Earn',
    path: '/earn'
  },
  {
    label: 'Dao',
    path: '/dao'
  },
  {
    label: 'Ecosystem',
    path: '/ecosystem'
  },
  {
    label: 'Trade',
    path: '/trade'
  },
]

interface LinkItemProps {
  path: string;
  label: string;
}

const LinkItem: FC<LinkItemProps> = ({
  path, label
}) => {
  return <NavLink
    to={path}
    className={({ isActive }) => (isActive ? 'active' : '')}
  >
    {({ isActive }) => (<Text variant="md" fontWeight="medium"
      className={cn(
        "cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300",
        isActive ? 'text-gray-800 dark:text-green-300' : ''
      )}>
      {label}
    </Text>)}
  </NavLink >
}

export const Header: React.FC<any> = () => {

  return <header className="w-full py-4 px-12 flex justify-between items-center shadow-sm">
    <div className="text-xl font-bold flex self-center items-center gap-6">
      <img className="h-8 w-8 object-cover" src={bobaLogo} alt="Boba Logo" />
      {navItems.map(({ path, label }) => <Fragment key={path}>
        <LinkItem path={path} label={label} />
      </Fragment>)}
    </div>
    <div className="text-xl font-bold flex self-end gap-2">
      <NetworkOption />
      <UserOption />
      <Button>Connect Wallet</Button>
      <div className="flex gap-2">
        <AppNotification />
        <div className="h-full w-px bg-gray-500 dark:bg-dark-gray-100"></div>
        <ThemeToggleButton />
      </div>
    </div>
  </header>
}

export default Header;