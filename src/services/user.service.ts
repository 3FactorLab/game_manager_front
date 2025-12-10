/**
 * user.service.ts
 * Service for handling user-related API requests.
 */
import apiClient from "./api.client";
import type { Game } from "./games.service";

/**
 * Interface for Wishlist response
 */
export interface WishlistResponse {
    wishlist: Game[];
}

/**
 * Get user's wishlist
 * @returns Promise with array of games
 */
export const getWishlist = async (): Promise<Game[]> => {
    const response = await apiClient.get<WishlistResponse>("/users/wishlist");
    // Map backend structure to frontend Game interface
    return response.data.wishlist.map((game: any) => ({
        ...game,
        assets: game.assets || {
            cover: game.image || "https://placehold.co/600x400/101010/FFF?text=No+Cover",
            screenshots: Array.isArray(game.screenshots)
                ? game.screenshots.filter((s: any) => typeof s === "string" && s.startsWith("http"))
                : [],
            videos: [],
        },
    }));
};

/**
 * Add game to wishlist
 * @param gameId - ID of the game to add
 * @returns Promise with success message and updated wishlist
 */
export const addToWishlist = async (gameId: string): Promise<Game[]> => {
    const response = await apiClient.post<{ message: string; wishlist: any[] }>(`/users/wishlist/${gameId}`);
    // The backend returns IDs in wishlist array, but we might want to refetch or optimist update.
    // Ideally backend should return populated items or we re-fetch.
    // For simplicity, we will re-fetch in the context.
    return [];
};

/**
 * Remove game from wishlist
 * @param gameId - ID of the game to remove
 * @returns Promise with success message and updated wishlist
 */
export const removeFromWishlist = async (gameId: string): Promise<Game[]> => {
    const response = await apiClient.delete<{ message: string; wishlist: any[] }>(`/users/wishlist/${gameId}`);
    return [];
};
