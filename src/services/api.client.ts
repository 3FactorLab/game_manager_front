/**
 * api.client.ts
 * Axios HTTP client configuration for API communication.
 * Handles automatic token injection, request/response interceptors,
 * and 401 unauthorized error handling with automatic logout.
 *
 * Base URL: /api (proxied by Vite dev server to backend)
 */

import axios from "axios";
import { authEvents, AUTH_LOGOUT } from "../utils/auth-events";

/**
 * Configured axios instance for API requests
 * - Automatically includes JWT token in Authorization header
 * - Handles 401 errors by logging out user
 * - Sends credentials (cookies) with requests
 */
const apiClient = axios.create({
  baseURL: "/api", // Proxied to backend server
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Request Interceptor
 * Automatically attaches JWT token from localStorage to all requests
 * Token is added to Authorization header as Bearer token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized errors by attempting to refresh the access token.
 *
 * Flow:
 * 1. If 401 error and not already retried, attempt token refresh
 * 2. Get refresh token from localStorage
 * 3. Call /users/refresh-token endpoint
 * 4. Store new tokens
 * 5. Retry original request with new access token
 * 6. If refresh fails or no refresh token, logout user
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (invalid/expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      const refreshToken = localStorage.getItem("refreshToken");

      // No refresh token available, logout user
      if (!refreshToken) {
        localStorage.removeItem("token");
        // Soft logout instead of hard reload
        authEvents.emit(AUTH_LOGOUT);
        // window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the access token
        console.log("[Auth] Access token expired, attempting refresh...");
        const { data } = await axios.post("/api/users/refresh-token", {
          token: refreshToken,
        });

        // Store new tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("[Auth] Token refreshed successfully");

        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user and redirect to login
        console.error("[Auth] Token refresh failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // Soft logout instead of hard reload
        authEvents.emit(AUTH_LOGOUT);
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Exported to all service files for API communication
export default apiClient;
