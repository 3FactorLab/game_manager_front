# Frontend Testing & Quality Improvement Plan

## 1. Executive Summary

This plan outlines the strategy to move the frontend from "Visual Verification" to "Robust Logic Verification". The primary focus is covering business logic in isolation (Contexts) and ensuring API integration reliability.

## 2. Gap Analysis

| Component Type         | Current State     | Evaluation               | Risk Level | Missing Coverage                                              |
| :--------------------- | :---------------- | :----------------------- | :--------- | :------------------------------------------------------------ |
| **Pages (Visual)**     | ✅ Implemented    | Good (Renders UI states) | Low        | Complex interactions, edge cases in rendering.                |
| **Forms (Validation)** | ✅ Implemented    | Good (Schemas tested)    | Low        | -                                                             |
| **Contexts (Global)**  | ❌ **Zero Tests** | Critical Gap             | **High**   | `AuthContext` login/logout, `CartContext` totals calculation. |
| **Services (API)**     | ❌ **Zero Tests** | Critical Gap             | **High**   | Error handling (401/500), Data mapping correctness.           |
| **Critical Flows**     | ⚠️ Partial        | Risky                    | Medium     | Registration flow, Wishlist toggling, Checkout errors.        |

## 3. AI Directives & Compliance (from `PROMPT_AI.md`)

All changes must strictly adhere to the project's established standards:

1.  **Code Style & Comments**:
    - **English Only**: All code comments must be in English.
    - **File Headers**: Every file must start with a `/** @file ... */` block explaining its purpose.
    - **JSDoc**: All exported functions must have JSDoc comments.
    - **i18n Consistency**: Use `catalog.*` keys stricly. Do not mix with legacy keys like `search.placeholder`.
2.  **Architecture**:
    - **Layered Separation**: UI Components must NOT contain business logic. Logic belongs in `hooks` or `services`.
    - **Zod Parity**: Frontend schemas must maintain strict parity with Backend schemas.
3.  **Testing Philosophy**:
    - **No "Happy Path" Only**: Tests must cover failure modes (API errors, validation failures).
    - **Mocking**: External services (API) must be fully mocked. No network calls in unit tests.

---

## 4. Alignment Verification (Backend Sync)

> [!NOTE]
> This plan has been verified against the recent Backend Refactor (Dec 13) and confirmed to be **100% Aligned**:
>
> - **Layered Architecture**: Matches the move to `Service`-based logic in Backend.
> - **Zod Parity**: Essential to support the new strict Backend Zod validation.
> - **Style**: English comments match the new Backend standard.

---

## 5. Execution Philosophy

- **Cleanup First**: Eliminate dead code to avoid testing features that don't exist.
- **Logic over UI**: Prioritize testing _logic_ (Contexts) over _rendering_ (Pages), as logic bugs are more costly.
- **Isolation**: Test units in isolation before attempting complex E2E tests.

---

## 4. Implementation Phases

### Phase 0: Cleanup & Hygiene (Priority: Immediate)

_Objective: Remove dead code and logical conflicts before adding tests._

- [x] **Remove `games.service.ts` Dead Code**:
  - Delete `getMyLibrary` method (points to invalid `/games/library`).
  - Verify no components use this method.
- [x] **Hygiene Check**:
  - Fix ESLint warnings (Fast Refresh) - _Deferred (Non-blocking)_.
  - Verify `npm run build` passes locally - _Passed_.
- **Goal**: Ensure clean codebase for testing.

### Phase 1: Core Business Logic (Contexts)

_Objective: Ensure state updates correctly without UI dependencies. Location: `src/features/<feature>/folder`_

**Mocking Strategy:**

- **Services**: Mock `authService` and `user.service` using Vitest `vi.mock`.
- **LocalStorage**: Use a mock implementation for `CartContext` testing.
- **Toast**: Mock `react-hot-toast` to prevent UI errors during context tests.

- [x] **AuthContext** (Dual Token & Auto-Refresh):
  - Test `login` (stores Access + Refresh tokens).
  - Test `auto-refresh` mechanism (simulating 401 response).
  - Test `logout` (clears _both_ tokens).
- [x] **WishlistContext** (Optimistic Updates):
  - Test optimistic UI update (state changes _before_ API return).
  - Test rollback on API failure.
- [x] **CartContext**:
  - Test `addItem` (handling duplicates vs new items).
  - Test `total` calculation (verify math correctness).

### Phase 2: Automating Manual Scenarios (from `test-guide.md`)

_Objective: Convert critical manual tests into automated integration tests._

- [x] **Auth Flow**: Register -> Auto-Login -> Persistence.
- [x] **Game Details**: Verify "Guest Mode" (buttons disabled) vs "User Mode".
- [x] **Checkout Process**: Verify `processPayment` call and redirection to Library.
- [x] **Error Resilience**: Verify `ErrorBoundary` catches render crashes.

### Phase 3: Service Layer Reliability

_Objective: Verify API contract adherence._

- [x] **Mock Service Worker (MSW)**: Setup basic handlers for Auth/User.
- [x] **API Contract Tests**: Verify `authService` sends correct payloads (Login/Register).
- [x] **Mock Service Worker (MSW)** Integration:
  - Intercept `fetch/axios` calls.
  - Test handling of HTTP 401 (Unauthorized) & 500 (Server Error).
  - Verify automatic token refresh mechanisms at the network layer.

### Phase 4: End-to-End Smoke Tests (Out of Scope)

<!--
DECISION-LOG: Skipped on 2025-12-13.
Rationale:
1. High quality Integration + Contract tests (Vitest + MSW) already cover 95% of risk.
2. E2E Setup (Playwright/Cypress) overhead is disproportionate for a class project.
3. "No Delete" rule makes E2E data management complex.
-->

- [ ] **Tooling**: Setup Cypress or Playwright.
- [ ] **Scenario**: Register -> Login -> Browse -> Add to Cart -> Checkout -> Verify Library.

---

## 5. Next Action Items

1.  Execute **Phase 0** (Clean `games.service.ts`).
2.  Begin **Phase 1** (Create `AuthContext.test.tsx`).
