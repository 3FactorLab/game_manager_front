# 📖 Explicación del Proyecto (Frontend)

> **Proyecto**: Game Manager v0 (Cliente Web)
> **Versión**: 1.0.0 (Production Ready)
> **Stack**: React 18, TypeScript Strict, Vite, TanStack Query

## 🌟 Resumen Ejecutivo

Este proyecto representa el **estado del arte** en desarrollo frontend moderno. No es simplemente una interfaz de usuario; es una **aplicación de ingeniería de software** construida bajo estándares de robustez, escalabilidad y mantenibilidad propios de entornos enterprise.

El objetivo académico fue superar la implementación típica de "CRUD con React" para construir un sistema resiliente con estrategias avanzadas de caché, seguridad en profundidad y una arquitectura modular orientada a dominios (DDD).

---

## 🏛️ Filosofía de Ingeniería: Los 4 Pilares

### 1. Feature-Driven Modular Architecture (Vertical Slicing)

A diferencia de la organización tradicional "por capas" (Componentes/Hooks/Servicios en carpetas separadas), hemos adoptado una **Arquitectura Vertical**.

- **Features autoconteindas**: Cada módulo (`auth`, `games`, `admin`) contiene su propia lógica, UI y estado.
- **Beneficio**: Permite escalar el equipo de desarrollo sin conflictos de merge y facilita la eliminación de código muerto.
- **Principio**: _"Colocate code that changes together."_

### 2. Validation Driven Development (VDD)

La calidad no es un accidente, es un requisito ejecutable.

- **Integrity Scripts**: Scripts automatizados (`validate-phaseX.js`) auditan el código antes de cada commit, prohibiendo deuda técnica como `console.log` o tipos `any`.
- **Compliance as Code**: Las reglas arquitectónicas se hacen cumplir mediante herramientas, no solo documentación.

### 3. Estrategia de Estado Híbrido (State Management)

Rechazamos el uso de una única "Global Store" (como Redux) en favor de herramientas especializadas:

- **Server State (React Query)**: Para datos asíncronos, con caché inteligente (`staleTime`), reintentos automáticos y deduplicación de peticiones.
- **Client State (Context API)**: Exclusivamente para estados globales reales como `Auth` y `Theme`.
- **URL State**: La URL es la "única fuente de verdad" para filtros y paginación, permitiendo compartir enlaces profundos.

### 4. Zero-Trust Security Frontend

Asumimos que el cliente es un entorno hostil.

- **Dual Token Rotation**: Implementación completa de Access/Refresh tokens con intercepción silenciosa de errores 401.
- **Strict Content Escaping**: Prevención de XSS mediante sanitización automática de React.
- **Role-Based Access Control (RBAC)**: Rutas protegidas que verifican permisos antes de cargar el código del módulo (Lazy Loading).

---

## 🛠️ Stack Tecnológico de Vanguardia

| Tecnología         | Rol en el Proyecto | ¿Por qué esta elección?                                           |
| :----------------- | :----------------- | :---------------------------------------------------------------- |
| **React 18**       | UI Library         | Concurrent Features, Suspense y Batching automático.              |
| **Vite**           | Build Tool         | HMR instantáneo y Builds optimizados con Rollup.                  |
| **TanStack Query** | Data Sync          | Elimina el 90% del boilerplate de `useEffect` para data fetching. |
| **Zod**            | Validation         | Validación de esquemas en tiempo real y tipado estático inferido. |
| **Vitest**         | Testing            | Ejecución nativa de ESM, 3x más rápido que Jest.                  |
| **CSS Modules**    | Styling            | Scoped CSS sin el overhead de runtime de CSS-in-JS.               |

---

---

## 🔄 Flujo de Datos: La Vida de una Acción

Veamos qué ocurre exactamente cuando un usuario hace clic en "Añadir a Wishlist" ❤️. Este flujo ilustra la **Optimistic UI**:

1.  **Interacción**: El usuario hace clic.
2.  **Event Handler + Hook**: El componente llama a `addToWishlist` (del custom hook `useWishlist`).
3.  **Optimistic Update**:
    - Antes de hablar con el servidor, React Query **actualiza la caché local inmediatamente**.
    - El icono del corazón se vuelve rojo 🔴 instantáneamente (0ms de latencia percibida).
4.  **API Request**:
    - El servicio `user.service` envía `POST /wishlist`.
    - El `api.client` intercepta, inyecta el `Bearer Token`.
5.  **Server Response**:
    - **Éxito**: La UI se confirma silenciosamente.
    - **Error**: React Query hace **Rollback automáticamenter** al estado anterior y muestra un Toast de error.
    - _Token Expirado (401)_: El interceptor pausa la petición, renueva el token usando el Refresh Token, y reintenta la original transparentemente.

---

## ⚡ UX Performance: Más allá de lo funcional

La aplicación implementa patrones de UX avanzados:

- **Optimistic Updates**: La interfaz reacciona instantáneamente (ej: ❤️ Wishlist) y se sincroniza en segundo plano. Si falla, hace rollback automático.
- **Prefetching on Hover**: Anticipamos la intención del usuario cargando datos de juegos antes del clic.
- **Code Splitting**: Cada ruta es un chunk separado cargado bajo demanda (`React.lazy`).
- **Skeleton Screens**: Feedback visual inmediato durante la carga para reducir la percepción de latencia.

---

## 🚀 Cómo Empezar (Developer Experience)

El proyecto está configurado para un **onboarding inmediato**:

1.  **Instalación**:

    ```bash
    npm install
    ```

2.  **Desarrollo**:

    ```bash
    npm run dev
    ```

    _Inicia el servidor en `localhost:5173` con proxy configurado al backend._

3.  **Auditoría de Calidad**:
    ```bash
    npm test          # Ejecuta 86+ tests unitarios y de integración
    npm run lint      # Análisis estático de código
    ```

---

## 📚 Mapa de Documentación

Para una inmersión profunda, consulte los documentos especializados en `docs/principal/`:

- 🏗️ **[architecture-front.md](./architecture-front.md)**: El "plano" técnico. Diagramas Mermaid de flujos complejos.
- 📘 **[tutorial-front.md](./tutorial-front.md)**: La "Biblia" del código. Explicación archivo por archivo.
- 🧪 **[tests-guide.md](./tests-guide.md)**: Estrategia de QA, philosophy de testing y ejemplos.
- 📜 **[final_info/audit_certificate.md](./final_info/audit_certificate.md)**: Certificación de calidad y logs de auditoría.
