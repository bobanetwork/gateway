import { Card, CardContent, Text } from '@/components/ui';
import { useFetchData } from '@/hooks/useFetchData';
import { DATA_URL_TRADE_ASSET, DATA_URL_TRADE_LIST } from '@/utils/constant';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const TradePage = () => {
  const dataUrl = DATA_URL_TRADE_LIST;

  const { isLoading, error, data } = useFetchData(dataUrl);

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
          <div className="spinner border-4 border-gray-300 border-t-green-500 rounded-full w-16 h-16 animate-spin"></div>
          <p className="text-gray-500">Loading data, please wait...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-1 md:p-5 mx-auto w-full md:w-10/12">
          <p className="text-red-500 text-lg font-medium">Error loading data, please try later!</p>
        </div>
      ) : (
            <div className="flex flex-col gap-5 items-center justify-center p-5 mx-auto w-full lg:w-10/12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-12">
            {data?.map((exchange: any, index: any) => (
              <Card key={index} className="shadow-lg rounded-xl">
                <CardContent className="p-6 flex flex-col items-center gap-1">
                  <img
                    src={`${DATA_URL_TRADE_ASSET}${exchange.icon.dark}`}
                    alt={exchange.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <Text variant="md" fontWeight="medium" className="text-center" >{exchange.name}</Text>
                  <Text
                    variant="xs"
                    fontWeight="light"
                    className="text-gray-800 dark:text-dark-gray-50 flex items-center"
                  >
                    {exchange.pairName}
                  </Text>
                  <a
                    href={exchange.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                  >
                    <Text
                      variant="sm"
                      fontWeight="light"
                      className="text-gray-800 dark:text-dark-gray-50 flex items-center"
                    >
                      Visit Site{' '}
                      <ChevronRightIcon className="h-4 w-4 fill-gray-800 dark:fill-dark-gray-50" />
                    </Text>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TradePage