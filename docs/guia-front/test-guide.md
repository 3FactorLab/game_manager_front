# 🧪 Guía de Testing Frontend

> **Estándar**: Academic Quality & Reliability
> **Runner**: Vitest
> **Library**: React Testing Library

Este documento define la estrategia, herramientas y estándares para el aseguramiento de la calidad (QA) en el frontend.

## 🎯 Filosofía de Testing

Nuestra estrategia se basa en **"Testing as a User"**:

1.  **No testeamos detalles de implementación**: No nos importa si el estado es `useState` o `Redux`. Nos importa si el usuario ve el cambio en pantalla.
2.  **Interacciones Reales**: Preferimos `userEvent` sobre `fireEvent` porque simula mejor el comportamiento del navegador (focus, blur, input, etc.).
3.  **Aislamiento**: Los tests unitarios no hacen llamadas de red reales. Todo se mockea (MSW o vi.mock).
4.  **Zero Fragility**: Evitamos selectores por clase CSS o ID. Usamos roles semánticos (`getByRole`, `getByLabelText`).

---

## 🛠️ Stack Tecnológico

| Herramienta                     | Propósito              | Justificación                                                               |
| :------------------------------ | :--------------------- | :-------------------------------------------------------------------------- |
| **Vitest**                      | Runner & Assertion Lib | Rápido, nativo de Vite, API compatible con Jest.                            |
| **RTL (React Testing Library)** | Renderizado & Querying | Impone buenas prácticas de accesibilidad y "User-Centric Testing".          |
| **user-event**                  | Simulación de Eventos  | Simula interacciones complejas (tecleo, drag & drop) mejor que `fireEvent`. |
| **MSW (Mock Service Worker)**   | API Mocking            | Intercepta requests a nivel de red, desacoplando el test del backend real.  |

---

## 🧩 Tipos de Tests

### 1. Tests Unitarios (Component Components)

Verifican componentes aislados (Atomos/Moléculas).

- **Ejemplo**: `Button.test.tsx`
- **Objetivo**: Asegurar que las props (`variant`, `isLoading`) renderizan correctamente.
- **Mocking**: Mínimo.

### 2. Tests de Integración (Feature Components)

Verifican flujos completos dentro de una página o gran componente.

- **Ejemplo**: `LoginPage.test.tsx`, `GameDetails.test.tsx`
- **Objetivo**: Verificar que el usuario puede interactuar con varios componentes y que la lógica de negocio (hooks/context) responde bien.
- **Mocking**: Context Providers (`AuthProvider`), API Hooks.

---

## 📝 Estándares de Código (Guidelines)

### A. Estructura AAA (Arrange, Act, Assert)

Todo test debe seguir visualmente esta triada:

```typescript
it("should login successfully", async () => {
  // 1. Arrange (Preparar)
  render(<LoginPage />);
  const emailInput = screen.getByLabelText(/email/i);

  // 2. Act (Ejecutar)
  await userEvent.type(emailInput, "user@test.com");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  // 3. Assert (Verificar)
  expect(mockLogin).toHaveBeenCalledWith("user@test.com", expect.anything());
});
```

### B. Prohibido `any`

El uso de `any` en tests oculta errores de refactorización. Usar `vi.mocked()` para preservar tipos en mocks.

```typescript
// ❌ Incorrecto
(authService.login as any).mockResolvedValue(user);

// ✅ Correcto
vi.mocked(authService.login).mockResolvedValue(mockUser);
```

### C. Selectores de Accesibilidad

Prioridad de selectores (The "Testing Library Priority"):

1.  `getByRole` (button, textbox, heading) - **Preferido**
2.  `getByLabelText` (inputs)
3.  `getByText` (botones, mensajes)
4.  `getByTestId` - **Último recurso**

---

## 🚦 Ejecución de Tests

```bash
# Correr todos los tests
npm test

# Correr en modo UI (Dashboard visual)
npm run test:ui

# Ver cobertura
npm run test:coverage
```

## 🔍 Cobertura de Flujos Críticos

Actualmente (Diciembre 2025), garantizamos 100% de cobertura en:

1.  **Autenticación**: Login, Register con validación Zod.
2.  **Catálogo**: Renderizado de Grid, Paginación, Filtros.
3.  **Checkout**: Flujo de compra completo.
4.  **Admin**: Gestión de usuarios, stats y juegos.
