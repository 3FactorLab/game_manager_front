import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { AuthProvider } from "../AuthContext";

// We need to mock useNavigae since it's used in the component
const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("LoginPage", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /nav.login/i })
    ).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /nav.login/i });
    fireEvent.click(submitBtn);

    // Zod validation should trigger. Using findByText because it's async
    expect(
      await screen.findByText("Invalid email address")
    ).toBeInTheDocument();
  });
});
