import apiClient from "./api.client";
import type { Game } from "./games.service";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export const adminService = {
  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users (Admin only)
   * Endpoint: GET /api/users?page=1&limit=20
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedUsers> {
    const { data } = await apiClient.get<PaginatedUsers>("/users", {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Delete a user (Admin only)
   * Endpoint: DELETE /api/users/:id
   * Note: Backend cascade deletes UserGames, Orders, and RefreshTokens
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  },

  // ==================== GAME MANAGEMENT ====================

  /**
   * Create a new game manually (Admin only)
   * Endpoint: POST /api/games
   */
  async createGame(gameData: FormData): Promise<Game> {
    const { data } = await apiClient.post<Game>("/games", gameData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  /**
   * Update an existing game (Admin only)
   * Endpoint: PUT /api/games/:id
   */
  async updateGame(gameId: string, gameData: FormData): Promise<Game> {
    const { data } = await apiClient.put<Game>(`/games/${gameId}`, gameData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  /**
   * Delete a game (Admin only)
   * Endpoint: DELETE /api/games/:id
   * Note: Backend cascade deletes from all user collections
   */
  async deleteGame(gameId: string): Promise<void> {
    await apiClient.delete(`/games/${gameId}`);
  },

  /**
   * Search games in RAWG database (Admin only)
   * Endpoint: GET /api/games/search?q=query
   */
  async searchRAWG(query: string): Promise<any[]> {
    const { data } = await apiClient.get("/games/search", {
      params: { q: query },
    });
    return data;
  },

  /**
   * Import a game from RAWG (Admin only)
   * Endpoint: POST /api/games/from-rawg
   */
  async importFromRAWG(rawgId: number, steamAppId?: number): Promise<Game> {
    const { data } = await apiClient.post<Game>("/games/from-rawg", {
      rawgId,
      steamAppId,
    });
    return data;
  },
};
