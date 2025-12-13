/**
 * @file WishlistContext.test.tsx
 * @description Unit tests for WishlistContext verifying optimistic updates, API integration, and error handling.
 * Ensures consistent state between UI and Backend.
 */

import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WishlistProvider, useWishlist } from "./WishlistContext";
import * as userService from "../../services/user.service";
import * as authContext from "../auth/AuthContext";
import type { User } from "../auth/types";
import type { Game } from "../../services/games.service";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

// Mock User Service
vi.mock("../../services/user.service", () => ({
  getWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}));

// Mock Auth Context usage
vi.mock("../auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock Toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGame: Game = {
  _id: "game-1",
  title: "Elden Ring",
  price: 59.99,
  currency: "USD",
  description: "Best game",
  platform: "PC",
  genre: "RPG",
  type: "game",
  releaseDate: "2022-02-25",
  developer: "FromSoftware",
  publisher: "Bandai Namco",
  isOffer: false,
};

// Test Component
const TestComponent = () => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  return (
    <div>
      <div data-testid="count">{wishlist.length}</div>
      <div data-testid="is-in-wishlist">
        {isInWishlist("game-1") ? "Yes" : "No"}
      </div>
      <button onClick={() => addToWishlist(mockGame)}>Add</button>
      <button onClick={() => removeFromWishlist("game-1")}>Remove</button>
      <ul>
        {wishlist.map((g) => (
          <li key={g._id}>{g.title}</li>
        ))}
      </ul>
    </div>
  );
};

describe("WishlistContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty wishlist if not authenticated", async () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(userService.getWishlist).not.toHaveBeenCalled();
  });

  it("should fetch wishlist on mount if authenticated", async () => {
    const mockUser: User = {
      _id: "1",
      email: "test",
      username: "test",
      role: "user",
      createdAt: "2023-01-01",
    };

    vi.mocked(authContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(userService.getWishlist).mockResolvedValue([mockGame]);

    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });
    expect(screen.getByText("Elden Ring")).toBeInTheDocument();
  });

  it("should handle optimistic updates when adding items", async () => {
    const mockUser: User = {
      _id: "1",
      email: "test",
      username: "test",
      role: "user",
      createdAt: "2023-01-01",
    };

    vi.mocked(authContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshUser: vi.fn(),
    });

    // Initial fetch empty
    vi.mocked(userService.getWishlist).mockResolvedValue([]);
    // API Call pending to simulate optimistic update
    let resolveApi: any;
    const apiPromise = new Promise<void>((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(userService.addToWishlist).mockReturnValue(apiPromise);

    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    // Wait for initial fetch to complete to avoid race condition
    await waitFor(() => {
      expect(userService.getWishlist).toHaveBeenCalled();
    });

    // Initial state
    expect(screen.getByTestId("count")).toHaveTextContent("0");

    // Click Add
    const addButton = screen.getByText("Add");
    await act(async () => {
      addButton.click();
    });

    // OPTIMISTIC: Should generally show 1 immediately (although React state update is async, inside act it flushes)
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("is-in-wishlist")).toHaveTextContent("Yes");

    // Resolve API
    await act(async () => {
      resolveApi();
    });

    // Should still be 1
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(userService.addToWishlist).toHaveBeenCalledWith("game-1");
  });

  it("should rollback optimistic update on API failure", async () => {
    const mockUser: User = {
      _id: "1",
      email: "test",
      username: "test",
      role: "user",
      createdAt: "2023-01-01",
    };

    vi.mocked(authContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(userService.getWishlist).mockResolvedValue([]);
    vi.mocked(userService.addToWishlist).mockRejectedValue(
      new Error("API Error")
    );

    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    // Click Add
    const addButton = screen.getByText("Add");
    await act(async () => {
      addButton.click();
    });

    // Initial Optimistic Update (might flicker, but error handling handles rollback)
    // Wait for rollback
    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
  });
});
