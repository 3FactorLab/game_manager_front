/**
 * CheckoutPage.test.tsx
 * Integration tests for the Checkout flow.
 * Verifies that the checkout page renders games and processes purchases via the service.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CheckoutPage from "./CheckoutPage";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock Hooks
const mockUseCart = vi.fn();
const mockUseCheckout = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

vi.mock("../features/cart/CartContext", () => ({
  useCart: () => mockUseCart(),
}));

vi.mock("../features/checkout/hooks/useCheckout", () => ({
  useCheckout: () => mockUseCheckout(),
}));

const mockUseGameDetails = vi.fn();
vi.mock("../features/games/hooks/useGameDetails", () => ({
  useGameDetails: (id: string) => mockUseGameDetails(id),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameDetails.mockReturnValue({ data: null, isLoading: false });
  });

  it("renders empty state when cart is empty", () => {
    mockUseCart.mockReturnValue({
      items: [],
      total: 0,
      clear: vi.fn(),
    });
    mockUseCheckout.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it("renders games and total amount", () => {
    mockUseCart.mockReturnValue({
      items: [
        { _id: "1", title: "Game 1", price: 10, image: "img1.jpg" },
        { _id: "2", title: "Game 2", price: 20, image: "img2.jpg" },
      ],
      total: 30,
    });
    mockUseCheckout.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Game 1")).toBeInTheDocument();
    expect(screen.getByText("Game 2")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();
  });

  it("calls processCheckout when Buy Now is clicked", async () => {
    const processCheckoutMock = vi.fn();
    mockUseCart.mockReturnValue({
      items: [{ _id: "1", title: "Game 1", price: 10 }],
      total: 10,
      clear: vi.fn(),
    });
    mockUseCheckout.mockReturnValue({
      mutate: processCheckoutMock,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const buyBtn = screen.getByRole("button", { name: /Confirm Purchase/i });
    fireEvent.click(buyBtn);

    expect(processCheckoutMock).toHaveBeenCalled();
  });
});
