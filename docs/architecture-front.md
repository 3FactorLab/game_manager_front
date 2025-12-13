# Arquitectura del Frontend (Component-Based + Feature-Driven)

Este documento explica en profundidad cómo está construido el frontend, **por qué** se tomaron ciertas decisiones y cómo fluyen los datos a través del sistema React.

## 🏛️ Filosofía: Arquitectura Basada en Componentes + Features

En lugar de tener todo el código mezclado, organizamos el proyecto en **componentes reutilizables** y **features autocontenidos**. Cada pieza tiene una **responsabilidad única** y puede evolucionar independientemente.

### ¿Por qué hacemos esto?

Imagina una tienda de LEGO:

- **Los Bloques Básicos** (UI Components) son piezas reutilizables: botones, tarjetas, inputs.
- **Los Sets Temáticos** (Features) son colecciones completas: autenticación, catálogo de juegos, carrito.
- **Las Instrucciones** (Hooks) dicen cómo usar y combinar las piezas.
- **El Almacén** (Services) es donde pedimos más piezas cuando las necesitamos.

Si cada set viniera con sus propios bloques únicos que no puedes reusar, sería un desperdicio. En nuestro código pasa lo mismo.

---

## 📊 Diagrama de Arquitectura (Vista General)

Este diagrama muestra la relación macro entre las capas del sistema.

```mermaid
flowchart TD
    %% ============================================
    %% ESTILOS GLOBALES & Nodos Externos
    %% ============================================
    User([👤 Usuario])
    Backend[(🔌 Backend API)]

    %% ============================================
    %% CAPAS DEL FRONTEND (Jerarquía Vertical)
    %% ============================================

    subgraph Infra ["1. Infraestructura & Routing"]
        style Infra fill:#FFF,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
        Router["🛣️ App Router (React Router v7)<br/>(Entry Point)"]
        ErrorBoundary["🛡️ Error Boundary<br/>(Global Trap)"]
    end

    subgraph Presentacion ["2. Capa de Presentación (UI)"]
        style Presentacion fill:#E3F2FD,stroke:#1565C0,stroke-width:2px
        Pages["📄 Pages<br/>(Home/Catalog/Library)"]
        Components["🧩 UI Components<br/>(Cards/Buttons/Modals)"]
    end

    subgraph StateLayer ["3. Middleware de Estado (Contexts)"]
        style StateLayer fill:#E1F5FE,stroke:#0277BD,stroke-width:2px
        AuthContext["🔐 Auth Context<br/>(Session & Tokens)"]
        GloblContext["🌍 Global Contexts<br/>(Wishlist/Cart/Theme)"]
    end

    subgraph Orchestration ["4. Orquestación (Custom Hooks)"]
        style Orchestration fill:#FFEBEE,stroke:#C62828,stroke-width:2px
        Hooks["🪝 Logic Hooks<br/>(useGames, useAuth, useCheckout)"]
        ReactQuery["⚡ React Query<br/>(Server State Cache)"]
    end

    subgraph DataLayer ["5. Capa de Datos (Services)"]
        style DataLayer fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
        Services["📦 Services<br/>(Auth/Games/User)"]
        APIClient["🔧 Axios Client<br/>(Interceptors)"]
    end

    subgraph SideEffects ["6. Efectos Laterales"]
        style SideEffects fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px
        Storage[(💾 LocalStorage)]
        Toaster[🔔 Toaster]
        EventBus((📢 EventBus))
    end

    %% ============================================
    %% FLUJO PRINCIPAL (Numbered Flow)
    %% ============================================

    %% 1. Entrada
    User -->|1. Interacción/URL| Router
    Router -->|2. Renderiza| ErrorBoundary
    ErrorBoundary --> Pages

    %% 2. Construcción UI
    Pages --> Components
    Pages -.->|Lee Estado| AuthContext
    Pages -.->|Lee Estado| GloblContext

    %% 3. Disparo de Lógica
    Components -->|3. User Action| Hooks
    Pages -->|3. Lifecycle Event| Hooks

    %% 4. Proceso de Lógica
    Hooks -->|4. Verifica/Actualiza| AuthContext
    Hooks -->|5. Gestiona Cache| ReactQuery

    %% 5. Petición de Datos
    ReactQuery -->|6. Fetch| Services
    AuthContext -->|6. Login/Refresh| Services

    %% 6. Salida a Red
    Services -->|7. Request| APIClient
    APIClient <-->|8. HTTP| Backend

    %% 7. Retorno y Actualización
    Services -->|9. Response Data| ReactQuery
    ReactQuery -->|10. Re-Render| Hooks
    Hooks -->|11. Update UI| Pages
    Pages -->|12. Feedback| User

    %% ============================================
    %% CONEXIONES DE SIDE EFFECTS
    %% ============================================
    AuthContext -.->|Persist Token| Storage
    GloblContext -.->|Persist Cart| Storage
    Services -.->|Show Success/Error| Toaster
    APIClient -.->|Force Logout| EventBus
    EventBus -.->|Trigger| AuthContext

    %% ============================================
    %% ESTILOS DE NODOS
    %% ============================================
    style User fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px,color:#000
    style Backend fill:#C8E6C9,stroke:#388E3C,stroke-width:2px,color:#000

    style Router fill:#FAFAFA,stroke:#9E9E9E,stroke-width:1px,color:#000
    style ErrorBoundary fill:#FAFAFA,stroke:#9E9E9E,stroke-width:1px,color:#000

    style Pages fill:#BBDEFB,stroke:#1976D2,stroke-width:1px,color:#000
    style Components fill:#BBDEFB,stroke:#1976D2,stroke-width:1px,color:#000

    style AuthContext fill:#B2DFDB,stroke:#00695C,stroke-width:1px,color:#000
    style GloblContext fill:#B2DFDB,stroke:#00695C,stroke-width:1px,color:#000

    style Hooks fill:#FFCDD2,stroke:#C62828,stroke-width:1px,color:#000
    style ReactQuery fill:#FFCDD2,stroke:#C62828,stroke-width:1px,color:#000

    style Services fill:#E1BEE7,stroke:#7B1FA2,stroke-width:1px,color:#000
    style APIClient fill:#E1BEE7,stroke:#7B1FA2,stroke-width:1px,color:#000

    style Storage fill:#FFE0B2,stroke:#E65100,stroke-width:1px,color:#000
    style Toaster fill:#FFE0B2,stroke:#E65100,stroke-width:1px,color:#000
    style EventBus fill:#FFE0B2,stroke:#E65100,stroke-width:1px,color:#000
```

