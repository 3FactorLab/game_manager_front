/**
 * auth.service.ts
 * Authentication service handling user login, registration, and profile management.
 * Manages JWT token storage in localStorage and communicates with backend auth endpoints.
 * All methods use the configured apiClient for HTTP requests.
 */

import apiClient from "./api.client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../features/auth/types";

/**
 * Authentication service
 * Provides methods for user authentication and profile management
 */
// Key for storing user data in localStorage
const USER_STORAGE_KEY = "game_manager_user";

export const authService = {
  /**
   * Login user with credentials
   * by sending credentials to backend and storing JWT token on success
   * @param {LoginCredentials} credentials - User email and password
   * @returns {Promise<AuthResponse>} Auth response with user data and token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/users/login",
      credentials
    );
    if (data.token) {
      localStorage.setItem("token", data.token); // Store JWT for future requests
      localStorage.setItem("refreshToken", data.refreshToken); // Store refresh token
      console.log("[DEBUG_AUTH] Login: Saving user to LS", data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user)); // Store user data
    }
    return data;
  },

  /**
   * Register new user account
   * Creates new account and automatically logs in user on success
   * @param {RegisterCredentials} credentials - User registration data
   * @returns {Promise<AuthResponse>} Auth response with user data and token
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/users/register",
      credentials
    );
    if (data.token) {
      localStorage.setItem("token", data.token); // Auto-login after registration
      localStorage.setItem("refreshToken", data.refreshToken); // Store refresh token
      console.log("[DEBUG_AUTH] Register: Saving user to LS", data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user)); // Store user data
    }
    return data;
  },

  /**
   * Logout current user
   * Removes JWT token, refresh token, and user data from localStorage
   */
  async logout(): Promise<void> {
    console.log("[DEBUG_AUTH] Logout: Clearing LS");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Get current user profile
   * Fetches authenticated user data from backend
   * @returns {Promise<User>} Current user profile data
   */
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/profile");
    console.log("[DEBUG_AUTH] getProfile: Updating stored user", data);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data)); // Update stored user
    return data;
  },

  /**
   * Update user profile
   * Uploads profile data including avatar image using multipart/form-data
   * @param {FormData} formData - Form data with profile fields and optional avatar file
   * @returns {Promise<User>} Updated user profile data
   */
  async updateProfile(formData: FormData): Promise<User> {
    const { data } = await apiClient.put<{ message: string; user: User }>(
      "/users/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      }
    );
    console.log("[DEBUG_AUTH] updateProfile: Updating stored user", data.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user)); // Update stored user
    return data.user;
  },

  /**
   * Refresh access token using refresh token
   * Calls backend refresh endpoint to get new token pair
   * @returns {Promise<AuthResponse>} New tokens and user data
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const { data } = await apiClient.post<AuthResponse>(
      "/users/refresh-token",
      { token: refreshToken }
    );

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Note: Refresh token endpoint might not return the full user object depending on backend implementation.
      // If it does, we should update it. If not, we keep the existing one.
      if (data.user) {
        console.log(
          "[DEBUG_AUTH] refreshToken: Updating stored user",
          data.user
        );
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
    }

    return data;
  },

  /**
   * Check if user is authenticated
   * Checks for presence of JWT token in localStorage
   * @returns {boolean} True if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  /**
   * Get stored user from localStorage
   * Used for initializing auth state without waiting for network
   * @returns {User | null} Stored user or null
   */
  getStoredUser(): User | null {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    // console.log("[DEBUG_AUTH] Reading stored user raw:", storedUser);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      console.error("[DEBUG_AUTH] Failed to parse stored user");
      return null;
    }
  },
};

// Exported to AuthContext and other components for authentication operations
