import apiClient from "./api.client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../features/auth/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/users/login",
      credentials
    );
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/users/register",
      credentials
    );
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    // Optionally call backend to invalidate token if needed
    localStorage.removeItem("token");
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/profile");
    return data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