### 🎨 Leyenda de Colores

| Color           | Capa / Responsabilidad     | Ejemplo                      |
| :-------------- | :------------------------- | :--------------------------- |
| 🟨 **Amarillo** | **Usuario**                | Interacción humana           |
| 🟦 **Azul**     | **Presentación**           | Pages, Layout, UI Components |
| 🟥 **Rojo**     | **Lógica / Estado Server** | React Query, Custom Hooks    |
| 🟩 **Verde**    | **Backend / Externo**      | API, Base de Datos           |
| 🟪 **Morado**   | **Datos / Servicios**      | Axios Client, Services       |
| ⬜ **Gris**     | **Infraestructura**        | Error Boundary               |

---

## 📂 Estructura del Proyecto

Visualización jerárquica de los componentes principales:

```text
src/
├── components/         # UI Reutilizable
│   ├── ui/             # Atoms (Button, Card, Input)
│   ├── layout/         # Estructura (Navbar, Footer)
│   └── ErrorBoundary.tsx
├── features/           # Módulos de Negocio (Vertical Slicing)
│   ├── auth/           # Login, Register, Session
│   ├── games/          # Catálogo, Detalles, Filtros
│   ├── collection/     # Biblioteca de Usuario
│   ├── wishlist/       # Lista de Deseos (Context)
│   ├── cart/           # Carrito de Compras
│   ├── checkout/       # Procesamiento de Pagos
│   └── profile/        # Avatar, Datos de Usuario
├── hooks/              # Global Hooks (useAdmin)
├── pages/              # Vistas Principales (Rutas)
├── services/           # Comunicación HTTP
│   ├── api.client.ts   # Axios Instance + Interceptors
│   ├── auth.service.ts # AuthService
│   └── games.service.ts
├── lib/                # Configuración (QueryClient, i18n)
├── routes/             # AppRoutes, ProtectedRoute
├── types/              # Definiciones TypeScript
└── utils/              # Helpers puros (Format, Error)
```

