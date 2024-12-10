import { Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Text, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { useFetchData } from '@/hooks/useFetchData';
import { DATA_URL_ECOSYSTEM_LIST, DATA_URL_TRADE_ASSET } from '@/utils/constant';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useDarkMode } from 'usehooks-ts';

const ecoOption = [
  {
    label: "All",
    value: "All"
  },
  {
    label: "Tools",
    value: "Tools"
  },
  {
    label: "Oracles",
    value: "Oracles"
  },
  {
    label: "Decentralized finance",
    value: "Decentralized finance"
  },
  {
    label: "Centralized exchange",
    value: "Centralized exchange"
  },
  {
    label: "Onramp",
    value: "Onramp"
  },
  {
    label: "Bridge",
    value: "Bridge"
  },
  {
    label: "Wallet",
    value: "Wallet"
  },
  {
    label: "NFT",
    value: "NFT"
  },
  {
    label: "Gaming",
    value: "Gaming"
  },
  {
    label: "DAO",
    value: "DAO"
  },
]

const EcosystemPage = () => {
  const dataUrl = DATA_URL_ECOSYSTEM_LIST;
  const [selectedFilter, setSelectedFilter] = useState(ecoOption[0].value)
  const { isDarkMode } = useDarkMode()
  const { isLoading, error, data } = useFetchData(dataUrl);

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
          <div className="spinner border-4 border-gray-300 border-t-green-300 rounded-full w-16 h-16 animate-spin"></div>
          <p className="text-gray-500">Loading data, please wait...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
          <p className="text-red-500 text-lg font-medium">Error loading data, please try later!</p>
        </div>
      ) : (
            <div className="flex flex-col gap-5 items-center justify-center p-5 mx-auto w-full lg:w-10/12">
              <div className="flex items-start justify-start w-full">
                <Select onValueChange={(value) => {
                  setSelectedFilter(value)
                }} defaultValue={selectedFilter} value={selectedFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecoOption.map((option) => <SelectItem value={option.value}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {data.filter((c: any) => selectedFilter === 'All'
                  ? true
                  : c.type.toLowerCase() === selectedFilter.toLowerCase())?.map((appItem: any, index: any) => (
                    <Card key={index} className="shadow-lg rounded-xl">
                      <CardContent className="p-6 flex flex-col items-center gap-1">
                        <img
                          src={`${DATA_URL_TRADE_ASSET}${!isDarkMode ? appItem.icon.dark : appItem.icon.light}`}
                          alt={appItem.name}
                          className="w-16 h-16 rounded-full mb-4"
                        />
                        <a
                          href={appItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline cursor-pointer"
                        >

                          <Text variant="md" fontWeight="medium" className="flex items-center gap-2 text-center">{appItem.name}
                            <ExternalLinkIcon className="h-4 w-4 fill-gray-800 dark:fill-dark-gray-50" />
                          </Text>
                        </a>
                        <Tooltip>
                          <TooltipContent className="w-64" >
                            <Text variant="xs">{appItem.description}</Text>
                          </TooltipContent>
                          <TooltipTrigger >
                            <Text
                              variant="xs"
                              fontWeight="light"
                              className="text-gray-800 dark:text-dark-gray-50 overflow-hidden text-ellipsis h-12 line-clamp-3"
                            >
                              {appItem.description}
                            </Text>
                          </TooltipTrigger>
                        </Tooltip>

                      </CardContent>
                    </Card>
                  ))}
          </div>
        </div>
      )}
    </div>
  );
}




export default EcosystemPage