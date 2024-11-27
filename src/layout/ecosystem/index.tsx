import { Card, CardContent, Text } from '@/components/ui';
import { useFetchData } from '@/hooks/useFetchData';
import { DATA_URL_ECOSYSTEM_LIST, DATA_URL_TRADE_ASSET } from '@/utils/constant';
import { ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

const EcosystemPage = () => {
  const dataUrl = DATA_URL_ECOSYSTEM_LIST;

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
        <div className="flex flex-col gap-5 items-center justify-center p-5 mx-auto w-full md:w-10/12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {data?.map((appItem: any, index: any) => (
              <Card key={index} className="shadow-lg rounded-xl">
                <CardContent className="p-6 flex flex-col items-center gap-1">
                  <img
                    src={`${DATA_URL_TRADE_ASSET}${appItem.icon.dark}`}
                    alt={appItem.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <a
                    href={appItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                  >

                    <Text variant="md" fontWeight="medium" className="flex items-center gap-2">{appItem.name}
                      <ExternalLinkIcon className="h-4 w-4 fill-gray-800 dark:fill-dark-gray-50" />
                    </Text>
                  </a>
                  <Text
                    variant="xs"
                    fontWeight="light"
                    className="text-gray-800 dark:text-dark-gray-50 flex items-center"
                  >
                    {appItem.description}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );


  if (isLoading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading data</div>;

  return (
    <div className="container">
      <div className="flex gap-5 items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {data?.map((exchange: any, index: any) => (
            <Card key={index} className="shadow-lg rounded-xl">
              <CardContent className="p-6 flex flex-col items-center gap-1">
                <img src={`${DATA_URL_TRADE_ASSET}${exchange.icon.light}`} alt={exchange.name}
                  className="w-16 h-16 rounded-full mb-4"
                />
                <Text variant="md" fontWeight="medium">{exchange.name}</Text>
                <Text variant="xs" fontWeight="light" className="text-gray-800 dark:text-dark-gray-50 flex items-center">
                  {exchange.pairName}
                </Text>
                <a
                  href={exchange.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline cursor-pointer"
                >
                  <Text variant="sm" fontWeight="light" className="text-gray-800 dark:text-dark-gray-50 flex items-center">
                    Visit Site <ChevronRightIcon className="h-4 w-4 fill-gray-800 dark:fill-dark-gray-50" />
                  </Text>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}




export default EcosystemPage