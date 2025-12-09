import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";

/**
 * Hook to fetch all users (Admin only)
 * Supports pagination
 */
export const useUsers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: () => adminService.getAllUsers(page, limit),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to delete a user (Admin only)
 * Invalidates users query on success
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

/**
 * Hook to create a game (Admin only)
 * Invalidates games catalog on success
 */
export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameData: FormData) => adminService.createGame(gameData),
    onSuccess: () => {
      // Invalidate games catalog
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

/**
 * Hook to update a game (Admin only)
 * Invalidates games catalog on success
 */
export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gameId,
      gameData,
    }: {
      gameId: string;
      gameData: FormData;
    }) => adminService.updateGame(gameId, gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

/**
 * Hook to delete a game (Admin only)
 * Invalidates games catalog on success
 */
export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: string) => adminService.deleteGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

/**
 * Hook to search RAWG database (Admin only)
 */
export const useSearchRAWG = (query: string) => {
  return useQuery({
    queryKey: ["admin", "rawg-search", query],
    queryFn: () => adminService.searchRAWG(query),
    enabled: query.length > 2, // Only search if query has 3+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to import game from RAWG (Admin only)
 * Invalidates games catalog on success
 */
export const useImportFromRAWG = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rawgId,
      steamAppId,
    }: {
      rawgId: number;
      steamAppId?: number;
    }) => adminService.importFromRAWG(rawgId, steamAppId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};
