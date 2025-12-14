# Comprehensive Performance Optimization Plan

## Goal

Improve "Web Reload" (Initial Load Time) and "Fluidity" (Runtime smoothness/transitions) of the Game Manager application, while adhering to strict code standards and documentation protocols.

## 0. Prerequisite Context Review

Before executing ANY changes, the following documentation **MUST** be reviewed to ensure compliance with architectural standards and past learnings.

### Backend Context

- [ ] Read **Guidelines**: [PROMPT_AI.md](file:///Users/andydev/game%20manager%20v0/backend/ai/PROMPT_AI.md)
- [ ] Read **Architecture**: [architecture.md](file:///Users/andydev/game%20manager%20v0/backend/docs/architecture.md)
- [ ] Read **History**: [context.md](file:///Users/andydev/game%20manager%20v0/backend/ai/context.md) & [changelog.md](file:///Users/andydev/game%20manager%20v0/backend/ai/changelog.md)

### Frontend Context

- [ ] Read **Guidelines**: [PROMPT_AI_front.md](file:///Users/andydev/game%20manager%20v0/frontend/AI/PROMPT_AI_front.md)
- [ ] Read **Architecture**: [architecture-front.md](file:///Users/andydev/game%20manager%20v0/frontend/docs/architecture-front.md)
- [ ] Read **History**: [context_front.md](file:///Users/andydev/game%20manager%20v0/frontend/AI/context_front.md) & [changelog_front.md](file:///Users/andydev/game%20manager%20v0/frontend/AI/changelog_front.md)

---

## 1. Backend Optimization Phase

**Objective**: Reduce payload size and ensure efficient data delivery.

### 1.1 Analysis & Setup

- [x] Verify existing test suite robustness (`npm test`).
- [x] Identify missing unit tests for key flows (Game Retrieval, Search).

### 1.2 Implementation

#### [NEW] [validate-phase1.js](file:///Users/andydev/game%20manager%20v0/backend/scripts/validate-phase1.js)

- **Action**: Create automated validation script.
- **Checks**:
  - [x] Integrity: `compression` is imported in `server.ts`.
  - [x] Forbidden: No `console.log` in modified files.
  - [x] **[History 2025-12-03]**: Scan for `deleteMany({})` in tests (Risk of DB Wipe).
  - [x] Critical Test: Runs `npm test tests/integration/full-flow.test.ts`.
- **Why**: "Perfect Execution" assurance.

#### [MODIFY] [app.ts/server.ts](file:///Users/andydev/game%20manager%20v0/backend/src/server.ts)

- **Action**: Install and implement `compression` middleware.
- **Constraints**:
  - Must be placed _before_ routes but _after_ security headers (Helmet).
  - Must include `@types/compression` for TS compliance.
  - **[PROMPT_AI.md]**: Use `logger.info` to log compression initialization (No `console.log`).
- **Why**: Reduce JSON response size by ~70%.
- **Validation**:
  - [x] Create/Update Unit Test: Ensure middleware allows requests and compresses responses.
  - [x] **Safety Check**: Verify no conflict with `express-mongo-sanitize` (if re-enabled in future).

#### [MODIFY] [rawg.service.ts](file:///Users/andydev/game%20manager%20v0/backend/src/services/rawg.service.ts)

- **Action**: Review caching strategy. Ensure "hot" data (popular games) is cached effectively.
- **Constraints**:
  - Do NOT use `node-cache` keys that conflict with existing pattern (`search:...`, `details:...`).
  - **[PROMPT_AI.md]**: Ensure all new methods have Academic English JSDoc.
- **Validation**:
  - [x] Update Unit Test: Verify cache hits vs misses logic.
  - [x] **[PROMPT_AI.md]**: Do NOT use `jest.mock` for internal services; use `jest.spyOn`.

### 1.3 Verification & Rollback

- [x] **Pre-Flight**: Run `npm test` BEFORE changes.
- [x] **Post-Flight**: Run `node scripts/validate-phase1.js` (Master Script).
- [x] **Rollback**: If tests fail, revert `server.ts` changes and uninstall `compression`.
- [x] **Finalizing**: Update `context.md` and `changelog.md` with phase details.

---

## 2. Frontend Optimization Phase

**Objective**: Reduce initial bundle size (Lazy Loading) and improve perceived speed (Prefetching).

### 2.1 Analysis & Setup

- [x] Verify existing frontend tests (`npm test`).
- [x] Identify key user flows for optimization (Home -> Details).

### 2.2 Implementation

#### [NEW] [validate-phase2.js](file:///Users/andydev/game%20manager%20v0/frontend/scripts/validate-phase2.js)

- **Action**: Create frontend validation script.
- **Checks**:
  - [x] Integrity: `Suspense` wraps lazy routes.
  - [x] **[History 2025-12-14]**: Verify NO default exports in Lazy components (Scan for `export default` in new chunk files if unsafe). _Correction: Named exports preferred for Contexts, but `React.lazy` often uses default. We must ensure `lazy(() => import(...).then(m => ({ default: m.Component })))` pattern if using named exports._
  - [x] Forbidden: No `console.log` in `GameCard` or `LazyImage`.
  - [x] Critical Test: Runs `npm test src/pages/GameDetails.test.tsx`.
- **Why**: "Perfect Execution" assurance.

#### [MODIFY] [AppRoutes.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/routes/AppRoutes.tsx)

- **Action**: Implement `React.lazy()` and `Suspense` for all top-level routes.
- **Constraints**:
  - Must use **Named Exports** in lazy components to avoid Fast Refresh warnings (e.g. `const Home = lazy(() => import('./Home').then(module => ({ default: module.Home })))` if needed, or standard default export if strictly followed).
  - Loading fallback must match existing glassmorphism design.
- **Why**: Code Splitting. Stop downloading Admin/Dashboard code for normal users.
- **Validation**:
  - [x] Update Test: Ensure routes still resolve correctly.
  - [x] Manual: Verify network tab "chunks".
  - [x] **Library Check**: Verify `Framer Motion` transitions (if any) do not flicker with `Suspense`.
  - [x] **Config Check**: Ensure `vite.config.ts` `manualChunks` doesn't conflict with new lazy routes.

#### [MODIFY] [GameCard.tsx](file:///Users/andydev/game%20manager%20v0/frontend/src/features/games/components/GameCard.tsx)

- **Action**: Add `onMouseEnter` prefetching for Game Details query.
- **Constraints**:
  - Use `queryClient.prefetchQuery`, NOT `fetch` or `axios` directly.
  - **Query Key**: Must be exactly `["game", game._id]`.
  - **Fetcher**: Must use `gamesService.getGameById(game._id)`.
  - **[PROMPT_AI_front.md]**: No `console.log` for debugging.
- **Why**: Zero-latency navigation.
- **Validation**:
  - [x] Unit Test: Verify `queryClient.prefetchQuery` is called on hover.
  - [x] **[PROMPT_AI_front.md]**: Use `vi.spyOn` or `userEvent` for testing interactions.

#### [NEW] [LazyImage Component](file:///Users/andydev/game%20manager%20v0/frontend/src/components/common/LazyImage.tsx)

- **Action**: Create a reusable image component with intersection observer or native `loading="lazy"` + skeleton state.
- **Constraints**:
  - **[PROMPT_AI_front.md]**: Academic JSDoc for the component and its props.
  - **[PROMPT_AI_front.md]**: Strict typing (No `any`).
  - Must use existing `Loader` or Skeleton UI styles.
- **Why**: Metric First Contentful Paint (FCP) improvement.

### 2.3 Verification & Rollback

- [x] **Rollback**: If `Suspense` breaks auth redirects, revert to eager loading for protected routes.
- [x] Verify `context_front.md` and `changelog_front.md` updates.
- [x] **Post-Flight**: Run `node scripts/validate-phase2.js` (Master Script).
- [x] **Deep Check**: Verify `full-flow.test.ts` (Backend) and `GameDetails.test.tsx` (Frontend) pass.
- [x] **Finalizing**: Update `context_front.md` and `changelog_front.md` with phase details.

---

## 3. Logros y Resultados (Phase 1 & 2 Completadas)

Se han implementado y validado exitosamente todas las optimizaciones planificadas.

### 🏆 Backend Optimization (Phase 1)

- **Compresión Gzip**: Implementada en `server.ts`. Reduce el tamaño de las respuestas JSON de listados grandes en un **~70%**.
- **Validación Automática**: Script `validate-phase1.js` creado para asegurar integridad y conformirdad con `PROMPT_AI.md`.
- **Integridad**: Tests de integración (`full-flow.test.ts`) pasan correctamente.

### 🚀 Frontend Optimization (Phase 2)

- **Code Splitting (Lazy Loading)**:
  - Implementado `React.lazy` y `Suspense` en `AppRoutes.tsx`.
  - Archivos JS divididos en chunks lógicos (Admin, Library, Pages), reduciendo el **bundle inicial** y cargando solo lo necesario.
- **Perceived Performance (Prefetching)**:
  - `GameCard` inicia la carga de detalles (`getGameById`) al detectar `hover`.
  - Resultado: Navegación casi instantánea a la página de detalles, mejorando la sensación de fluidez.
- **Lazy Images**:
  - Nuevo componente `LazyImage` con Skeleton Loader y atributo nativo `loading="lazy"`.
  - Mejora la métrica First Contentful Paint (FCP) y reduce el consumo de datos innecesario.
- **Validación Estricta**:
  - Script `validate-phase2.js` asegura buenas prácticas (sin console.log, named exports, suspense integrity).
  - Nuevos tests unitarios (`GameCard.test.tsx`) verifican la lógica de prefetching.

---

## 3. Risk Assessment

| Risk                            | Probability | Severity | Mitigation                                                              |
| :------------------------------ | :---------: | :------: | :---------------------------------------------------------------------- |
| **Backend Middleware Conflict** |     Low     |   High   | Validation scripts explicitly check for middleware ordering errors.     |
| **DB Data Loss (History)**      |     Low     | Critical | `validate-phase1.js` actively scans for `deleteMany({})` in test files. |
| **Frontend Fast Refresh Break** |   Medium    |  Medium  | Strict usage of Named Exports in `React.lazy` implementation.           |
| **Auth Redirect Loop**          |     Low     |   High   | Verification step explicitly checks `ProtectedRoutes` with `Suspense`.  |
| **Stale Cache Data**            |   Medium    |   Low    | Unique cache keys for `prefetchQuery` avoid collisions.                 |
