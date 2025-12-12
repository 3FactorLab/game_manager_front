# Pendientes - Frontend

## 🔴 Seguridad (Alta Prioridad)

### Cambio de Contraseña

(REQUIERE BACKEND UPDATE)
⚠️ **Nota de Seguridad:** Como usamos el endpoint existente `PUT /users/update`, NO valida la contraseña actual. Esto significa que cualquiera con acceso a la sesión puede cambiar la contraseña sin saber la anterior.

**Para producción:** Recomendaría crear el endpoint dedicado `POST /users/change-password` que valide la contraseña actual.

---

## ⚠️ Mejoras Pendientes (Media Prioridad)

---

### 🔍 Search & Sort (Alta Prioridad)

- [ ] **Buscador Avanzado (Search Engine)**: Implementar búsqueda por texto en tiempo real con debouncing y highlighting de resultados.
- [ ] **Ordenación (Sorting)**: Implementar filtros de ordenación en el catálogo (Precio ASC/DESC, Fecha, Alfabético).

---

### 📡 Backend Refactoring (Tech Debt)

- [ ] **Validación Zod Unificada**: Migrar de `express-validator` a `Zod` en el backend.
  - **Beneficio Principal**: _Code Sharing_. Permite compartir schemas con el frontend, evitando duplicidad de reglas (ej: "password min 8 chars").
  - **Beneficio Secundario**: _Type Inference_. Zod genera automáticamente los tipos TS (`z.infer`), garantizando que la validación y el tipo de dato siempre coincidan.
  - **Nota**: Requiere crear un middleware adaptador para Express.
- [ ] **Tests Unitarios**: Extender la cobertura de tests unitarios (con Mocks) para lógica de negocio compleja.

---

## ✅ Completado Recientemente

### Fase 5: Rutas de Archivos Estáticos

- ✅ Corregidas 2 referencias que usaban `/public/game_manager_icon.png` a `/game_manager_icon.png`.
- ✅ Resuelto warning de Vite.

### Fase 1: Type Safety y Error Handling

- ✅ Eliminados 12 usos de `any` (92% reducción de errores de lint)
- ✅ Creados tipos TypeScript para RAWG API
- ✅ Error handling centralizado con `error.util.ts`
- ✅ Logger para desarrollo/producción

### Fase 2: Error Boundaries

- ✅ Componente `ErrorBoundary` implementado
- ✅ Integrado en `App.tsx`
- ✅ UI de fallback user-friendly

### Fase 4: Token Refresh Logic

- ✅ Soporte backend `/api/users/refresh-token`
- ✅ Auto-refresh en frontend sin logout
- ✅ Persistencia segura en localStorage

### Fase 3: Style Refactoring (Clean Code)

- ✅ Eliminados 100% estilos inline (70+ instancias)
- ✅ Implementados CSS Modules para todas las páginas
- ✅ Estandarización de `api.client.ts` logs (dev-only)
- ✅ Migración de 6ª Screenshot completada y verificada
- ✅ Internacionalización (i18n) activada con toggle EN/ES
- ✅ Rutas estáticas corregidas (`/public` prefix removed)

---

## 📝 Notas Técnicas

### Errores de Lint Restantes

- **1 error:** Fast refresh warning en `AuthContext.tsx` (no crítico, issue conocido de React)

### Build Status

- ✅ TypeScript compilation: SUCCESS
- ✅ Vite build: SUCCESS
- ✅ Tests: 38/38 passing

### Próximos Pasos Sugeridos

1. Fix seguridad password (3-4h) - Requiere backend

---

**Última actualización:** 2025-12-12