---

## 🧩 Componentes del Sistema (Capas Detalladas)

### 1. Configuración (`src/lib/`)

Aquí viven las configuraciones globales de la aplicación.

- **`queryClient.ts`**: Configura React Query con políticas de caché, reintento y refetch. **Estrategia**: Datos frescos por 5 minutos, caché por 30 minutos.
- **`i18n.ts`**: Configura internacionalización con i18next. Carga traducciones de inglés (`en`) y español (`es`) con persistencia en localStorage.

### 2. Features (`src/features/`)

Cada feature es un **módulo autocontenido** con todo lo necesario para funcionar:

- **`auth/`**: Autenticación y sesión
  - `AuthContext.tsx`: Gestiona el estado global de autenticación
  - `hooks/`: `useUpdateProfile`
  - `pages/`: `LoginPage`, `RegisterPage`
  - `schemas.ts`: Validación con Zod
- **`games/`**: Catálogo de juegos
  - `hooks/`: `useGames` (infinite scroll), `useGameDetails`
  - `components/`: `GameCard`
- **`collection/`**: Biblioteca y wishlist
  - `hooks/`: `useLibrary`, `useWishlist` (Mutation hooks)
  - `services/`: usa `games.service.ts` (Library) y `user.service.ts` (Wishlist)
- **`wishlist/`**: Gestión de lista de deseos (Context-based)
  - `WishlistContext.tsx`: Context API para wishlist con **optimistic updates**
  - Alternativa a `useWishlist` hook, usado por `WishlistPage` para mejor UX
- **`cart/`**: Carrito de compras
  - `CartContext.tsx`: Context API para carrito con persistencia en localStorage
  - Gestión de items, total y contador
- **`checkout/`**: Proceso de compra
  - `hooks/`: `useCheckout`
  - `services/`: `checkout.service.ts`
- **`profile/`**: Perfil de usuario
  - `hooks/`: `useUpdateProfile`
  - `components/`: `AvatarUploadModal` (Drag & Drop)

### 3. UI Components (`src/components/`)

Componentes reutilizables sin lógica de negocio:

- **`ui/`**: Componentes base
  - `Button.tsx`: Botón con variantes, tamaños y estado de carga animado (⏳)
  - `Card.tsx`: Contenedor con efecto glassmorphism
  - `Input.tsx`: Input de formulario con validación visual
  - `SearchBar.tsx`: Barra de búsqueda con navegación
  - `ImageModal.tsx`: Modal para galería de imágenes
  - `Loader.tsx`: Spinner de carga con tamaños configurables (sm/md/lg)
- **`layout/`**: Componentes de estructura
  - `MainLayout.tsx`: Layout principal con header/footer
  - `Navbar.tsx`: Navegación con menú móvil y glassmorphism
  - `UserDropdown.tsx`: Dropdown de perfil de usuario
- **`ErrorBoundary.tsx`**: Componente de manejo de errores
  - Captura errores de React en toda la aplicación
  - UI fallback amigable con glassmorphism
  - Botones de refresh y retry
- **`LanguageToggle.tsx`**: Selector de idioma (EN | ES)
  - Persistencia de preferencia de usuario
  - Integrado en Navbar (Desktop y Mobile)

### 4. Pages (`src/pages/`)

Componentes de página que orquestan features y UI:

- `Home.tsx`: Catálogo principal con infinite scroll
- `GameDetails.tsx`: Detalles de juego con compra/wishlist
- `LibraryPage.tsx`: Biblioteca del usuario
- `WishlistPage.tsx`: Lista de deseos del usuario con grid de juegos
- `CheckoutPage.tsx`: Proceso de pago
- `LandingPage.tsx`: Página de bienvenida
- `StorePage.tsx`: Página de tienda (placeholder "Coming Soon")
- `admin/`: Panel de administración

### 5. Services (`src/services/`)

Capa de comunicación con el backend. Cada servicio encapsula llamadas a la API:

- **`api.client.ts`**: Cliente Axios configurado con:
  - Base URL
  - Interceptores de request (añade token automáticamente)
  - Interceptores de response (maneja 401 con refresh token)
  - **Auto-refresh de tokens**: Detecta tokens expirados, refresca automáticamente y reintenta la petición
