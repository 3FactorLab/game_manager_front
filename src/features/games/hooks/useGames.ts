import { useInfiniteQuery } from "@tanstack/react-query";
import {
  gamesService,
  type GamesQueryParams,
} from "../../../services/games.service";

export const useGames = (params: Omit<GamesQueryParams, "page"> = {}) => {
  return useInfiniteQuery({
    queryKey: ["games", params],
    queryFn: ({ pageParam = 1 }) =>
      gamesService.getCatalog({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
  });
};
