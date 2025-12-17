/**
 * stats.service.ts
 * Service for fetching global application statistics.
 * Consumed by Home Page (Public) and Admin Dashboard (Protected).
 */
import apiClient from "./api.client";

/**
 * PublicStatsDto
 * Metrics visible to all users.
 */
export interface PublicStatsDto {
  totalUsers: number;
  totalGames: number;
  totalCollections: number;
}

/**
 * DashboardStatsDto
 * Financial and operational metrics (Admin Only).
 */
export interface DashboardStatsDto {
  revenue: number;
  topSelling: Array<{
    _id: string; // Game ID
    title: string;
    totalSold: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    _id: string; // "YYYY-MM"
    sales: number;
    revenue: number;
  }>;
}

export const statsService = {
  /**
   * getGlobalStats (Public)
   * Fetches the total count of users, games, and collections.
   */
  async getGlobalStats(): Promise<PublicStatsDto> {
    const { data } = await apiClient.get<PublicStatsDto>("/stats/public");
    return data;
  },

  /**
   * getDashboardStats (Admin)
   * Fetches real-time financial KPIs (Revenue, Top Selling, Trends).
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const { data } = await apiClient.get<DashboardStatsDto>("/stats/dashboard");
    return data;
  },
};
