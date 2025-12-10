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

### 3. Corregir Rutas de Archivos Estáticos (5 minutos)

**Estado:** Warning de Vite detectado

**Problema:** 2 referencias usan `/public/game_manager_icon.png` en lugar de `/game_manager_icon.png`

**Acción requerida:**

```bash
# Buscar las referencias incorrectas
grep -r "/public/game_manager_icon.png" src/
grep -r "/public/game_manager_icon.png" index.html
```

**Cambio necesario:**

```diff
-/public/game_manager_icon.png
+/game_manager_icon.png
```

**Razón:** Los archivos en `public/` se sirven desde la raíz (`/`) en Vite, no desde `/public/`.

### 4. Completar Migración de 6ª Screenshot (10 minutos)

**Estado:** ⏸️ Pendiente - Esperando que RAWG API se recupere

**Progreso:**

- ✅ Backend modificado (`rawg.service.ts`) para pedir 6 screenshots
- ✅ Script de migración creado (`update-screenshots.ts`)
- ✅ npm script agregado (`npm run update-screenshots`)
- ⏸️ Ejecución pendiente (RAWG API caída - error 502)
- ⏸️ Frontend pendiente de actualizar

**Acción requerida cuando RAWG funcione:**

**Backend:**

```bash
cd game-manager-BACK
npm run update-screenshots
```

**Frontend:**

```typescript
// En GameDetails.tsx línea 116
{game.assets.screenshots.slice(0, 6).map((screenshot, i) => (
  // ... resto del código
))}
```

**Verificación:**

- Comprobar que juegos tienen 6 screenshots en MongoDB
- Verificar que frontend muestra 6 screenshots
- Confirmar que lightbox funciona con 6 imágenes

**Nota:** Script incluye retry logic y fallback (duplicar última screenshot) si RAWG sigue caído.

### 5. Token Refresh Logic (4-6 horas)

**Estado:** ✅ Implementado (2025-12-10)

**Completado:**

- ✅ Soporte del backend (endpoint `/api/users/refresh-token`)
- ✅ Actualizado `api.client.ts` con lógica de refresh automático
- ✅ Actualizado `auth.service.ts` para manejar refresh tokens
- ✅ Guardar/limpiar refresh tokens en localStorage
- ✅ Debug logging agregado

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
