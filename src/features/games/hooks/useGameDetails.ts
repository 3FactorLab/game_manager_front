import { useQuery } from "@tanstack/react-query";
import { gamesService } from "../../../services/games.service";

export const useGameDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => gamesService.getGameById(id!),
    enabled: !!id,
  });
};
