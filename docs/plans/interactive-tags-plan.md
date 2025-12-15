# Interactive Tags (Global Filters) Implementation Plan

## Goal

Enable users to click on **all metadata tags** (Genre, Developer, Publisher, Platform) on Game Cards and Game Details pages to effectively filter the Catalog.
This requires updating the Backend to support these filters and the Frontend to implement the interaction.

## Scope

- **Global Application**: This feature applies to all instances of `GameCard` (Home, Catalog, Library, Wishlist) and the `GameDetails` page.
- **Target Fields**:
  - Genre (Already supported in Backend)
  - Platform (Already supported in Backend)
  - Developer (New Backend Filter)
  - Publisher (New Backend Filter)

## Technical Consideration

The current Backend `searchGames` endpoint does NOT support filtering by `developer` or `publisher`. We must implement this first.

## Implementation Steps

### 1. Backend Updates (API Expansion)

- **`src/services/game.service.ts`**:
  - Update `searchGames` signature to accept `developer` and `publisher` strings.
  - Add logical checks to apply these filters to the Mongoose query.
- **`src/controllers/game.controller.ts`**:
  - Extract `developer` and `publisher` from `req.query`.
  - Pass them to the service.

### 2. Frontend Logic (Service & Hooks)

- **`src/services/games.service.ts`**:
  - Update `GamesQueryParams` interface to include `developer` and `publisher`.
- **`src/features/games/hooks/useCatalogUrl.ts`**:
  - Add state management for `developer` and `publisher` URL parameters.
  - Ensure they sync with the URL (e.g., `?developer=Square+Enix`).

### 3. Frontend UI (Components)

- **`GameCard.tsx`**:
  - **Genre**: Make interactive -> Navigate to `/catalog?genre=...`.
  - **Developer**: Make interactive -> Navigate to `/catalog?developer=...`.
  - _Action_: Stop propagation on click to prevent opening Details.
- **`GameDetails.tsx`**:
  - **Genre**: Link to `/catalog?genre=...`
  - **Platform**: Link to `/catalog?platform=...`
  - **Developer**: Link to `/catalog?developer=...`
  - **Publisher**: Link to `/catalog?publisher=...`

## Verification Plan

1.  **Backend Test**:
    - Call API `GET /api/games?developer=Valve`. Verify results.
2.  **Frontend Test**:
    - Click "Valve" on a game card -> Redirect to Catalog -> Verify URL contains `?developer=Valve` -> Verify only Valve games are shown.
    - Repeat for Publisher and Platform.
