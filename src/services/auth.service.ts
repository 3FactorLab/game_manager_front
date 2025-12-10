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
export const authService = {
  /**
   * Login user with credentials
   * Sends credentials to backend and stores JWT token on success
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
    }
    return data;
  },

  /**
   * Logout current user
   * Removes JWT token and refresh token from localStorage
   * Note: Backend token invalidation could be added here if needed
   */
  async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Get current user profile
   * Fetches authenticated user data from backend
   * @returns {Promise<User>} Current user profile data
   */
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/profile");
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
};

// Exported to AuthContext and other components for authentication operations
