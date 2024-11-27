import { useQuery } from '@tanstack/react-query';

export const useFetchData = (url: string) => {
  return useQuery({
    queryKey: ['fetchGitData'],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  })
};