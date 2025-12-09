import apiClient from "../../../services/api.client";
import type { Game } from "../../../services/games.service";

export interface CollectionItem {
  _id: string;
  game: Game;
  user: string;
  status: "playing" | "completed" | "backlog" | "dropped";
  score?: number;
  notes?: string;
  addedAt: string;
}

export const collectionService = {
  async getLibrary(): Promise<CollectionItem[]> {
    const { data } = await apiClient.get<CollectionItem[]>("/collection");
    return data;
  },

  async updateStatus(
    id: string,
    status: CollectionItem["status"]
  ): Promise<CollectionItem> {
    const { data } = await apiClient.put<CollectionItem>(
      `/collection/${id}/status`,
      { status }
    );
    return data;
  },

  // Simulate Wishlist for now as it wasn't explicitly detailed in backend
  async getWishlist(): Promise<Game[]> {
    // Assuming backend supports query param or separate endpoint
    const { data } = await apiClient.get<Game[]>("/collection/wishlist");
    return data;
  },

  async addToWishlist(gameId: string): Promise<void> {
    await apiClient.post("/collection/wishlist", { gameId });
  },

  async removeFromWishlist(gameId: string): Promise<void> {
    await apiClient.delete(`/collection/wishlist/${gameId}`);
  },
};
