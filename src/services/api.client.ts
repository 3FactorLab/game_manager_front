/**
 * api.client.ts
 * Axios HTTP client configuration for API communication.
 * Handles automatic token injection, request/response interceptors,
 * and 401 unauthorized error handling with automatic logout.
 *
 * Base URL: /api (proxied by Vite dev server to backend)
 */

import axios from "axios";

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
 * Handles 401 Unauthorized errors by:
 * 1. Removing invalid token from localStorage
 * 2. Redirecting user to login page
 *
 * Note: Token refresh logic is not implemented yet.
 * If backend supports refresh tokens, implement here.
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

      // TODO: Implement token refresh logic if backend supports it
      // For now, just logout user and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Exported to all service files for API communication
export default apiClient;
