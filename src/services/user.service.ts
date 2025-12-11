/**
 * user.service.ts
 * Service for handling user-related API requests.
 * Provides wishlist management operations using /users endpoints.
 * Alternative to collection.service.ts, used by WishlistContext for optimistic updates.
 */
import apiClient from "./api.client";
import type { Game, BackendGame } from "./games.service";

/**
 * Interface for Wishlist response from backend
 */
export interface WishlistResponse {
  wishlist: BackendGame[]; // Array of games in user's wishlist
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
  return response.data.wishlist.map((game: BackendGame) => ({
    _id: game._id || "",
    title: game.title || "Untitled",
    description: game.description || "",
    price: game.price || 0,
    currency: game.currency || "USD",
    platform: game.platform || "Unknown",
    genre: game.genre || "Unknown",
    type: game.type || "game",
    releaseDate: game.released || game.releaseDate || "",
    developer: game.developer || "Unknown",
    publisher: game.publisher || "Unknown",
    isOffer: !!game.isOffer,
    offerPrice: game.offerPrice,
    assets: game.assets || {
      cover:
        game.image || "https://placehold.co/600x400/101010/FFF?text=No+Cover",
      screenshots: Array.isArray(game.screenshots)
        ? game.screenshots.filter((s) => s.startsWith("http"))
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
 * @returns Promise with void
 */
export const addToWishlist = async (gameId: string): Promise<void> => {
  try {
    await apiClient.post(`/users/wishlist/${gameId}`);
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    throw error;
  }
};

/**
 * Remove game from wishlist (Alternate system)
 * @param gameId - ID of game to remove
 */
export const removeFromWishlist = async (gameId: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/wishlist/${gameId}`);
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    throw error;
  }
};

// Exported to WishlistContext for wishlist management with optimistic updates
