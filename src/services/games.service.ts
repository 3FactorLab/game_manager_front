/**
 * games.service.ts
 * Service for fetching games catalog and individual game details.
 * Handles data transformation between backend response format and frontend interfaces.
 * Maps backend fields (e.g., 'released') to frontend fields (e.g., 'releaseDate').
 */

import apiClient from "./api.client";

/**
 * Game interface
 * Represents a game entity with all its properties
 */

export interface Game {
  _id: string;
  externalId?: number; // RAWG ID
  title: string;
  description: string;
  price: number;
  currency: string;
  platforms: string[];
  genre: string; // e.g., "Action RPG", "FPS", "Platformer"
  type: "game" | "dlc" | "bundle";
  releaseDate: string;
  developer: string;
  publisher: string;
  isOffer: boolean;
  offerPrice?: number;
  assets?: {
    cover: string;
    screenshots: string[];
    videos: string[];
  };
  onSale?: boolean;
  originalPrice?: number;
  score?: number;
  metacritic?: number;
  image?: string; // Fallback for backend compatibility
  isExternal?: boolean; // New Flag for Unified Search
  rawgId?: number; // New Flag for Import
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface GamesQueryParams {
  page?: number;
  limit?: number;
  query?: string; // Changed from 'search' to match backend
  genre?: string;
  platform?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  onSale?: boolean;
  maxPrice?: number;
  developer?: string;
  publisher?: string;
}

export interface BackendGame extends Partial<Omit<Game, "assets">> {
  platforms?: string[];
  platform?: string; // Legacy support
  assets?: Game["assets"];
  image?: string;
  screenshots?: string[];
  released?: string; // Some endpoints use 'released' instead of 'releaseDate'
}

export const gamesService = {
  // Public Endpoint: Fetch catalog
  async getCatalog(params: GamesQueryParams): Promise<PaginatedResponse<Game>> {
    // Backend response structure
    interface BackendResponse {
      games: BackendGame[];
      total: number;
      totalPages: number;
      page: number;
    }

    const { data: rawData } = await apiClient.get<BackendResponse>(
      "/public/games",
      {
        params,
      }
    );

    // Map Backend Response (games, total, page...) to Frontend Interface (data, pagination)
    return {
      data: (rawData.games || []).map((game) => ({
        ...game,
        _id: game._id || "",
        title: game.title || "Untitled",
        description: game.description || "",
        price: game.price || 0,
        currency: game.currency || "USD",
        platforms:
          game.platforms || (game.platform ? [game.platform] : ["Unknown"]),
        genre: game.genre || "Unknown",
        type: game.type || "game",
        releaseDate: game.released || game.releaseDate || "",
        developer: game.developer || "Unknown",
        publisher: game.publisher || "Unknown",
        isOffer: !!game.isOffer,
        assets: game.assets || {
          cover:
            game.image ||
            "https://placehold.co/600x400/101010/FFF?text=No+Cover",
          screenshots: Array.isArray(game.screenshots)
            ? game.screenshots.filter((s) => s.startsWith("http"))
            : [],
          videos: [],
        },
      })),
      pagination: {
        total: rawData.total || 0,
        pages: rawData.totalPages || 0,
        page: rawData.page || 1,
        limit: params.limit || 12,
      },
    };
  },

  // Public Endpoint: Fetch single game
  async getGameById(id: string): Promise<Game> {
    interface BackendGame extends Omit<Game, "assets" | "releaseDate"> {
      assets?: Game["assets"];
      releaseDate?: string;
      released?: string;
      image?: string;
      screenshots?: string[];
    }

    const { data: rawGame } = await apiClient.get<BackendGame>(
      `/public/games/${id}`
    );

    // Map backend structure to frontend interface
    return {
      ...rawGame,
      releaseDate: rawGame.released || rawGame.releaseDate || "", // Backend uses 'released'
      assets: rawGame.assets || {
        cover:
          rawGame.image ||
          "https://placehold.co/600x400/101010/FFF?text=No+Cover",
        screenshots: Array.isArray(rawGame.screenshots)
          ? rawGame.screenshots.filter(
              (s) => typeof s === "string" && s.startsWith("http")
            )
          : [],
        videos: [],
      },
    };
  },

  // Public: Get filters
  async getFilters(): Promise<{ genres: string[]; platforms: string[] }> {
    const { data } = await apiClient.get<{
      genres: string[];
      platforms: string[];
    }>("/public/games/filters");
  },

  // Unified Search (Local + Remote)
  async searchUnified(
    params: GamesQueryParams | string
  ): Promise<PaginatedResponse<Game>> {
    // Handle overload: if string, treat as query
    const queryParams: any =
      typeof params === "string" ? { query: params } : params;

    // Build query with filters
    const searchParams = new URLSearchParams();
    if (queryParams.query) searchParams.append("q", queryParams.query);
    if (queryParams.genre) searchParams.append("genre", queryParams.genre);
    if (queryParams.platform)
      searchParams.append("platform", queryParams.platform);
    if (queryParams.developer)
      searchParams.append("developer", queryParams.developer);

    const { data } = await apiClient.get<any>(
      `/discovery?${searchParams.toString()}`
    );

    // Map Unified Result to Game Interface
    const games: Game[] = data.results.map((r: any) => ({
      _id: r._id,
      title: r.title,
      image: r.image,
      assets: {
        cover: r.image,
        screenshots: [],
        videos: [],
      },
      price: r.price || 0,
      currency: r.currency || "USD",
      isExternal: r.isExternal,
      rawgId: r.rawgId,
      platforms: r.platforms || ["Unknown"],

      genre: r.genre || "Unknown",
      type: "game",
      releaseDate: "",
      developer: r.developer || "",
      publisher: r.publisher || "",
      publisher: r.publisher || "",
      score: r.stats?.score, // [FIX] Map score
      metacritic: r.stats?.rating, // [FIX] Map metacritic
      isOffer: false,
    }));

    return {
      data: games,
      pagination: {
        total: games.length,
        pages: 1,
        page: 1,
        limit: games.length,
      },
    };
  },
};
