/**
 * useGames.ts
 * Custom hook for fetching games catalog with infinite scroll pagination.
 * Uses React Query's useInfiniteQuery for efficient data fetching, caching, and pagination.
 * Supports search and filtering via query parameters.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  gamesService,
  type GamesQueryParams,
} from "../../../services/games.service";

/**
 * useGames hook
 * Fetches paginated games catalog with infinite scroll support.
 * Automatically handles pagination, caching, and background refetching.
 *
 * @param {Omit<GamesQueryParams, "page">} params - Query parameters (search, platform, limit)
 * @returns {UseInfiniteQueryResult} React Query infinite query result with games data
 *
 * Usage:
 * const { data, fetchNextPage, hasNextPage } = useGames({ limit: 12, search: "zelda" });
 */
export const useGames = (params: Omit<GamesQueryParams, "page"> = {}) => {
  return useInfiniteQuery({
    queryKey: ["games", params], // Cache key includes params for automatic refetch on change
    queryFn: ({ pageParam = 1 }) =>
      gamesService.getCatalog({ ...params, page: pageParam }),
    initialPageParam: 1, // Start from page 1
    getNextPageParam: (lastPage) => {
      // Determine next page number or undefined if no more pages
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
  });
};

// Exported to Home and other pages for games catalog display
