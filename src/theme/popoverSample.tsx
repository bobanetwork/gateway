import { Button, Popover, PopoverContent, PopoverTrigger, Text } from "@/components/ui"
import { IconBell, IconInfoCircle } from "@tabler/icons-react"


const PopoverSample = () => (
  <div className="flex py-4 my-2">
    <Text variant="2xl" fontWeight="medium">Popover Sample for Notification</Text>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <IconBell className="w-5 h-5 text-gray-800 dark:text-dark-gray-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Text variant="md" fontWeight="medium">Notifications</Text>
          </div>
          <div className="flex flex-col gap-2 divide-y h-[500px] overflow-auto">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="p-2 max-w-sm mx-auto flex items-start space-x-4">
              <div className="shrink-0 py-2">
                <IconInfoCircle className="w-5 h-5 text-gray-700 dark:text-dark-gray-100" />
              </div>
              <div className="grid gap-2">
                <Text variant="sm" fontWeight="normal" className="dark:text-dark-gray-50">Continue withdrawal Transaction:
                  Claim Withdrawal</Text>
                <Text variant="xs" className="text-gray-600 dark:text-dark-gray-100">Tx:0xab...0350</Text>
                <Text variant="xs" className="text-gray-600 dark:text-dark-gray-100">04 Mar 2024 · 04:22 PM</Text>
                <Button size="md" className="my-2">Continue</Button>
              </div>
            </div>))}
            <div className="p-2 max-w-sm mx-auto flex items-start space-x-4 w-full">
              <div className="shrink-0 py-2">
                <IconInfoCircle className="w-5 h-5 text-red-300 dark:text-dark-red-400" />
              </div>
              <div className="grid gap-2 flex-1">
                <Text variant="sm" fontWeight="normal" className="text-gray-800 dark:text-dark-gray-50">Transaction Canceled</Text>
                <Text variant="xs" className="text-gray-600 dark:text-dark-gray-100">Transaction was rejected</Text>
                <Text variant="xs" className="text-gray-600 dark:text-dark-gray-100">04 Mar 2024 · 04:22 PM</Text>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>

  </div>
)

export default PopoverSample
