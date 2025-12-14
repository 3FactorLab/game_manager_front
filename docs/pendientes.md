# Pendientes Frontend

## 🚨 Alta Prioridad (Critical)

### Seguridad

- [ ] **Cambio de Contraseña Seguro** (Requiere Backend Update)
  - **Problema**: `PUT /users/update` no valida contraseña actual.
  - **Acción**: Implementar `POST /users/change-password` que requiera `currentPassword`.
  - **Impacto**: Prevenir secuestro de cuentas en sesiones activas.

---

## ⚠️ Prioridad Media (Improvements)

### Infraestructura (Futuro Monorepo)

- [ ] **Preparación para Monorepo**
  - Mover `frontend` y `backend` a raíz común.
  - Configurar `npm workspaces`.
  - Crear `packages/shared-types` y `packages/shared-utils`.

### Performance Upgrade (Elite Status)

- [ ] **[PLAN] Performance Upgrade (Phases 3 & 4)**
  - **Documento Maestro**: [`performance-upgrade.md`](file:///Users/andydev/game%20manager%20v0/frontend/docs/plans/performance-upgrade.md)
  - **Objetivo**: LCP < 2.5s (3G) y 60fps scrolling constante.
  - **Scope**:
    1.  **Imágenes Responsivas**: Integración de CDN y `srcSet` en `LazyImage` (sin refactor backend).
    2.  **Virtualización**: Implementar `react-window` para el Grid del Catálogo (rendimiento de memoria constante).
    3.  **Bundle Tuning**: Tree-shaking agresivo de iconos no utilizados.

---

## ✅ Historial de Completados

### Phase 17: End-to-End Performance (2025-12-14)

- **Backend Optimization**:
  - ✅ **Gzip Compression**: Activada en `server.ts` (~70% reducción payload).
  - ✅ **SafetyNet**: Script `validate-phase1.js` para asegurar integridad del backend.
- **Frontend Optimization**:
  - ✅ **Lazy Loading**: Migración a `React.lazy` + `Suspense` en todas las rutas.
  - ✅ **Smart Prefetching**: Datos de juego precargados al hacer hover (`Zero-latency`).
  - ✅ **UX Elements**: Componente `LazyImage` con Skeleton y soporte nativo.
  - ✅ **Strict QA**: Script `validate-phase2.js` y tests E2E para flujos críticos.

### Phase 16: Fast Refresh & Optimizations (2025-12-14)

- **Code Quality**:
  - ✅ **Logs**: Eliminado `console.error` de producción (Reemplazado por `logger`).
  - ✅ **Testing**: Eliminados 19 usos de `any` en tests (`GameDetails`, `CheckoutPage`, etc).
  - ✅ **Coverage**: Cobertura de tests unitarios y de integración verificada (74/74 passing).
- **Architecture**:
  - ✅ **Context Pattern**: Refactor 2-File Pattern en Auth, Cart, Wishlist.
  - ✅ **DX**: Fast Refresh warnings eliminados.
- **Documentation**:
  - ✅ **Audit**: Reporte de auditoría completado (9.4/10).
  - ✅ **Guides**: Arquitectura y Tutorial actualizados.

### Phase 15: Infraestructura Future-Proof

- ✅ **Dynamic Proxy**: Configuración automática en Vite.
- ✅ **Env Security**: Validación de puerto 3500.

### Phase 14: Frontend Hardening

- ✅ **Strict Typing**: Tipado fuerte en API (`Game[]`).
- ✅ **React Query**: Migración completa de WishlistContext.
- ✅ **Clean Code**: Limpieza general de logs antiguos.

### Phase 12-13: Backend Modernization

- ✅ **Test Isolation**: Fixes críticos en tests de backend.
- ✅ **Zod Integration**: Validación robusta en backend.

### Phases 1-11 (Resumen)

- ✅ **Auth**: Token Refresh, Auto-login, Persistence.
- ✅ **Features**: Search, Filter, Sort, Pagination.
- ✅ **UI**: Error Boundaries, Loaders, CSS Modules.
- ✅ **Docs**: Base documental académica establecida.

---

## 📝 Notas Técnicas

### Estado Actual (2025-12-14)

- **Tests**: 74/74 passing (100% coverage).
- **Lint**: 0 errores en src (19 en tests).
- **Build**: Success.
- **Documentation**: 100% Complete.

### Próximos Pasos

1. Eliminar `console.error` residual (High Priority).
2. Planificar fix de contraseña backend (High Priority).
3. Mantener documentación actualizada.
