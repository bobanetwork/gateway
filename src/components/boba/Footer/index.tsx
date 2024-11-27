import { Text, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { useFooter } from "./useFooter";
import { IconFileText, IconBrandTwitter, IconBrandDiscord, IconBrandTelegram } from "@tabler/icons-react";
import BobaLogo from "../BobaLogo";

const socialIconMap: Record<string, React.ReactNode> = {
  docs: <IconFileText className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />,
  twitter: <IconBrandTwitter className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />,
  discord: <IconBrandDiscord className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />,
  telegram: <IconBrandTelegram className=" w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />,
}

export const Footer = () => {
  const { footerNavLinks, socialNavLinks } = useFooter();

  return <footer className="w-full py-10 px-12 shadow-md">
    <div className="flex flex-col space-y-4">
      <div className="text-left hidden md:flex justify-center lg:justify-start gap-2">
        <a href="https://boba.network" target="_blank">
          <BobaLogo className="h-6 w-6 object-cover" />
        </a>
        <a href="https://boba.network" target="_blank">
          <Text variant="xl" fontWeight="medium"> BOBA NETWORK </Text>
        </a>
      </div>

      <div className="hidden md:flex flex-col-reverse lg:flex-row items-center gap-4 justify-between">
        <div className="flex space-x-4">
          {footerNavLinks.map((linkItem, index) => <a key={index} href={linkItem.href} target="_blank">
            <Text variant="sm" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> {linkItem.label} </Text>
          </a>)}
        </div>

        <div className="flex space-x-4">
          <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">BNB Testnet <span className="dark:text-dark-gray-200 text-gray-700">10 Gwei</span></Text>
          <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">Boba BNB Testnet <span className="dark:text-dark-gray-200 text-gray-700">1 Gwei</span></Text>
          <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">Saving <span className="dark:text-dark-gray-200 text-gray-700">1x</span></Text>
          <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">L1 <span className="dark:text-dark-gray-200 text-gray-700">30446615</span></Text>
          <Text variant="sm" fontWeight="medium" className="text-gray-600 hover:text-gray-800 dark:text-dark-gray-100 dark:hover:text-green-300">L2 <span className="dark:text-dark-gray-200 text-gray-700">22804</span></Text>
        </div>
      </div>

      <div className="hidden md:flex border-t border-dark-gray-100 dark:border-dark-gray-200"></div>

      <div className="flex flex-col-reverse items-center md:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-200"> ©2024 Enya Labs - All rights reserved. </Text>
          <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-200"> v.3.0.0 </Text>
        </div>

        <div className="flex md:hidden space-x-4">
          {footerNavLinks.map((linkItem, index) => <a key={index} href={linkItem.href} target="_blank">
            <Text variant="xs" fontWeight="medium" className="hover:text-gray-800 text-gray-600 dark:text-dark-gray-100 dark:hover:text-green-300 hover:underline"> {linkItem.label} </Text>
          </a>)}
        </div>
        <div className="flex space-x-4">
          {socialNavLinks.map((linkItem, index) => (<Tooltip key={linkItem.label}>
            <TooltipContent>
              <Text variant="sm">{linkItem.label}</Text>
            </TooltipContent>
            <TooltipTrigger asChild>
              <a key={index} href={linkItem.href} target="_blank">
                {socialIconMap[linkItem.icon]}
              </a>
            </TooltipTrigger>
          </Tooltip>))}
        </div>
      </div>
    </div>
  </footer>
}

export default Footer;