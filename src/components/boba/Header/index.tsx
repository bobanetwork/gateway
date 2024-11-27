import { Button, Text } from "@/components/ui";
import { cn } from "@/utils/class-merge";
import { IconMenu2 } from "@tabler/icons-react";
import { FC, Fragment } from "react";
import { NavLink } from "react-router-dom";
import AppNotification from "./components/AppNotification";
import NetworkOption from "./components/NetworkOption";
import ThemeToggleButton from "./components/ThemeToggle";
import UserOption from "./components/UserOption";
import BobaLogo from "../BobaLogo";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

const navItems = [
  {
    label: 'Bridge',
    path: '/bridge'
  },
  {
    label: 'Trade',
    path: '/trade'
  },
  {
    label: 'Smart Account',
    path: '/smartaccount'
  },
  {
    label: 'History',
    path: '/history'
  },
  {
    label: 'Stake',
    path: '/stake'
  },
  // {
  //   label: 'Earn',
  //   path: '/earn'
  // },
  {
    label: 'Dao',
    path: '/dao'
  },
  {
    label: 'Ecosystem',
    path: '/ecosystem'
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

  const { isConnected } = useAccount()
  const { open } = useAppKit()

  return <header className="w-full px-4 py-3 lg:py-4 lg:px-12 flex justify-between items-center shadow-sm">
    <div className="text-xl font-bold flex self-center items-center gap-6 lg:hidden">
      <BobaLogo className="h-8 w-8 object-cover" />
    </div>
    <div className="text-xl font-bold hidden lg:flex self-center items-center gap-6">
      <BobaLogo className="h-8 w-8 object-cover" />
      {navItems.map(({ path, label }) => <Fragment key={path}>
        <LinkItem path={path} label={label} />
      </Fragment>)}
    </div>
    <div className="text-xl font-bold flex md:hidden self-end gap-2">
      <Button className="rounded-full px-4" size="sm">Connect Wallet</Button>
      <div className="flex justify-between items-center gap-1">
        <AppNotification />
        <div className="h-full w-px bg-gray-500 dark:bg-dark-gray-100"></div>
        <IconMenu2 className="ml-2 w-5 h-5 stroke-gray-600 dark:stroke-dark-gray-100" />
      </div>
    </div>
    <div className="text-xl font-bold hidden md:flex self-end gap-2">

      {isConnected ? <div className="hidden lg:flex gap-2">
        <NetworkOption />
        <UserOption />
      </div> : <Button className="rounded-full px-4" size="sm" onClick={() => {
          open()
      }}>Connect Wallet</Button>}
      <div className="flex gap-2">
        <AppNotification />
        <div className="h-full w-px bg-gray-500 dark:bg-dark-gray-100"></div>
        <ThemeToggleButton />
      </div>
    </div>
  </header>
}

export default Header;