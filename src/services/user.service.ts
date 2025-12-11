/**
 * user.service.ts
 * Service for handling user-related API requests.
 * Provides wishlist management operations using /users endpoints.
 * Alternative to collection.service.ts, used by WishlistContext for optimistic updates.
 */
import apiClient from "./api.client";
import type { Game } from "./games.service";

/**
 * Interface for Wishlist response from backend
 */
export interface WishlistResponse {
  wishlist: Game[]; // Array of games in user's wishlist
}

/**
 * Get user's wishlist
 * Fetches all games in the authenticated user's wishlist.
 * Maps backend structure to frontend Game interface.
 *
 * @returns Promise with array of games in wishlist
 */
export const getWishlist = async (): Promise<Game[]> => {
  const response = await apiClient.get<WishlistResponse>("/users/wishlist");

  // Map backend structure to frontend Game interface
  // Ensures consistent data structure across the application
  return response.data.wishlist.map((game: any) => ({
    ...game,
    assets: game.assets || {
      cover:
        game.image || "https://placehold.co/600x400/101010/FFF?text=No+Cover",
      screenshots: Array.isArray(game.screenshots)
        ? game.screenshots.filter(
            (s: any) => typeof s === "string" && s.startsWith("http")
          )
        : [],
      videos: [],
    },
  }));
};

/**
 * Add game to wishlist
 * Adds a game to the authenticated user's wishlist.
 * Backend returns updated wishlist IDs, but we typically refetch in context.
 *
 * @param gameId - ID of the game to add to wishlist
 * @returns Promise with empty array (context refetches for updated data)
 */
export const addToWishlist = async (gameId: string): Promise<Game[]> => {
  const response = await apiClient.post<{ message: string; wishlist: any[] }>(
    `/users/wishlist/${gameId}`
  );
  // The backend returns IDs in wishlist array, but we might want to refetch or optimist update.
  // Ideally backend should return populated items or we re-fetch.
  // For simplicity, we will re-fetch in the context.
  return [];
};

/**
 * Remove game from wishlist
 * Removes a game from the authenticated user's wishlist.
 * Backend returns updated wishlist IDs, but we typically refetch in context.
 *
 * @param gameId - ID of the game to remove from wishlist
 * @returns Promise with empty array (context refetches for updated data)
 */
export const removeFromWishlist = async (gameId: string): Promise<Game[]> => {
  const response = await apiClient.delete<{ message: string; wishlist: any[] }>(
    `/users/wishlist/${gameId}`
  );
  return [];
};

// Exported to WishlistContext for wishlist management with optimistic updates
