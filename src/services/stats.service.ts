/**
 * stats.service.ts
 * Service for fetching global application statistics.
 * Consumed by the Home Page to display platform metrics.
 */
import apiClient from "./api.client";

/**
 * StatsResponseDto
 * Matches the backend DTO for global stats.
 */
export interface StatsResponseDto {
  totalUsers: number;
  totalGames: number;
  totalCollections: number;
}

export const statsService = {
  /**
   * getGlobalStats
   * Fetches the total count of users, games, and collections.
   *
   * @returns {Promise<StatsResponseDto>}
   */
  async getGlobalStats(): Promise<StatsResponseDto> {
    const { data } = await apiClient.get<StatsResponseDto>("/stats/public");
    return data;
  },
};
