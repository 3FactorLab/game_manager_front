/**
 * @file CatalogControls.test.tsx
 * @description Unit tests for the CatalogControls component.
 * Verifies interaction with search input, filters, and sort controls.
 * Mocks useCatalogUrl to test URL state updates without browser context.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CatalogControls } from "./CatalogControls";

// Mock hooks
const mockSetSearch = vi.fn();
const mockSetFilter = vi.fn();
const mockSetSort = vi.fn();
const mockClearAll = vi.fn();

vi.mock("../hooks/useCatalogUrl", () => ({
  useCatalogUrl: () => ({
    query: "",
    genre: "",
    platform: "",
    sortBy: "releaseDate",
    order: "desc",
    setSearch: mockSetSearch,
    setFilter: mockSetFilter,
    setSort: mockSetSort,
    clearAll: mockClearAll,
  }),
}));

vi.mock("../hooks/useGames", () => ({
  useFilters: () => ({
    data: {
      genres: ["RPG", "Action"],
      platforms: ["PC", "PS5"],
    },
    isLoading: false,
  }),
}));

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const trans: Record<string, string> = {
        "search.placeholder": "Search...",
        "catalog.genre": "Genre",
        "catalog.platform": "Platform",
        "catalog.all": "All",
        "catalog.allPlatforms": "All Platforms",
        "catalog.orderBy": "Order By",
        "catalog.priceLowHigh": "Price: Low-High",
        "catalog.priceHighLow": "Price: High-Low",
        "catalog.nameAZ": "Name: A-Z",
        "catalog.nameZA": "Name: Z-A",
        "catalog.newest": "Newest",
        "catalog.clear": "Clear",
      };
      return trans[key] || key;
    },
  }),
}));

describe("CatalogControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all controls", () => {
    render(<CatalogControls />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Genre")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Order By")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("calls setSearch on search input change", () => {
    render(<CatalogControls />);
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "Zelda" } });

    expect(mockSetSearch).toHaveBeenCalledWith("Zelda");
  });

  it("calls setFilter on genre change", () => {
    render(<CatalogControls />);
    const genreSelect = screen.getAllByRole("combobox")[0]; // Assuming order: Genre, Platform, Sort

    fireEvent.change(genreSelect, { target: { value: "RPG" } });

    expect(mockSetFilter).toHaveBeenCalledWith("genre", "RPG");
  });

  it("calls setFilter on platform change", () => {
    render(<CatalogControls />);
    const platformSelect = screen.getAllByRole("combobox")[1];

    fireEvent.change(platformSelect, { target: { value: "PC" } });

    expect(mockSetFilter).toHaveBeenCalledWith("platform", "PC");
  });

  it("calls setSort on sort change", () => {
    render(<CatalogControls />);
    const sortSelect = screen.getAllByRole("combobox")[2];

    // Test price low to high
    fireEvent.change(sortSelect, { target: { value: "price_asc" } });
    expect(mockSetSort).toHaveBeenCalledWith("price", "asc");

    // Test title A-Z
    fireEvent.change(sortSelect, { target: { value: "title_asc" } });
    expect(mockSetSort).toHaveBeenCalledWith("title", "asc");

    // Test title Z-A
    fireEvent.change(sortSelect, { target: { value: "title_desc" } });
    expect(mockSetSort).toHaveBeenCalledWith("title", "desc");
  });

  it("calls clearAll on reset button click", () => {
    render(<CatalogControls />);
    const clearButton = screen.getByText("Clear");

    fireEvent.click(clearButton);

    expect(mockClearAll).toHaveBeenCalled();
  });
});
