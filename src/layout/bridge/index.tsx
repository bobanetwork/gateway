import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Text, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import { IconBuildingBridge, IconCircle, IconExternalLink, IconHelp, IconSettings, IconSwitchHorizontal } from '@tabler/icons-react'

const BridgePage = () => {
  return (
    <div className="container">
      <div className="flex gap-5 items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full md:w-4/5 min-h-[500px] rounded-lg shadow-lg opacity-95 border">
            <CardHeader className="p-6 pb-5">
              <div className="flex w-full justify-between items-center">
                <div className="p-1 border-2 border-green-300 bg-green-50 rounded-full">
                  <IconBuildingBridge className="w-6 h-6 text-green-400 dark:text-dark-gray-200 dark:hover:text-green-400" />
                </div>
                <IconSettings className="w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
              </div>
              <CardTitle className="flex gap-2 items-center">
                <Text variant="xl" fontFamily="montserrat" fontWeight="bold">Bridge</Text>
                <Tooltip>
                  <TooltipContent>Show bridging information</TooltipContent>
                  <TooltipTrigger>
                    <IconHelp className="w-5 h-5 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
                  </TooltipTrigger>
                </Tooltip>
              </CardTitle>
              <CardDescription className="hidden md:flex">
                <Text variant="sm" className="">[Short description of the function of the bridge]</Text>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-0 w-full">
              <Tabs defaultValue="classic" className="w-full py-0">
                <TabsList className="rounded-full w-full">
                  <TabsTrigger className="rounded-full w-full" value="classic">Classic</TabsTrigger>
                  <TabsTrigger className="rounded-full w-full" value="light">Light</TabsTrigger>
                  <TabsTrigger className="rounded-full w-full" value="Thirdparty">Third Party</TabsTrigger>
                </TabsList>
                <TabsContent value="classic" className="gap-4 flex flex-col my-2">
                  <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex flex-col items-start justify-start w-full">
                      <Text variant='sm' >From</Text>
                      <div className="flex justify-start items-center gap-1 w-full rounded-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-gray-600 bg-transperant">
                        <IconCircle className="w-5 h-5 text-gray-600" />
                        <Text variant='sm' >Boba Network</Text>

                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-center">
                      <Text variant='sm' className="invisible" >switch</Text>
                      <div className="flex flex-col shadow-sm items-center justify-center p-1 border border-gray-600 rounded-full">
                        <IconSwitchHorizontal className="w-5 h-5 hover:text-gray-800 text-green-300 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-full">
                      <Text variant='sm' >To</Text>
                      <div className="flex justify-start items-center gap-1 w-full rounded-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-gray-600 bg-transperant">
                        <IconCircle className="w-5 h-5 text-gray-600" /> <Text variant='sm' >Ethereum</Text>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col items-start justify-start w-5/12">
                      <Text variant='sm' >Token</Text>
                      <div className="flex justify-start items-center gap-1 w-full rounded-s-full shadow-sm px-[12px] py-2 text-gray-800 border border-gray-600 bg-transperant">
                        <Text variant='sm' fontWeight="medium">Boba</Text>
                      </div>
                    </div>
                    <div className="flex w-full items-center">
                      <div className="flex flex-col items-start justify-start w-full">
                        <div className="flex items-center justify-between w-full">
                          <Text variant='sm'>Amount</Text>
                          <Text variant='xs' fontWeight='light' >Balance: 0.00ETH</Text>
                        </div>
                        <div className="flex justify-start items-center gap-1 w-full rounded-e-full shadow-sm px-[12px] py-2 border border-l-0 border-gray-600 bg-transperant">
                          <Text variant='sm' fontWeight="medium">Max</Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start w-full">
                    <Text variant="sm">Receive</Text>
                    <div className="w-full rounded-full shadow-sm px-[18px] py-2 border border-gray-600 bg-transperant">
                      <Text variant="sm" fontWeight="medium" >20.000</Text>
                    </div>
                  </div>

                </TabsContent>
                <TabsContent value="light" className="gap-4 flex flex-col my-2">
                  <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex flex-col items-start justify-start w-full">
                      <p className="text-sm font-inter text-gray-800">From</p>
                      <div className="flex justify-start items-center gap-1 w-full rounded-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-gray-600 bg-transperant">
                        <IconCircle className="w-5 h-5 text-gray-600" /> Boba Network
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-inter text-gray-800 invisible">switch</p>
                      <div className="flex flex-col shadow-sm items-center justify-center p-1 border border-gray-600 rounded-full">
                        <IconSwitchHorizontal className="w-5 h-5 hover:text-gray-800 text-green-300 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-full">
                      <p className="text-sm font-inter text-gray-800">To</p>
                      <div className="flex justify-start items-center gap-1 w-full rounded-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-gray-600 bg-transperant">
                        <IconCircle className="w-5 h-5 text-gray-600" /> Ethereum
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col items-start justify-start w-5/12">
                      <p className="text-sm font-inter text-gray-800">Token</p>
                      <div className="flex justify-start items-center gap-1 w-full rounded-s-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-gray-600 bg-transperant">
                        Boba
                      </div>
                    </div>
                    <div className="flex w-full items-center">
                      <div className="flex flex-col items-start justify-start w-full">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm font-inter text-gray-800">Amount</p>
                          <p className="text-xs font-light font-inter text-gray-800 ">Balance: 0.00ETH</p>
                        </div>
                        <div className="flex justify-start items-center gap-1 w-full rounded-e-full shadow-sm px-[12px] py-2 text-gray-800 text-sm font-medium border border-l-0 border-gray-600 bg-transperant">
                          Max
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start w-full">
                    <p className="text-sm font-inter text-gray-800">Receive</p>
                    <div className="w-full rounded-full shadow-sm px-[18px] py-2 text-gray-800 font-medium border border-gray-600 bg-transperant">
                      20.000
                    </div>
                  </div>

                </TabsContent>
                <TabsContent value="Thirdparty">
                  <p className="text-gray-500 font-sm font-inter">Thirdparty Bridge</p>
                  <div className="flex flex-col items-center w-full justify-start gap-2">
                    <div className="flex justify-between w-full rounded-full shadow-sm px-4 py-2 text-gray-800 font-medium border border-gray-600 bg-transperant hover:bg-gray-50 cursor-pointer">
                      <Text variant="md">Beamer Exchange</Text>
                      <IconExternalLink className="w-6 h-6 hover:text-gray-800 text-gray-600 dark:text-dark-gray-200 dark:hover:text-green-300 cursor-pointer" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="p-6">
              <Button className="w-full rounded-full" size="md" variant="default">Bridge</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="hidden lg:flex justify-center items-center m-auto w-5/12">
          <h1 className="text-3xl md:text-5xl font-bold font-montserrat whitespace-nowrap">
            Connect to a <span className="text-green-300">New <br />
              World</span> of dApps
          </h1>
        </div>
      </div>
    </div>
  )
}

export default BridgePage