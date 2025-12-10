# Pendientes - Frontend

## 🔴 Seguridad (Alta Prioridad)

### Cambio de Contraseña

(REQUIERE BACKEND UPDATE)
⚠️ **Nota de Seguridad:** Como usamos el endpoint existente `PUT /users/update`, NO valida la contraseña actual. Esto significa que cualquiera con acceso a la sesión puede cambiar la contraseña sin saber la anterior.

**Para producción:** Recomendaría crear el endpoint dedicado `POST /users/change-password` que valide la contraseña actual.

---

## ⚠️ Mejoras Pendientes (Media Prioridad)

### 1. Eliminar Inline Styles (4-6 horas)

**Estado:** 70+ instancias encontradas

**Archivos afectados:**

- `pages/LibraryPage.tsx` - 17 instancias
- `features/auth/pages/LoginPage.tsx` - 10 instancias
- `features/auth/pages/RegisterPage.tsx` - 10 instancias
- `pages/admin/*` - 20+ instancias
- `pages/GameDetails.tsx` - 10+ instancias
- `components/layout/Navbar.tsx` - 7 instancias
- Otros archivos - 13 instancias

**Acción requerida:** Mover todos los estilos inline a CSS modules para mejor mantenibilidad y consistencia.

### 2. Completar Internacionalización (i18n) (15 minutos)

**Estado:** Traducciones españolas existen pero no están cargadas

**Archivo:** `lib/i18n.ts`

**Cambio necesario:**

```typescript
// Añadir import
import es from "../locales/es.json";

// Actualizar configuración
resources: {
  en: { translation: en },
  es: { translation: es }, // ← Añadir esta línea
}
```

### 3. Token Refresh Logic (4-6 horas)

**Estado:** No implementado

**Requiere:**

- Soporte del backend (endpoint `/api/auth/refresh`)
- Actualizar `api.client.ts` con lógica de refresh
- Actualizar `auth.service.ts` para manejar refresh tokens
- Guardar/limpiar refresh tokens en localStorage

**Beneficio:** Usuarios no serán deslogueados inesperadamente cuando expire el token.

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
- ✅ Logging automático de errores

---

## 📝 Notas Técnicas

### Errores de Lint Restantes

- **1 error:** Fast refresh warning en `AuthContext.tsx` (no crítico, issue conocido de React)

### Build Status

- ✅ TypeScript compilation: SUCCESS
- ✅ Vite build: SUCCESS
- ✅ Tests: 28/28 passing

### Próximos Pasos Sugeridos

1. Completar i18n (15 min) - Rápido y fácil
2. Eliminar inline styles (4-6h) - Mejora mantenibilidad
3. Token refresh (4-6h) - Requiere backend
4. Fix seguridad password (3-4h) - Requiere backend

---

**Última actualización:** 2025-12-10
