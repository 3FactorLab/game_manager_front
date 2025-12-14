# Prompt de Comportamiento para IA (Frontend)

Este documento define las reglas y expectativas para la IA asistente integrada en Antigravity, con foco en el desarrollo frontend de `GameManager`.

## 1. Stack Tecnológico (OBLIGATORIO)

- **Framework**: React 18+ (Vite).
- **Lenguaje**: TypeScript (Strict Mode).
- **Estado Servidor**: `@tanstack/react-query` (v5). **PROHIBIDO** usar `useEffect` para data fetching.
- **Estado UI**: React Context API. **PROHIBIDO** introducir Redux, Zustand o Recoil.
- **Estilos**: CSS Modules (`*.module.css`) + Variables CSS (`index.css`). **PROHIBIDO** Tailwind o Inline Styles.
- **Testing**: Vitest + React Testing Library. **PROHIBIDO** Jest (como runner) o Enzyme.
- **Router**: React Router v6+.

## 2. Formato y Calidad de Código

- **Comentarios Académicos**:
  - Cada archivo debe tener un bloque inicial JSDoc explicando su propósito.
  - Cada componente/función exportada debe tener JSDoc.
- **Limpieza**:
  - **PROHIBIDO** dejar `console.log` en el código final. Usar un Logger utility si es necesario.
  - Eliminar código muerto o comentado inmediatamente.
- **Limpieza de Imports**:
  - **OBLIGATORIO**: Ejecutar `npm run lint:fix` después de refactorings que muevan código entre archivos.
  - **Casos críticos**: Separación de archivos (Context split), eliminación de features, refactoring de dependencias.
  - **Verificación**: `npm run lint` debe pasar sin errores de imports no utilizados.
  - **Regla**: Si moviste código entre archivos, SIEMPRE ejecuta `npm run lint:fix`.

## 3. Testing Strategy (Vitest)

- **Runner**: Usar siempre `vitest`.
- **Mocks**: Usar `vi.mock()` y `vi.spyOn()`. **PROHIBIDO** `jest.mock()`.
- **Interacciones**: Usar `userEvent` de `@testing-library/user-event` en lugar de `fireEvent` siempre que sea posible.
- **Aislamiento**: Los tests no deben depender del backend real (usar MSW o Mocks).

## 4. Strict Typing

- **PROHIBIDO**: Usar `any`.
- **Interfaces**:
  - Usar interfaces compartidas (`src/types/*.ts`) para entidades de negocio (`Game`, `User`).
  - No usar `unknown[]` para listas de entidades; tipar correctamente (ej: `Game[]`).
- **Props**: Todas las props de componentes deben estar tipadas explícitamente.

## 5. Context Pattern (React Context API)

### Estructura de Archivos (2-File Pattern)

Cada Context debe separarse en **2 archivos independientes**:

1. **`Context.tsx`**: Context definition + Custom Hook
2. **`Provider.tsx`**: Provider component implementation

**Ejemplo de estructura**:

```
src/features/auth/
├── AuthContext.tsx    ← Context + useAuth hook
└── AuthProvider.tsx   ← AuthProvider component
```

### Context.tsx (Context + Hook)

```typescript
/**
 * AuthContext.tsx
 * Authentication context definition and custom hook.
 */
import { createContext, useContext } from "react";
import type { User, LoginCredentials } from "./types";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// IMPORTANTE: Exportar el Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// IMPORTANTE: Exportar el hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Provider.tsx (Provider Component)

```typescript
/**
 * AuthProvider.tsx
 * Authentication provider component implementation.
 */
import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../../services/auth.service";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Imports Correctos

**En `main.tsx` (Provider)**:

```typescript
// ✅ CORRECTO - Provider desde Provider.tsx
import { AuthProvider } from "./features/auth/AuthProvider";

// ❌ INCORRECTO
import { AuthProvider } from "./features/auth/AuthContext";
```

**En componentes (Hook)**:

```typescript
// ✅ CORRECTO - Hook desde Context.tsx
import { useAuth } from "../features/auth/AuthContext";

// ❌ INCORRECTO
import { useAuth } from "../features/auth/AuthProvider";
```

### Razones del Patrón

1. **Fast Refresh Compliance**: Evita warnings de ESLint `react-refresh/only-export-components`
2. **Separation of Concerns**: Context definition separada de implementación
3. **Mantenibilidad**: Archivos más pequeños y enfocados (50-100 líneas vs 150-200)
4. **Best Practices**: Sigue recomendaciones oficiales de React y Vite

### PROHIBIDO

- ❌ Exportar Provider y Hook del mismo archivo
- ❌ Usar `export default` para Contexts o Providers (usar `export const`)
- ❌ Crear Contexts sin seguir el patrón 2-file
- ❌ Importar Hook desde Provider.tsx o Provider desde Context.tsx

### Scripts de Automatización

Para refactorizar Contexts legacy, usar:

```bash
# Separar Context en 2 archivos
node scripts/split-context.js <contextName>

# Actualizar imports
node scripts/update-imports.js <contextName>

# Validar refactor
npm run validate:phase16
```

## 6. Comportamiento de la IA

- **Refactorización**: Si tocas un archivo y ves deuda técnica (ej: estilos inline), arréglala.
- **Context Legacy**: Si encuentras un Context que mezcla Provider y Hook en el mismo archivo, refactorízalo usando el patrón 2-file con los scripts disponibles.
- **Seguridad**: No comprometer la seguridad del cliente (XSS, datos sensibles en localStorage).
- **Monorepo Readiness**: Mantener la estructura `features/` limpia y desacoplada para facilitar la futura migración.
