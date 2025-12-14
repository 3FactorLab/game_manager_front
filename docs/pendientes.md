# Pendientes Frontend

## 🔧 Code Quality (Auditoría 2025-12-14)

### Crítico (Debe Arreglarse)

- [ ] **Eliminar console.error en producción** (Prioridad ALTA)
  - Archivo: `src/services/api.client.ts:102`
  - Línea: `console.error("[Auth] Token refresh failed:", refreshError);`
  - Solución: Reemplazar con logger utility o eliminar
  - Impacto: Logs innecesarios en producción

### Opcional (Mejora de Calidad)

- [ ] **Mejorar tipado en tests** (Prioridad MEDIA)
  - 19 usos de `any` en archivos de test
  - Archivos afectados:
    - `api.client.test.ts` (3 usos)
    - `GameDetails.test.tsx` (8 usos)
    - `api.contract.test.ts` (2 usos)
    - `WishlistContext.test.tsx` (6 usos)
  - Solución: Tipar mocks correctamente
  - Impacto: Mejor type safety en tests

---

## 📋 Features Pendientes

### Cambio de Contraseña

(REQUIERE BACKEND UPDATE)
⚠️ **Nota de Seguridad:** Como usamos el endpoint existente `PUT /users/update`, NO valida la contraseña actual. Esto significa que cualquiera con acceso a la sesión puede cambiar la contraseña sin saber la anterior.

**Para producción:** Recomendaría crear el endpoint dedicado `POST /users/change-password` que valide la contraseña actual.

---

## ⚠️ Mejoras Pendientes (Prioridad Media)

### 🔮 Visión Futura (Migración a Monorepo)

Pasos estrictamente de infraestructura para cuando decidamos fusionar los repositorios:

1.  **Hoja de Ruta de Infraestructura**:
    - Mover `frontend` y `backend` a una carpeta raíz común.
    - Configurar `npm workspaces` o `pnpm`.
    - Crear `packages/shared-types` (Moviendo los tipos de la Fase 14 aquí).
    - Crear `packages/shared-utils` (Zod schemas, formatters).

- [x] **Tests Unitarios**: Extender la cobertura de tests unitarios (con Mocks) para lógica de negocio compleja. ✅

---

## ✅ Completado Recientemente

### Fase 1: Type Safety y Error Handling

- ✅ Eliminados 12 usos de `any` (92% reducción de errores de lint)
- ✅ Creados tipos TypeScript para RAWG API
- ✅ Error handling centralizado con `error.util.ts`
- ✅ Logger para desarrollo/producción

### Fase 2: Error Boundaries

- ✅ Componente `ErrorBoundary` implementado
- ✅ Integrado en `App.tsx`
- ✅ UI de fallback user-friendly

### Fase 3: Style Refactoring (Clean Code)

- ✅ Eliminados 100% estilos inline (70+ instancias)
- ✅ Implementados CSS Modules para todas las páginas
- ✅ Estandarización de `api.client.ts` logs (dev-only)
- ✅ Migración de 6ª Screenshot completada y verificada
- ✅ Internacionalización (i18n) activada con toggle EN/ES
- ✅ Rutas estáticas corregidas (`/public` prefix removed)

### Fase 4: Token Refresh Logic

- ✅ Soporte backend `/api/users/refresh-token`
- ✅ Auto-refresh en frontend sin logout
- ✅ Persistencia segura en localStorage

### Fase 5: Rutas de Archivos Estáticos

- ✅ Corregidas 2 referencias que usaban `/public/game_manager_icon.png` a `/game_manager_icon.png`.
- ✅ Resuelto warning de Vite.

### Fase 6: Search & Filter (Advanced)

- ✅ Buscador Global con debounce y dropdown
- ✅ Filtros por Género y Plataforma
- ✅ Ordenamiento dinámico (Precio, Fecha, Nombre)

### Fase 7: Migración Backend a Zod (Backend Hardening)

- ✅ Reemplazo total de `express-validator` por `Zod`.
- ✅ Paridad de schemas Frontend/Backend (Auth, Games, Collection).
- ✅ Middleware `validateZod` implementado con formato de error compatible.
- ✅ Limpieza de código legacy.

### Fase 8: Testing Strategy (Quality Assurance)

- ✅ **Fase 1 (Core)**: AuthContext, CartContext, WishlistContext (Unit Tests).
- ✅ **Fase 2 (Interactions)**: CheckoutPage, RegisterPage, GameDetails (Integration Tests).
- ✅ **Fase 3 (Contracts)**: MSW Setup & API Contract Validation.
- ✅ **Fase 4 (E2E)**: Evaluada y descartada por regla de "No Delete" y coste/beneficio académicos.

