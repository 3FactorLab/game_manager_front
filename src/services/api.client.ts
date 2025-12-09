import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies if we use them, or just good practice
});

// Request Interceptor: Attach Token
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

// Response Interceptor: Handle 401 Refresh logic (Simplified for now)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Here we would call the refresh token endpoint
        // const { data } = await apiClient.post('/users/refresh-token');
        // localStorage.setItem('token', data.token);
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        // return apiClient(originalRequest);

        // For now, just logout or reject
        // localStorage.removeItem('token');
        // window.location.href = '/login';

        return Promise.reject(error);
      } catch (refreshError) {
        // Handle refresh failure (logout user)
        localStorage.removeItem("token");
        // window.location.href = '/login'; // Optional: Redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
