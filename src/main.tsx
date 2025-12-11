/**
 * main.tsx
 * Application entry point that bootstraps the React application.
 * Sets up the provider hierarchy for routing, state management, authentication,
 * and SEO optimization. Initializes i18n for internationalization support.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import "./index.css"; // Global styles and CSS custom properties
import "./lib/i18n"; // Initialize i18next for internationalization
import { CartProvider } from "./features/cart/CartContext";
import { WishlistProvider } from "./features/wishlist/WishlistContext";
import { queryClient } from "./lib/queryClient"; // React Query client configuration
import { AuthProvider } from "./features/auth/AuthContext"; // Authentication context
import App from "./App.tsx";
import ScrollToTop from "./components/common/ScrollToTop";

/**
 * Provider hierarchy (outer to inner):
 * 1. StrictMode - React development mode checks
 * 2. HelmetProvider - SEO meta tags management
 * 3. QueryClientProvider - Server state management with React Query
 * 4. CartProvider - Cart state
 * 5. AuthProvider - Authentication state and user context
 * 6. BrowserRouter - Client-side routing
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <BrowserRouter>
                                <ScrollToTop />
                                <App />
                            </BrowserRouter>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    </StrictMode>
);
