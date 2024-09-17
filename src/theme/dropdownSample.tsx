import { Checkbox, DropdownMenuSeparator } from '@/components/ui'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ExitIcon } from '@radix-ui/react-icons'
import { IconBracketsAngle, IconCheck, IconCircle, IconCopy, IconExternalLink, IconUserHexagon } from '@tabler/icons-react'

interface Props {

}

const DropdownSample = (props: Props) => {
  return (
    <div className='flex flex-col gap-2 items-center my-3'>
      <Text variant='3xl'>Dropdown Sample</Text>
      <div className="flex flex-2 flex-wrap gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">Fee</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
          >
            <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
              <IconCircle className="w-9 h-9 text-blue-300" />
              <Text className="flex-1" variant="sm" fontWeight='medium'>Boba</Text>
              <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" />
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
              <IconCircle className="w-9 h-9 text-blue-300" />
              <Text className="flex-1" variant="sm" fontWeight='medium'>EThH</Text>
              <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">Network</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
          >
            <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
              <IconCircle className="w-9 h-9 text-blue-300" />
              <Text variant='sm' fontWeight='medium' className="flex-1">Ethereum</Text>
              <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" />
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full gap-2 flex items-center justify-start text-gray-800 hover:bg-gray-200 dark:text-gray-50 dark:hover:bg-dark-gray-400 px-4 py-2 rounded-md focus-visible:outline-0 hover:border-0">
              <IconCircle className="w-9 h-9 text-blue-300" />
              <Text variant='sm' fontWeight='medium'>Smart Binance Chain</Text>
              <IconCheck className="w-6 h-6 text-gray-800 dark:text-dark-green-300" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <IconUserHexagon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
          >
            <DropdownMenuLabel
              className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
            >
              <Text variant='md' fontWeight='normal'>My Account</Text>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCopy className="w-4 h-4 text-gray-800 dark:text-dark-gray-50" />
                Copy Address
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


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">Network List</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
          >
            <DropdownMenuSeparator className="bg-gray-400 dark:bg-dark-gray-400" />
            <DropdownMenuLabel
              className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
            >
              <Text variant='md' fontWeight='normal'>Mainnet</Text>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Avalanche
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Fantom
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Binance Smart Chain
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Ethereum
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-400 dark:bg-dark-gray-400" />
            <DropdownMenuLabel
              className="py-1 px-0 text-gray-700 dark:text-dark-gray-100"
            >
              <Text variant='md' fontWeight='normal'>Testnet</Text>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Avalanche
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Fantom
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                MoonBeam
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <IconCircle className="w-5 h-5 text-green-300 bg-green-300 rounded-full" />
                Ethereum
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">Statuses</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-10 border shadow-xl rounded-lg p-2 border-gray-500 bg-gray-50 dark:bg-dark-gray-500 dark:text-gray-100 dark:border-dark-gray-400"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <Checkbox id="all" className="w-5 h-5 text-green-300 " checked />
                <label htmlFor="all">
                  <Text variant="sm" fontWeight='medium'>All Status</Text>
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <Checkbox id="completed" className="w-5 h-5 text-green-300 " />
                <label htmlFor="completed">
                  <Text variant="sm" fontWeight='medium'>Completed</Text>
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <Checkbox id="pending" className="w-5 h-5 text-green-300 " />
                <label htmlFor="pending">
                  <Text variant="sm" fontWeight='medium'>Pending</Text>
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex rounded-sm items-center justify-start p-2 gap-2 hover:bg-gray-200 dark:hover:bg-dark-gray-400 dark:text-dark-gray-50 focus-visible:outline-0 hover:cursor-pointer"
              >
                <Checkbox id="canceled" className="w-5 h-5 text-green-300 " />
                <label htmlFor="canceled">
                  <Text variant="sm" fontWeight='medium'>Canceled</Text>
                </label>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default DropdownSample
