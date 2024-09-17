import bobaLogo from "@/assets/boba-logo.svg";
import { IconBrandDiscord, IconBrandTelegram, IconBrandTwitter, IconFileText } from "@tabler/icons-react";
import AppNotification from "./components/boba/AppNotification";
import ThemeToggleButton from "./components/boba/ThemeToggle";
import { Button, Text, Tooltip } from "./components/ui";

function App() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-dark-gray-600">
      <header className="w-full py-4 px-12 flex justify-between items-center shadow-sm">
        <div className="text-xl font-bold flex self-center items-center gap-6">
          <img className="h-8 w-8 object-cover"
            src={bobaLogo} alt="Boba Logo" />

          <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Bridge</Text>
          <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">History</Text>
          <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Stake</Text>
          <Text variant="md" fontWeight="medium" className="cursor-pointer hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300">Dao</Text>
        </div>
        <div className="text-xl font-bold flex self-end gap-2">
          <Button>Connect Wallet</Button>
          <div className="flex gap-2">
            <AppNotification />
            <div className="h-full w-px bg-gray-500 dark:bg-dark-gray-100"></div>
            <ThemeToggleButton />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="min-h-[calc(100vh-473px)]">

        </div>
      </main>

      <footer className="w-full py-10 px-12 shadow-md">
        <div className="flex flex-col space-y-4">
          <div className="text-left flex gap-2">
            <img className="h-6 w-6 object-cover" src={bobaLogo} alt="Boba Logo" />
            <Text variant="xl" fontWeight="medium"> BOBA NETWORK </Text>
          </div>

          <div className="flex justify-between">
            <div className="flex space-x-4">
              <a href="#">
                <Text variant="sm" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> FAQs </Text>
              </a>
              <a href="#">
                <Text variant="sm" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> Terms of Use </Text>
              </a>
              <a href="#">
                <Text variant="sm" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> Dev Tools </Text>
              </a>
              <a href="#">
                <Text variant="sm" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> Boba Network Website </Text>
              </a>
            </div>

            <div className="flex space-x-4">
              <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">BNB Testnet <span className="dark:text-dark-gray-200 text-gray-700">10 Gwei</span></Text>
              <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">Boba BNB Testnet <span className="dark:text-dark-gray-200 text-gray-700">1 Gwei</span></Text>
              <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">Saving <span className="dark:text-dark-gray-200 text-gray-700">1x</span></Text>
              <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">L1 <span className="dark:text-dark-gray-200 text-gray-700">30446615</span></Text>
              <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">L2 <span className="dark:text-dark-gray-200 text-gray-700">22804</span></Text>
            </div>
          </div>

          <div className="border-t border-dark-gray-100 dark:border-dark-gray-200"></div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-200"> ©2023 Enya Labs. All rights reserved. </Text>
              <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-200"> v.3.0.0 </Text>
            </div>

            <div className="flex space-x-4">
              <Tooltip content={<Text variant="sm">content</Text>}>
                <IconFileText className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
              </Tooltip>
              <Tooltip content={<Text variant="sm">content</Text>}>
                <IconBrandTwitter className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
              </Tooltip>
              <Tooltip content={<Text variant="sm">content</Text>}>
                <IconBrandDiscord className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
              </Tooltip>
              <Tooltip content={<Text variant="sm">content</Text>}>
                <IconBrandTelegram className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
              </Tooltip>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
}

export default App;
