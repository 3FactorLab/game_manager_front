import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3500",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increased limit for sanity
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "react-icons", "react-hot-toast"],
          "vendor-utils": [
            "axios",
            "date-fns",
            "lodash.debounce",
            "zod",
            "i18next",
            "react-i18next",
          ],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
});
