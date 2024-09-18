import bobaLogo from "@/assets/boba/boba-logo.svg";
import { Button, Text } from "@/components/ui";
import AppNotification from "./components/AppNotification";
import ThemeToggleButton from "./components/ThemeToggle";
import UserOption from "./components/UserOption";
import NetworkOption from "./components/NetworkOption";

export const Header: React.FC<any> = () => {

  return <header className="w-full py-4 px-12 flex justify-between items-center shadow-sm">
    <div className="text-xl font-bold flex self-center items-center gap-6">
      <img className="h-8 w-8 object-cover" src={bobaLogo} alt="Boba Logo" />
      <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Bridge</Text>
      <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">History</Text>
      <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Stake</Text>
      <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Dao</Text>
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