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

export interface DashboardStatsDto {
  revenue: number;
  averageOrderValue: number;
  topSelling: Array<{
    _id: string; // Game ID
    title: string;
    totalSold: number;
    revenue: number;
    unitPrice: number;
  }>;
  monthlyTrends: Array<{
    _id: string; // "YYYY-MM"
    sales: number;
    revenue: number;
    orders: number;
  }>;
  platforms: Array<{ name: string; count: number }>;
  genres: Array<{ name: string; count: number }>;
  libraryStats: Array<{ title: string; count: number }>;
}

interface BackendStatsResponse {
  kpis: {
    totalUsers: number;
    totalGames: number;
    totalOrders: number;
    totalRevenue: number;
  };
  topGames: Array<{ title: string; revenue: number; sales: number }>;
  platforms: Array<{ name: string; count: number }>;
  salesTrend: Array<{ date: string; sales: number; orders: number }>;
  libraryStats: Array<{ title: string; count: number }>;
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
    const { data } = await apiClient.get<BackendStatsResponse>(
      "/stats/dashboard"
    );

    // Adapt Backend Response to Frontend DTO
    return {
      revenue: data.kpis.totalRevenue,
      averageOrderValue:
        data.kpis.totalOrders > 0
          ? data.kpis.totalRevenue / data.kpis.totalOrders
          : 0,
      topSelling: data.topGames.map((g) => ({
        _id: g.title,
        title: g.title,
        totalSold: g.sales,
        revenue: g.revenue,
        unitPrice: g.sales > 0 ? g.revenue / g.sales : 0,
      })),
      monthlyTrends: data.salesTrend.map((t) => ({
        _id: t.date,
        sales: t.sales,
        revenue: t.sales,
        orders: t.orders,
      })),
      platforms: data.platforms || [],
      genres: [], // Not provided by backend yet
      libraryStats: data.libraryStats || [],
    };
  },
};
