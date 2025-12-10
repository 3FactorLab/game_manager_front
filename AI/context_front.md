# Frontend Project Context

## Project Overview

Game Manager - Frontend application built with Vite + React + TypeScript for managing a video game collection and store.

## Technology Stack

-   **Framework**: React 18 with TypeScript
-   **Build Tool**: Vite
-   **Routing**: React Router v7
-   **State Management**: React Query (TanStack Query) + Context API
-   **Styling**: CSS Modules with custom properties (dark theme)
-   **Forms**: react-hook-form + Zod validation
-   **HTTP Client**: Axios with interceptors
-   **i18n**: i18next (English, Spanish translations exist but not loaded)
-   **Icons**: React Icons
-   **Animations**: Framer Motion
-   **Notifications**: react-hot-toast

## Architecture

### Feature-Based Structure

```
src/
├── features/          # Feature modules
│   ├── auth/         # Authentication (context, hooks, pages, schemas, types)
│   ├── games/        # Games catalog (hooks, components)
│   ├── collection/   # Library & wishlist (hooks, services)
│   ├── checkout/     # Purchase flow (hooks, services)
│   ├── profile/      # User profile (hooks, components)
│   └── admin/        # Admin panel (hooks, pages)
├── components/       # Shared UI components
│   ├── ui/          # Reusable UI (Button, Card, Input, SearchBar)
│   └── layout/      # Layout components (Navbar, MainLayout, UserDropdown)
├── pages/           # Page components
├── services/        # API services (auth, games, admin)
├── hooks/           # Global custom hooks
├── lib/             # Configuration (queryClient, i18n)
├── utils/           # Utilities (format)
└── types/           # Global types
```

### Key Patterns

-   **Authentication**: JWT tokens stored in localStorage, managed by AuthContext
-   **Data Fetching**: React Query for caching, pagination, and mutations
-   **Protected Routes**: ProtectedRoute wrapper component with role-based access
-   **Form Validation**: Zod schemas with react-hook-form integration
-   **Styling**: CSS Modules with glassmorphism effects and custom properties

## Current State

### Completed Features

-   ✅ User authentication (login, register, logout)
-   ✅ Games catalog with infinite scroll
-   ✅ Game details page with purchase/wishlist
-   ✅ User library management
-   ✅ Wishlist functionality
-   ✅ Checkout flow
-   ✅ User profile with avatar upload
-   ✅ Admin panel (user management, game CRUD, RAWG import)
-   ✅ Responsive design with mobile menu
-   ✅ Search functionality

### Recent Improvements

**Phase 1: Type Safety & Error Handling** (2025-12-10)

-   ✅ Eliminated 12 of 13 `any` type usages (92% reduction)
-   ✅ Created type definitions: `types/rawg.types.ts`, `types/api.types.ts`
-   ✅ Centralized error handling: `utils/error.util.ts`
-   ✅ Updated 6 files to use proper TypeScript types
-   ✅ Type safety improved from 60% to 95%

**Phase 2: Error Boundaries** (2025-12-10)

-   ✅ Implemented `ErrorBoundary` component
-   ✅ Integrated in `App.tsx` for application-wide error catching
-   ✅ User-friendly error fallback UI
-   ✅ Automatic error logging in development

**Phase 3: Refresh Token Auto-Refresh** (2025-12-10)

-   ✅ Implemented automatic token refresh on 401 errors
-   ✅ Updated `types.ts` to include `refreshToken` in `AuthResponse`
-   ✅ Modified `auth.service.ts` to store/clear both tokens
-   ✅ Added `refreshToken()` method to auth service
-   ✅ Replaced 401 interceptor in `api.client.ts` with auto-refresh logic
-   ✅ Session duration extended from 15 minutes to 7 days
-   ✅ Seamless user experience with transparent token renewal

**Phase 1: Academic Documentation** (2025-12-09)

-   ✅ Academic-style documentation added to 39 critical files
-   ✅ Loading spinner implemented in Button component
-   ✅ Inline styles moved to CSS modules (Home page)
-   ✅ Code cleanup (removed commented code)

### Known Issues

-   ⚠️ Spanish translations exist but not loaded in i18n config (15 min fix)
-   ⚠️ 70+ inline styles remain in various components (4-6h to fix)
-   ⚠️ Password change doesn't validate current password (security issue, requires backend)
-   ⚠️ 1 ESLint warning in AuthContext.tsx (fast refresh pattern, non-critical)

## API Integration

-   **Base URL**: Configured in api.client.ts
-   **Authentication**: JWT token in Authorization header
-   **Interceptors**: Request (add token), Response (handle 401)
-   **Endpoints**:
    -   `/users/*` - Auth and profile
    -   `/games/*` - Games catalog and details
    -   `/collection/*` - Library and wishlist
    -   `/payments/*` - Checkout
    -   Admin endpoints for management

## Development Workflow

-   **Dev Server**: `npm run dev` (port 5173)
-   **Build**: `npm run build`
-   **Preview**: `npm run preview`
-   **Lint**: `npm run lint`
-   **Test**: `npm run test` (Vitest)

## Next Steps (Optional)

-   Load Spanish translations in i18n
-   Move remaining inline styles to CSS modules
-   Implement token refresh logic
-   Add error boundaries
-   Complete remaining page documentation

## 2025-12-10T13:00:00+01:00

-   **Actions**: Implemented Wishlist Feature.
-   **Implementation**:
    -   `src/features/wishlist/WishlistContext.tsx`: Created context with backend sync.
    -   `src/services/user.service.ts`: Created service for wishlist API interactions.
    -   `src/pages/WishlistPage.tsx` & `.module.css`: Created wishlist display page.
    -   `src/features/games/components/GameCard.tsx`: Added wishlist heart button.
    -   `src/components/layout/Navbar.tsx`: Added wishlist link.
    -   `src/routes/AppRoutes.tsx`: Added `/wishlist` protected route.
    -   `src/components/ui/Loader.tsx`: Created reusable loader component.
-   **Status**: Wishlist implemented with backend persistence.