- **`auth.service.ts`**: Login, register, logout, getProfile, updateProfile, refreshToken
  - Gestiona tanto access token como refresh token
- **`games.service.ts`**: `getCatalog`, `getGameById`, `getMyLibrary`, `getFilters`
- **`checkout.service.ts`**: `purchaseGame`
- **`user.service.ts`**: `getWishlist`, `addToWishlist`, `removeFromWishlist` (utilizado por Context y Hooks)

### 6. Custom Hooks (`src/hooks/`)

Encapsulan lógica reutilizable con React Query:

- **`useGames`**: Infinite scroll con paginación
- **`useGameDetails`**: Fetch de detalles de un juego
- **`useLibrary`**: Biblioteca del usuario (solo si autenticado)
- **`useWishlist`**: Gestión de wishlist con mutations
- **`useCheckout`**: Proceso de compra
- **`useAdmin`**: Operaciones de administración

### 7. Routing (`src/routes/`)

- **`AppRoutes.tsx`**: Configuración de rutas con React Router v7
  - Rutas públicas: `/`, `/home`, `/store`, `/catalog`, `/game/:id`
  - Rutas protegidas: `/library`, `/wishlist`, `/orders`, `/checkout/:id`
  - Rutas admin: `/admin/*`
  - Componente `ProtectedRoute` para control de acceso

### 8. Utilities (`src/utils/`)

Funciones helper sin dependencias de React:

- **`format.ts`**: Formateo de moneda con Intl.NumberFormat
- **`error.util.ts`**: Utilidades centralizadas de manejo de errores
  - `logger`: Logging condicional (solo en desarrollo)
  - `getErrorMessage()`: Extrae mensajes de error de forma segura
  - `handleApiError()`: Manejo estandarizado con toast + logging

---

## 🔄 Dynamic Flows: Flujos Clave de Lógica

Aquí desglosamos los flujos de datos más complejos e importantes de la aplicación.

### 1. Flujo de Autenticación (Dual Token)

**Concepto**: JWT con Access Token (corta duración) y Refresh Token (larga duración) con rotación automática.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Login as ⚛️ LoginPage
    participant Auth as 🧠 AuthService
    participant Storage as 💾 LocalStorage
    participant API as 🔧 API Client
    participant Back as ☁️ Backend

    Note over User, Back: Fase 1: Inicio de Sesión
    User->>Login: 1. Ingresa Credenciales
    Login->>Auth: 2. login(email, password)
    Auth->>API: 3. POST /users/login
    API->>Back: 4. Request
    Back-->>API: 5. Response (Token + RefreshToken)
    API-->>Auth: 6. Data
    Auth->>Storage: 7. setItem('token', 'refreshToken')
    Login->>User: 9. Redirige a Home

    Note over User, Back: Fase 2: Auto-Refresh (401)
    User->>API: 10. Request Protegido
    API->>Back: Request + Bearer Token
    Back-->>API: ❌ 401 Unauthorized
    Note right of API: Interceptor captura error
    API->>Back: 🔄 POST /refresh-token
    Back-->>API: ✅ New Tokens
    API->>Storage: Update Tokens
    API->>Back: 🔄 Retry Original Request
    Back-->>API: ✅ Success Data
    API-->>User: 13. Datos Finales
```

### 2. Flujo de Wishlist (Optimistic Updates)

**Concepto**: UX Perceptiva. La interfaz responde _antes_ que el servidor.

**Paso a paso textual**:

1. Usuario hace click en el botón ❤️.
2. `WishlistContext` actualiza el estado local inmediatamente -> ❤️ se rellena.
3. Se lanza la petición al servidor en segundo plano.
4. Si el servidor responde OK: Se muestra un Toast discreto.
5. Si el error falla: Se hace **rollback** automático del estado (❤️ se vacía) y se avisa al usuario.

```mermaid
flowchart LR
    subgraph UI ["Capa de Presentación"]
        direction TB
        Component[⚛️ GameDetails]
        Event[👆 Click 'Add to Wishlist']
    end

    subgraph Logic ["Capa de Lógica"]
        direction TB
        Context[❤️ WishlistContext]
        Query[⚡ React Query Cache]
    end

    subgraph Data ["Capa de Datos"]
        direction TB
        Service[📦 User Service]
        API[🔧 API Client]
    end

    Event -->|1. Call| Context
    Context -->|2. Optimistic Update| Component
    Context -.->|3. Async Call| Service
    Service -->|4. Request| API
    API -->|5. HTTP| Backend[(☁️ Backend)]

    Backend -.->|6. Success| API
    Service -.->|8. Settlement| Context
    Context -.->|9. Sync/Rollback| Query
