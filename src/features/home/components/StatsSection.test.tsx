import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatsSection } from "./StatsSection";

import { gamesService } from "../../../services/games.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock IntersectionObserver for Framer Motion 'whileInView'
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock React Icons to avoid rendering huge SVGs
vi.mock("react-icons/fa", () => ({
  FaGamepad: () => <span data-testid="icon-gamepad" />,
  FaUsers: () => <span data-testid="icon-users" />,
  FaLayerGroup: () => <span data-testid="icon-collections" />,
  FaCode: () => <span data-testid="icon-code" />,
  FaBan: () => <span data-testid="icon-ban" />,
}));

// Mock Translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Return a predictable string for assertions
      const translations: Record<string, string> = {
        "home.stats.games": "Games Available",
        "home.stats.users": "Active Gamers",
        "home.stats.collections": "Collections Created",
        "home.stats.open_source": "100% Open Source",
        "home.stats.trusted": "Trusted Platform",
        "home.stats.no_ads": "Zero Ads",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock gamesService
vi.mock("../../../services/games.service", () => ({
  gamesService: {
    getCatalog: vi.fn(),
  },
}));

// Helper to render with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("StatsSection Component", () => {
  it("renders static stats and value props correctly", () => {
    // Mock getCatalog to return distinct results
    (gamesService.getCatalog as any).mockResolvedValue({
      data: [],
      pagination: { total: 0 },
    });

    render(<StatsSection />, { wrapper: createWrapper() });

    // Check Static Counters
    expect(screen.getByText("Active Gamers")).toBeInTheDocument();
    expect(screen.getByText("50k+")).toBeInTheDocument();

    expect(screen.getByText("Collections Created")).toBeInTheDocument();
    expect(screen.getByText("120k+")).toBeInTheDocument();

    // Check Value Props
    expect(screen.getByText("100% Open Source")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();

    expect(screen.getByText("Trusted Platform")).toBeInTheDocument();
    expect(screen.getByText("Zero Ads")).toBeInTheDocument();
  });

  it("fetches and displays dynamic game count from backend", async () => {
    // Mock successful 15000 games
    (gamesService.getCatalog as any).mockResolvedValue({
      data: [],
      pagination: { total: 15432, pages: 100, page: 1, limit: 1 },
    });

    render(<StatsSection />, { wrapper: createWrapper() });

    // Should detect "Games Available" label
    expect(screen.getByText("Games Available")).toBeInTheDocument();

    // Should eventually display the number 15432
    await waitFor(() => {
      expect(screen.getByText("15432")).toBeInTheDocument();
    });
  });

  it("displays loading placeholder while fetching", async () => {
    // Mock a pending promise
    (gamesService.getCatalog as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<StatsSection />, { wrapper: createWrapper() });

    // Should show "..." initially
    expect(screen.getByText("...")).toBeInTheDocument();
  });
});
