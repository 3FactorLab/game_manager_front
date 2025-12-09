import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (Data is fresh for 5 mins)
      gcTime: 1000 * 60 * 30, // 30 minutes (Cache garbage collection)
      retry: 1,
      refetchOnWindowFocus: false, // Prevent aggressive refetching
    },
  },
});
