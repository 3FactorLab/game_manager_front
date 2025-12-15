# Modern Store Implementation Plan

Implement a "Modern Store" section on the Home page featuring "Flash Deals" and "Games Under $10", inspired by GOG.com. This requires updating the backend to support new filters.

## User Review Required

> [!NOTE]
> Backend changes are required to support filtering by `onSale` status and `maxPrice`. This is a low-risk enhancement to the search/filtering logic.

## Proposed Changes

### Backend

#### [MODIFY] [game.service.ts](file:///Users/andydev/game manager v0/backend/src/services/game.service.ts)

- Update `searchGames` signature to accept `onSale` (boolean) and `maxPrice` (number).
- Implement filtering logic for `onSale` and `price`.

#### [MODIFY] [game.controller.ts](file:///Users/andydev/game manager v0/backend/src/controllers/game.controller.ts)

- Extract `onSale` and `maxPrice` from `req.query` in the `search` method.
- Pass these new parameters to `searchGames`.

#### [NEW] [validate-modern-store.ts](file:///Users/andydev/game manager v0/backend/src/scripts/validate-modern-store.ts)

- **VDD**: Create a validation script that:
  - Verifies the endpoint `/api/games` responds to `onSale=true`.
  - Checks logic integrity (e.g. Ensure `logger` is used, no `console.log`).

### Frontend

#### [MODIFY] [games.service.ts](file:///Users/andydev/game manager v0/frontend/src/services/games.service.ts)

- Update `GamesQueryParams` interface to include `onSale?: boolean` and `maxPrice?: number`.
- Ensure these params are passed to `apiClient`.

#### [NEW] [DealSection.tsx](file:///Users/andydev/game manager v0/frontend/src/features/home/components/DealSection.tsx)

- Create a new component to display "Flash Deals" and "Under $10" lists.
- Use `useGames` hook twice with different params:
  - Flash Deals: `{ onSale: true, limit: 4 }`
  - Under $10: `{ maxPrice: 10, limit: 4 }`
- **Visuals & Design System Compliance**:
  - **Container**: Use `.glass-panel` for the section background.
  - **Flash Deals Badge**: Use `var(--accent-primary)` (Red) to signal urgency.
  - **Under $10 Price**: Use `var(--success)` (Green) or `text-gradient` class.
  - **Typography**: "Outfit" font (inherited).
  - **Layout**: CSS Grid/Flex matching existing `GameGrid` spacing (`gap: 1.5rem`).

#### [MODIFY] [HomePage.tsx](file:///Users/andydev/game manager v0/frontend/src/pages/HomePage.tsx)

- Import and add `DealSection` below the existing `contentWrapper`.

#### [NEW] [validate-modern-store.js](file:///Users/andydev/game manager v0/frontend/scripts/validate-modern-store.js)

- **VDD**: Create a node script that:
  - Verifies `DealSection.tsx` exists and follows JSDoc standards.
  - Runs the specific test suite for DealSection (`npm test src/features/home/components/DealSection.test.tsx`).

## Verification Plan

### Automated Tests

- Run backend tests to ensure `searchGames` still works for existing queries.
- `npm test` in backend.

### Validation Driven Development (VDD)

1.  **Backend**: Run `npx ts-node src/scripts/validate-modern-store.ts`. **MUST PASS**.
2.  **Frontend**: Run `node scripts/validate-modern-store.js`. **MUST PASS**.

### Manual Verification

1.  **Backend**: Use e.g. Curl or Postman (or browser url) to hit `/api/public/games?onSale=true` and verify results.
2.  **Frontend**: Open Home page.
3.  Verify "Flash Deals" section shows games with `onSale: true`.
4.  Verify "Under $10" section shows games with `price <= 10`.
