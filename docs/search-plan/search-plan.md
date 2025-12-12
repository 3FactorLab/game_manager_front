# Implementation Plan - Advanced Search & Sort

This plan addresses the implementation of a real-time "Super Search" engine and Sorting functionality for the Game Catalog, as requested by the user.

## User Review Required

> [!IMPORTANT] > **Pagination Change**: The plan includes switching from **Infinite Scroll** to **Standard Pagination** (Pages 1, 2, 3...) in the Catalog. This aligns with the "Super Search" and "Sort" requirements (similar to GOG.com) and the user's suggestion.

> [!NOTE] > **Super Search**: The "Super Search" will be implemented as a prominent search bar with **real-time debounced results** showing in a dropdown (as depicted in typical e-commerce sites).

## Proposed Changes

### Backend (`game-manager-BACK`)

#### [MODIFY] [game.validator.ts](file:///Users/andydev/game%20manager%20v0/game-manager-BACK/src/validators/game.validator.ts)

- Update `searchGameValidator` to accept optional `sortBy` and `order` query parameters.
- `sortBy` allowed values: `price`, `releaseDate`, `title`, `genre`, `platform`.
- `order` allowed values: `asc`, `desc`.

#### [MODIFY] [game.controller.ts](file:///Users/andydev/game%20manager%20v0/game-manager-BACK/src/controllers/game.controller.ts)

- Extract `sortBy`, `order`, and filters from `req.query` in the `search` method.
- Pass these parameters to the service layer.
- **[NEW] Endpoint**: `GET /api/games/filters` to retrieve available genres and platforms.
  - Implement `getFilters` method to aggregation query for distinct values.

#### [MODIFY] [game.model.ts](file:///Users/andydev/game%20manager%20v0/game-manager-BACK/src/models/game.model.ts)

- **[PERFORMANCE] Indexing**: Add MongoDB Text Index on searchable fields with **Weights** for relevance:
  - `title`: Weight 10 (Highest priority)
  - `genre`: Weight 5
  - `developer`: Weight 3
  - `publisher`: Weight 3
  - `platform`: Weight 1

#### [MODIFY] [game.service.ts](file:///Users/andydev/game%20manager%20v0/game-manager-BACK/src/services/game.service.ts)

- Update `searchGames` signature to accept `sortBy` and `order`.
- **[NEW] Multi-field Search**: Update query logic.
  - Use `$text` search (if using Text Index) or optimized `$or` query.
- Implement Mongoose sorting logic based on params.
  - Initial default: `releaseDate` DESC (Newest first).
- **[NEW] method**: `getFilters()` to return `{ genres: [...], platforms: [...] }`.

### Frontend (`frontend`)

> [!IMPORTANT] > **Design Consistency**: All new components (`NavbarSearch`, `CatalogControls`, Pagination) MUST strictly adhere to the existing application aesthetics.
>
> - **Colors**: Use existing Tailwind tokens/CSS variables (e.g., `primary`, `bg-dark`, `text-muted`). Do NOT introduce new random colors.
> - **Typography**: Match existing font sizes and weights.
> - **Spacing**: Follow the project's spacing system.
> - **Borders/Effects**: Replicate existing border-radius and hover effects (e.g., the specific glow or transition used elsewhere).

#### [NEW] [NavbarSearch.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/features/games/components/NavbarSearch.tsx)

- **"Super Search" for Navbar**:
  - instant search with debounce.
  - **Visual Dropdown**: Shows game thumbnail, title, price, release date, publisher/developer.
  - **No Results**: Show "No results found" message within the dropdown when no matches exist.
  - **[UX] Clear Input**: precise "X" button to clear the search term and reset state.
  - **[UX] Keyboard Navigation**: Support `ArrowUp`/`ArrowDown` to traverse results and `Enter` to select/navigate.
  - **[UX] View All**: Add a list item at the bottom: "See all results for '...'" which navigates to `/catalog?search=...`.
  - Clicking a result navigates to `GameDetails`.

#### [NEW] [CatalogControls.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/features/games/components/CatalogControls.tsx)

- Search Input + Filter/Sort Controls for the Catalog Page.
- **Search Behavior**: Updates the `search` query param to filter the main game grid (no dropdown).
- **[UX] Clear Input**: precise "X" button to clear the search term and reset search param.
- **Advanced Filters**: Collapsible section with Genre and Platform dropdowns.
- **Sort Control**: "Newest", "Oldest", "Price: Low/High", "Name: A-Z/Z-A", "Genre", "Platform".

#### [MODIFY] [Navbar.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/components/layout/Navbar.tsx)

- Replace existing search input with `NavbarSearch` component.

#### [MODIFY] [CatalogPage.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/pages/CatalogPage.tsx)

- Implement `CatalogControls` below the hero section.
- Sync state with URL parameters (search, page, genre, platform, sort).
- Remove independent `SortControl` (merged into `CatalogControls` or kept adjacent).
- **Empty State**: Use a dedicated component to show "We couldn't find anything matching your criteria" with an icon/illustration when the filtered list is empty.

#### [MODIFY] [useGames.ts](file:///Users/andydev/game%20manager%20v0/frontend/src/features/games/hooks/useGames.ts)

- Update hook to accept `sortBy`, `order`, and `page` (instead of infinite scroll `cursor`).
- Switch from `useInfiniteQuery` to standard `useQuery` (since we are moving to standard pagination).
- **[UX] Smooth Transitions**: Use `placeholderData: keepPreviousData` to prevent layout shift/flashing while fetching new pages.
- **[CACHE] Filters**: Implement `useFilters` hook (or add to `useGames`) with `staleTime: Infinity` to cache Genre/Platform lists and reduce API calls.

#### [MODIFY] [CatalogPage.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/pages/CatalogPage.tsx)

- Replace "Hero" title with the new `AdvancedSearch` component below the title.
- Add `SortControl` above the game grid.
- Replace "Load More" button with standard numbered pagination controls.
- Manage state for `page`, `sortBy`, `order`.
- **CRITICAL**: Preserve exact existing visual style (`GameCard`, Grid layout, usage of `styles.grid`). Only the pagination mechanism changes (button vs numbers).
- **[TECH] URL Sync Hook**: Create `useCatalogUrl` hook to manage `page`, `sort`, `search` params.
  - Implement **Debounce strategy** here: Delay updating the URL `search` param to avoid cluttering browser history while typing.

## Verification Plan

### Automated Tests

- **Backend Integration Test**:
  - Create/Update `tests/public.games.test.ts` to verify:
    - Sorting by price (ASC/DESC).
    - Sorting by date.
    - Pagination metadata (total pages, current page).
  - Command: `npm test tests/public.games.test.ts` (in `game-manager-BACK`).

### Manual Verification

1.  **Search**:
    - Go to Catalog.
    - Type "Cyber" in the new search bar.
    - Verify debounced request is sent.
    - Verify simple dropdown appears with highlighted results (e.g., "**Cyber**punk").
2.  **Sort**:
    - Select "Price: Low to High".
    - Verify games reorder correctly.
    - Select "Newest".
    - Verify games reorder by release date.
3.  **Pagination**:
    - Scroll to bottom.
    - Click "Next" or specific page number.
    - Verify new set of games loads and page top is scrolled to.