```

### 3. Flujo Checkout & Payment (Complejo de Negocio)

**Concepto**: Orquestación entre contextos y servicios transaccionales.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Checkout as ⚛️ CheckoutPage
    participant Cart as 🛒 CartContext
    participant Service as 📦 PaymentService
    participant Backend as ☁️ Backend

    User->>Checkout: Click "Confirmar Compra"
    Checkout->>Checkout: Bloquea UI (Loading)
    Checkout->>Cart: getCartItems()

    Checkout->>Service: processPayment(items, total)
    Service->>Backend: POST /api/payments/checkout

    alt Éxito
        Backend-->>Service: { success: true, orderId: "123" }
        Service-->>Checkout: Resolve

        par Actualización de Estado
            Checkout->>Cart: clearCart() 🗑️
            Checkout->>User: Redirige a Success Page 🎉
        end
    else Error (Sin Stock / Fondos)
        Backend-->>Service: 400 Bad Request
        Service-->>Checkout: Reject (Error)
        Checkout->>User: Muestra Toast "Error en pago" ❌
        Checkout->>Checkout: Desbloquea UI
    end
```

### 4. Flujo Upload de Avatar (Manejo de Archivos)

**Concepto**: Manejo de BLOBs y UX inmediata.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Modal as ⚛️ AvatarModal
    participant Auth as 🔐 AuthContext
    participant Storage as 💾 LocalStorage
    participant Backend as ☁️ Backend

    User->>Modal: Drag & Drop Imagen 🖼️
    Note right of Modal: 1. Preview Local (UX Inmediata)
    Modal->>Modal: FileReader.readAsDataURL()
    Modal-->>User: Muestra Preview (Base64)

    User->>Modal: Click "Guardar"
    Modal->>Auth: updateProfile(file)
    Auth->>Backend: PUT /users/profile (FormData)
    Backend-->>Auth: { profilePicture: "/new.jpg" }

    Note right of Auth: 3. Actualización Silenciosa
    Auth->>Storage: Update 'user' object
    Auth->>Modal: Success!
```

### 5. Flujo de Catálogo (Search & Filter)

**Concepto**: URL-Driven State. La URL es la "única fuente de verdad".

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant UI as ⚛️ Controles UI
    participant URL as 🔗 URL Params
    participant Hook as 🪝 useGames
    participant Service as 📦 GamesService

    User->>UI: Selecciona Filtro (ej: RPG)
    UI->>URL: setSearchParams(?genre=RPG)
    Note right of URL: React Router actualiza la URL

    Hook->>URL: Escucha cambios
    Hook->>Hook: Invalida Query Cache
    Hook->>Service: getCatalog({ genre: 'RPG' })
    Service-->>Hook: Retorna nuevos datos
    Hook-->>UI: Renderiza Grid de Juegos
```

### 6. Flujo de Protección de Rutas

**Concepto**: Guards en el lado del cliente (Client-Side Routing).

```mermaid
flowchart TD
    Start([🚀 Navegación]) --> CheckAuth{¿Está Autenticado?}

    CheckAuth -->|No| Login[🚫 Redirigir a /login]
    CheckAuth -->|Sí| CheckAdmin{¿Requiere Admin?}

    CheckAdmin -->|No| Render[✅ Renderizar Página]
    CheckAdmin -->|Sí| CheckRole{¿Role === 'admin'?}

    CheckRole -->|No| Home[🚫 Redirigir a /]
    CheckRole -->|Sí| Render
```

---

## 🎯 Arquitectura y Patrones de Diseño

Definimos nuestro estilo arquitectónico como **"Feature-Driven Modular Architecture with Component Composition"**.

