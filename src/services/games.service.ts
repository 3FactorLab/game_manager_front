import apiClient from "./api.client";

export interface Game {
  _id: string;
  externalId?: number; // RAWG ID
  title: string;
  description: string;
  price: number;
  currency: string;
  platform: string;
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
  score?: number;
  metacritic?: number;
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
  search?: string;
  platform?: string;
}

export const gamesService = {
  // Public Endpoint: Fetch catalog
  async getCatalog(params: GamesQueryParams): Promise<PaginatedResponse<Game>> {
    // Define the raw backend response type locally or import it if shared
    const { data: rawData } = await apiClient.get<any>("/public/games", {
      params,
    });

    // Map Backend Response (games, total, page...) to Frontend Interface (data, pagination)
    return {
      data: (rawData.games || []).map((game: any) => ({
        ...game,
        assets: game.assets || {
          cover:
            game.image ||
            "https://placehold.co/600x400/101010/FFF?text=No+Cover",
          screenshots: Array.isArray(game.screenshots)
            ? game.screenshots.filter((s: string) => s.startsWith("http"))
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
    const { data: rawGame } = await apiClient.get<any>(`/public/games/${id}`);

    // Map backend structure to frontend interface
    return {
      ...rawGame,
      releaseDate: rawGame.released || rawGame.releaseDate, // Backend uses 'released'
      assets: rawGame.assets || {
        cover:
          rawGame.image ||
          "https://placehold.co/600x400/101010/FFF?text=No+Cover",
        screenshots: Array.isArray(rawGame.screenshots)
          ? rawGame.screenshots.filter(
              (s: string) => typeof s === "string" && s.startsWith("http")
            )
          : [],
        videos: [],
      },
    };
  },

  // Protected: Fetch my library (User)
  async getMyLibrary(): Promise<Game[]> {
    const { data } = await apiClient.get<Game[]>("/games/library"); // Adjust endpoint based on backend
    return data;
  },
};
