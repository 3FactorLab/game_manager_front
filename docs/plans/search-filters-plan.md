# Plan: Advanced Filters for Library & Wishlist

This plan implements advanced filtering (Price, On Sale) and robust search for "My Library" and "Wishlist" pages, mirroring the Catalog's functionality but scoped to the user's specific collection.

## User Review Required

> [!IMPORTANT] > **Backend Aggregation Logic Change**: The `getCollection` endpoint will now support rigorous filtering on _populated_ game fields (e.g., `game.price`, `game.onSale`). This requires mapping frontend sort keys (like `price`) to nested database paths (`game.price`).

## Proposed Changes

### Backend (`/backend`)

#### [MODIFY] [collection.service.ts](file:///Users/andydev/game manager v0/backend/src/services/collection.service.ts)

- Update `getCollection` aggregation pipeline:
  - **Isolation Guarantee**: The pipeline MUST start with `{ $match: { user: userId } }`.
  - **Strict Separation**:
    - Accept `isOwned` (boolean) parameter.
    - If `isOwned=true` (Library): Add `{ $match: { isOwned: true } }`.
    - If `isOwned=false` (Wishlist): Add `{ $match: { isOwned: false } }`.
    - _Legacy Note_: If existing logic uses `isFavorite` for wishlist, migrate or support it. Current model has `isFavorite` independent of ownership. I will assume `isOwned: false` is the source of truth for Wishlist items in this new system.
  - Add matching for `maxPrice` (e.g., `{ "game.price": { $lte: maxPrice } }`).
  - Add matching for `onSale` (e.g., `{ "game.onSale": true }`).
  - **Critical**: Map sort fields:
    - `price` -> `game.price`
    - `releaseDate` -> `game.released`
    - `title` -> `game.title`
    - `score` -> `game.score`

#### [MODIFY] [collection.controller.ts](file:///Users/andydev/game manager v0/backend/src/controllers/collection.controller.ts)

- Extract new query params (`maxPrice`, `onSale`) from `req.query`.
- Pass these to `collection.service`.
- **Compliance**: Use `GetCollectionDto` (create if missing/update) to type `req.query`. Use `asyncHandler`.

#### [MODIFY] [collection.schema.ts](file:///Users/andydev/game manager v0/backend/src/validators/zod/collection.schema.ts)

- Add validation for `maxPrice` (number/string, verify transform) and `onSale` (boolean/string, verify transform) in `getCollectionSchema`.
- **Compliance**: STRICT Zod validation. Ensure `isOwned` is validated as boolean.

#### [NEW] [collection.dto.ts](file:///Users/andydev/game manager v0/backend/src/dtos/collection.dto.ts)

- Ensure `GetCollectionDto` interface exists and reflects all query params.
- **Compliance**: No `any`. Strict types.

### Frontend (`/frontend`)

#### [NEW] [AdvancedFilterBar.tsx](file:///Users/andydev/game manager v0/frontend/src/components/common/AdvancedFilterBar.tsx)

- Create a generic, robust filter component based on `CatalogControls`.
- Props: `query`, `genre`, `platform`, `maxPrice`, `onSale`, `sortBy`, `order`.
- Handlers: `onSearch`, `onFilterChange`, `onSortChange`, `onClear`.
- **Note**: Will replace the simpler `GameFilterBar`.
- **Compliance**: Must include JSDoc block. Use CSS Modules. Unit tests required (`AdvancedFilterBar.test.tsx`).

#### [NEW] [AdvancedFilterBar.test.tsx](file:///Users/andydev/game manager v0/frontend/src/components/common/AdvancedFilterBar.test.tsx)

- Unit tests for the new component.
- Cover interactions (typing search, changing selects, clearing).
- **Compliance**: Use `userEvent`. No `any`.

#### [MODIFY] [collection.service.ts](file:///Users/andydev/game manager v0/frontend/src/services/collection.service.ts)

- Update `getLibrary` to explicitly pass `isOwned=true`.
- **Compliance**: JSDoc check.

#### [MODIFY] [user.service.ts](file:///Users/andydev/game manager v0/frontend/src/services/user.service.ts)

- Update `getWishlistPaginated` to explicitly pass `isOwned=false`.
- **Compliance**: JSDoc check.

#### [MODIFY] [useLibraryUrl.ts](file:///Users/andydev/game manager v0/frontend/src/features/collection/hooks/useLibraryUrl.ts)

- Add state and URL sync for `maxPrice` and `onSale`.
- **Compliance**: JSDoc check.

#### [MODIFY] [useWishlistUrl.ts](file:///Users/andydev/game manager v0/frontend/src/features/wishlist/hooks/useWishlistUrl.ts)

- Add state and URL sync for `maxPrice` and `onSale`.
- **Compliance**: JSDoc check.

#### [MODIFY] [LibraryPage.tsx](file:///Users/andydev/game manager v0/frontend/src/pages/LibraryPage.tsx)

- Replace `GameFilterBar` with `AdvancedFilterBar`.
- Pass new state/handlers from updated hook.

#### [MODIFY] [WishlistPage.tsx](file:///Users/andydev/game manager v0/frontend/src/pages/WishlistPage.tsx)

- Replace `GameFilterBar` with `AdvancedFilterBar`.
- Pass new state/handlers from updated hook.

## Verification Plan

### Automated Tests

- **VDD Script (`validate-phase-filters.js`)**:
  - Registers a test user.
  - Adds 3 games to library:
    - Game A: $60 (RPG)
    - Game B: $20 (Action)
    - Game C: $5 (Indie, On Sale)
  - Verifies `GET /api/collection?maxPrice=30` returns B and C.
  - Verifies `GET /api/collection?onSale=true` returns C.
  - Verifies `GET /api/collection?sortBy=price&order=asc` returns order C, B, A.

### Manual Verification

1.  **Library Page**:
    - Go to `/library`.
    - Filter by "Under 30€". Verify high-price games disappear.
    - Toggle "Seasonal Offers". Verify only discounted games appear.
    - Sort by "Price: Low to High". Verify order.
2.  **Wishlist Page**:
    - Repeat above steps in `/wishlist`.
3.  **Persistence**:
    - Refresh page. Verify filters remain (URL check).