Esta arquitectura se sostiene sobre **4 Pilares Fundamentales** que garantizan escalabilidad y mantenibilidad:

### 1. Feature-Driven Structure (Vertical Slicing)

En lugar de organizar el código por capas técnicas (horizontal), lo organizamos por **dominios de negocio** (vertical).

- **Antes**: Una carpeta gigante `/components` y otra `/pages`.
- **Ahora**: `/features/auth`, `/features/games`. Cada carpeta contiene _todo_ lo necesario para esa funcionalidad (sus componentes, sus hooks, sus servicios).
- **Beneficio**: Mantenibilidad extrema. Puedes borrar o refactorizar una feature sin miedo a romper otras partes del sistema.

### 2. Component Composition (LEGO Pattern)

Evitamos los "componentes monolíticos" (God Components). Construimos interfaces complejas ensamblando piezas pequeñas y reutilizables.

- **Patrón**: `GameDetailsPage` actúa como orquestador, ensamblando `<GameHero>`, `<GameInfo>` y `<PurchaseCard>`.
- **Beneficio**: Reutilización de código y tests unitarios más sencillos.

### 3. Separation of Concerns via Custom Hooks

Desacoplamos totalmente la UI de la Lógica.

- **Regla**: Los componentes visuales (JSX) **no deben** contener lógica de negocio compleja ni llamadas directas a la API.
- **Solución**: Custom Hooks (`useWishlist`, `useGames`) encapsulan el estado, efectos y llamadas a servicios.
- **Beneficio**: Te permite cambiar la implementación lógica (ej: migrar de Context a Redux) sin tocar una sola línea de la UI.

### 4. Hybrid State Strategy (Pragmatismo)

No usamos una "bala de plata" para el estado. Usamos la herramienta correcta para cada necesidad:

- **Server State (Datos Asíncronos)** → **React Query** (Caché, revalidación, deduplicación).
- **Global Client State (Sesión)** → **Context API** (Auth, Theme).
- **Ephemeral UI State (Local)** → **useState** (Formularios, Modales).

---

## 🎨 Gestión del Estado (Resumen)

| Tipo de Estado   | Herramienta      | Ejemplo                   |
| :--------------- | :--------------- | :------------------------ |
| **Server State** | React Query      | Lista de juegos, Detalles |
| **Auth State**   | Context API      | Usuario, Tokens           |
| **UI State**     | useState / Props | Formularios, Pestañas     |

### 5. Styling Strategy (Clean Code)

- **CSS Modules**: Usamos `*.module.css` para estilos locales. **Zero Inline Styles**.
- **Variables CSS**: `index.css` define el sistema de diseño (colores, espacios) con variables.
- **Glassmorphism**: Estilo visual unificado mediante clases utilitarias y variables.

---

## 🔐 Seguridad y Autenticación (Detalle Técnico)

1. **Dual Token**:
   - **Access Token**: 15 min de vida. Se envía en header `Authorization`.
   - **Refresh Token**: 7 días de vida. Se usa solo para obtener nuevos access tokens.
2. **Protección de Rutas**:
   - Wrapper `<ProtectedRoute>` verifica existencia de token valido.
   - Prop `requireAdmin` verifica `user.role === 'admin'`.
3. **Auto-Refresh**:
   - Implementado via Axios Interceptors (`src/services/api.client.ts`).

---

## 🔮 Roadmap Actualizado

### Corto Plazo

- [x] ~~Implementar lógica de refresh token~~ ✅ Completado
- [x] ~~Error Boundaries para manejo robusto de errores~~ ✅ Completado
- [x] ~~Type safety al 95%~~ ✅ Completado
- [x] ~~Cargar traducciones al español~~ ✅ Completado
- [x] ~~Mover estilos inline restantes a CSS modules~~ ✅ Completado (100% Clean Code)
- [x] ~~Implementar Buscador Avanzado (Search, Filters & Sort)~~ ✅ Completado

### Medio Plazo

- [ ] Optimistic Updates en mutations (Cart)
- [ ] Service Workers para PWA
- [ ] Integración con Sentry para tracking

### Largo Plazo

- [ ] Server-Side Rendering (SSR) con Next.js
- [ ] Testing E2E con Playwright
- [ ] Storybook para documentación