### Fase 9: Backend Architecture (PROMPT_AI Compliance)

- ✅ **Controllers**: Refactorizados para ser "HTTP-Only" (Delegación a Servicios).
- ✅ **Async/Error**: Uso universal de `asyncHandler`.
- ✅ **Separation of Concerns**: User/Auth/Collection claramente separados.

### Fase 10 & 11: Backend Modernization & Hardening

- ✅ **Test Colocation**: Migración de `tests/` a `src/` completada.
- ✅ **Cron Services**: Limpieza automática de Tokens y Órdenes (04:00 AM).
- ✅ **Resilience**: Fallbacks en Aggregator y Pagos (Email Service Down).
- ✅ **Maintenance**: Script manual `manual-cleanup.ts` entregado.

### Fase 12: Test Hardening & Monorepo Prep (Critical Fixes)

- ✅ **Network Isolation**: Solucionada la fuga de API real en tests de Steam (`jest.spyOn`).
- ✅ **Robust Mocking**: Migración de `jest.mock` a spies explícitos para evitar problemas de hoisting y fragilidad.
- ✅ **CI Stability**: Configurado Jest para ignorar `dist/` y evitar falsos positivos/negativos.
- ✅ **Monorepo Readiness**: Backend tests ahora son 100% aislados y rápidos, requisito clave para la fusión de repositorios.

### Fase 13: Final Architecture Cleanup & DTOs

---

### Fase 14: Frontend Hardening (Robustez V2)

- ✅ **Strict Typing**: `api.types.ts` migrado a `Game[]`.
- ✅ **State Management**: `WishlistContext` migrado a **React Query**.
- ✅ **Clean Styles**: `Navbar` y `CatalogPage` migrados a CSS Modules.
- ✅ **Clean Code**: Eliminados `console.log` de producción.

### Fase 15: Infraestructura Future-Proof (Fixed & Hardened)

- ✅ **Dynamic Proxy**: `vite.config.ts` limpia sufijos `/api` automáticamente.
- ✅ **Dynamic Client**: `api.client.ts` fuerza Proxy en modo DEV (Cero CORS).
- ✅ **Env Security**: `.env` restaurado y verificado (Puerto 3500).

### Fase 16: Fast Refresh Optimization (DX Improvement)

- ✅ **Context Split**: Separados Hooks de Providers en 3 contexts.
  - ✅ `AuthContext.tsx` (54 líneas) + `AuthProvider.tsx` (127 líneas)
  - ✅ `CartContext.tsx` (55 líneas) + `CartProvider.tsx` (88 líneas)
  - ✅ `WishlistContext.tsx` (35 líneas) + `WishlistProvider.tsx` (103 líneas)
- ✅ **Automation Scripts**: 5 scripts creados para futuras migraciones.
  - ✅ `scripts/split-context.js` - Separación automática de contexts
  - ✅ `scripts/update-imports.js` - Actualización de imports
  - ✅ `scripts/migrate-context.sh` - Script maestro de orquestación
  - ✅ `scripts/validate-phase16.js` - Validación de refactor
  - ✅ `codemod/split-context.js` - Codemod con jscodeshift
- ✅ **Import Updates**: Actualizados `main.tsx` y archivos de test.
- ✅ **Zero Git Operations**: Scripts NO ejecutan git automáticamente.
- ✅ **Test Coverage**: 74/74 tests passing (100% mantenido).
- ✅ **TypeScript**: Compila sin errores.
- ✅ **Fast Refresh**: Warnings eliminados, Hot Reload funciona correctamente.
- ✅ **Logic Flows**: Todos los flujos verificados (Auth, Cart, Wishlist).

---

## 📝 Notas Técnicas

### Errores de Lint Restantes

- ✅ **0 warnings de Fast Refresh**: Resueltos en Fase 16.

### Build Status

- ✅ TypeScript compilation: SUCCESS
- ✅ Vite build: SUCCESS
- ✅ Tests: 74/74 passing (Cobertura extendida)

### Próximos Pasos Sugeridos

1. **Commit Phase 16**: Revisar cambios y hacer commit manual.
2. **Fix seguridad password** (3-4h) - Requiere backend.
3. **Actualizar documentación**: architecture-front.md, tutorial-front.md, test-guide.md.

---

**Última actualización:** 2025-12-14 (Phase 16 Completed)
