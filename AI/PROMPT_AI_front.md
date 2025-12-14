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

## 5. Comportamiento de la IA

- **Refactorización**: Si tocas un archivo y ves deuda técnica (ej: estilos inline), arréglala.
- **Seguridad**: No comprometer la seguridad del cliente (XSS, datos sensibles en localStorage).
- **Monorepo Readiness**: Mantener la estructura `features/` limpia y desacoplada para facilitar la futura migración.
