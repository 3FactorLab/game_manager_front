/**
 * AppRoutes.tsx
 * Application routing configuration using React Router v7.
 * Defines all application routes including public, protected, and admin routes.
 * Implements ProtectedRoute component for authentication and authorization.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainLayout } from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import CatalogPage from "../pages/CatalogPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import StorePage from "../pages/StorePage";
import GameDetails from "../pages/GameDetails";

import LibraryPage from "../pages/LibraryPage";
import CheckoutPage from "../pages/CheckoutPage";
import WishlistPage from "../pages/WishlistPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import GameManagement from "../pages/admin/GameManagement";
import RAWGImport from "../pages/admin/RAWGImport";

import { useAuth } from "../features/auth/AuthContext";

/**
 * ProtectedRoute component
 * Wrapper component for routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Shows access denied message if user lacks required role.
 *
 * @param {React.ReactNode} children - Route content to protect
 * @param {boolean} requireAdmin - Whether route requires admin role
 * @returns {JSX.Element} Protected content or redirect
 */

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== "admin") {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>⛔ {t("common.access_denied")}</h2>
                <p>{t("common.admin_only")}</p>
            </div>
        );
    }

    return <>{children}</>;
};

/**
 * AppRoutes component
 * Main routing configuration for the application.
 * Organizes routes into categories:
 * - Public routes (/, /home, /store, /game/:id)
 * - Protected user routes (/library, /checkout/:id)
 * - Protected admin routes (/admin/*)
 * - Auth routes (/login, /register)
 *
 * All routes are wrapped in MainLayout for consistent navigation.
 *
 * @returns {JSX.Element} Application routes
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/game/:id" element={<GameDetails />} />

                {/* Protected User Routes */}
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute>
                            <LibraryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout/:id"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute>
                            <WishlistPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute requireAdmin>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/games"
                    element={
                        <ProtectedRoute requireAdmin>
                            <GameManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/import"
                    element={
                        <ProtectedRoute requireAdmin>
                            <RAWGImport />
                        </ProtectedRoute>
                    }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Fallback - redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

// Exported to App.tsx as main routing component
export default AppRoutes;
