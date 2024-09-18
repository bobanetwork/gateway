import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { IconCheck, IconChevronDown, IconCircle } from '@tabler/icons-react'

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
    </DropdownMenuContent>
  </DropdownMenu>
}

export default Dropdown;