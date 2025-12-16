# Arquitectura del Frontend (Component-Based + Feature-Driven)

Este documento explica en profundidad cómo está construido el frontend, **por qué** se tomaron ciertas decisiones y cómo fluyen los datos a través del sistema React.

## 🏛️ Filosofía: Arquitectura Basada en Componentes + Features

El proyecto se organiza en **componentes reutilizables** y **features autocontenidos**. Cada pieza tiene una **responsabilidad única** y puede evolucionar independientemente.

**Principios clave**:

- **UI Components**: Piezas reutilizables (botones, tarjetas, inputs)
- **Features**: Módulos completos (autenticación, catálogo, carrito)
- **Hooks**: Lógica reutilizable
- **Services**: Capa de datos y comunicación con API

---

## 📊 Diagrama de Arquitectura (Vista General)

Este diagrama muestra la relación macro entre las capas del sistema.

```mermaid
flowchart TD
    %% ============================================
    %% NODOS EXTERNOS
    %% ============================================
    User([👤 Usuario])
    Backend[(🔌 Backend API)]

    %% ============================================
    %% PROVIDERS (Composition Hierarchy)
    %% ============================================
    ErrorBoundary["🛡️ ErrorBoundary"]
    QueryProvider["⚡ QueryClientProvider"]
    AuthProvider["🔐 AuthProvider"]
    CartProvider["🛒 CartProvider"]
    WishlistProvider["❤️ WishlistProvider"]
    Router["🛣️ BrowserRouter"]
    i18n["📚 i18n (global)"]

    %% ============================================
    %% COMPONENTES Y HOOKS
    %% ============================================
    Pages["📄 Pages<br/>(Routes)"]
    Components["🧩 UI Components"]

    %% Hooks individuales
    useAuth["🪝 useAuth()"]
    useCart["𪝰 useCart()"]
    useWishlist["𪝰 useWishlist()"]
    useGames["𪝰 useGames()"]
    useTranslation["𪝰 useTranslation()"]

    %% ============================================
    %% SERVICIOS
    %% ============================================
    AuthService["📦 AuthService"]
    GamesService["📦 GamesService"]
    UserService["📦 UserService"]
    APIClient["🔧 Axios Client<br/>(Interceptors)"]

    %% ============================================
    %% SIDE EFFECTS
    %% ============================================
    Storage[(💾 LocalStorage)]
    Toaster[🔔 Toaster]
    EventBus((📢 EventBus))

    %% ============================================
    %% FLUJO PRINCIPAL
    %% ============================================

    %% 1. Usuario → Router
    User -->|1. URL/Click| Router

    %% 2. Provider Hierarchy (Composition)
    Router -->|2. Wrap| ErrorBoundary
    ErrorBoundary -->|3. Wrap| QueryProvider
    QueryProvider -->|4. Wrap| AuthProvider
    AuthProvider -->|5. Wrap| CartProvider
    CartProvider -->|6. Wrap| WishlistProvider
    WishlistProvider -->|7. Render| Pages

    %% 3. Pages renderiza Components
    Pages -->|8. Render| Components

    %% 4. Components usan Hooks
    Pages -.->|usa| useAuth
    Pages -.->|usa| useCart
    Pages -.->|usa| useWishlist
    Pages -.->|usa| useGames
    Pages -.->|usa| useTranslation

    Components -.->|usa| useAuth
    Components -.->|usa| useCart
    Components -.->|usa| useGames

    %% 5. Hooks leen de Providers
    useAuth -.->|lee de| AuthProvider
    useCart -.->|lee de| CartProvider
    useWishlist -.->|lee de| WishlistProvider
    useGames -.->|usa| QueryProvider
    useTranslation -.->|usa| i18n

    %% 6. Hooks llaman Services
    useAuth -->|9. Call| AuthService
    useGames -->|9. Call| GamesService
    useWishlist -->|9. Call| GamesService

    %% 7. Services usan APIClient
    AuthService -->|10. Request| APIClient
    GamesService -->|10. Request| APIClient
    UserService -->|10. Request| APIClient

    %% 8. APIClient → Backend
    APIClient <-->|11. HTTP| Backend

    %% ============================================
    %% SIDE EFFECTS
    %% ============================================
    AuthProvider -.->|Persist Token| Storage
    CartProvider -.->|Persist Cart| Storage
    i18n -.->|Persist Language| Storage

    AuthService -.->|Success/Error| Toaster
    GamesService -.->|Success/Error| Toaster

    APIClient -.->|Force Logout| EventBus
    EventBus -.->|Trigger| AuthProvider

    WishlistProvider -.->|Uses internally| QueryProvider

    %% ============================================
    %% ESTILOS DE NODOS
    %% ============================================

    %% Externos
    style User fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px,color:#F57F17
    style Backend fill:#C8E6C9,stroke:#388E3C,stroke-width:2px,color:#1B5E20

    %% Infraestructura
    style ErrorBoundary fill:#FAFAFA,stroke:#9E9E9E,stroke-width:2px,color:#333
    style Router fill:#FAFAFA,stroke:#9E9E9E,stroke-width:2px,color:#333
    style i18n fill:#FFF9C4,stroke:#F57C00,stroke-width:2px,color:#E65100

    %% Providers
    style QueryProvider fill:#FFCDD2,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style AuthProvider fill:#B2DFDB,stroke:#00695C,stroke-width:2px,color:#004D40
    style CartProvider fill:#B2DFDB,stroke:#00695C,stroke-width:2px,color:#004D40
    style WishlistProvider fill:#B2DFDB,stroke:#00695C,stroke-width:2px,color:#004D40

    %% Components
    style Pages fill:#BBDEFB,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    style Components fill:#BBDEFB,stroke:#1976D2,stroke-width:2px,color:#0D47A1

    %% Hooks
    style useAuth fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style useCart fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style useWishlist fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style useGames fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style useTranslation fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C

    %% Services
    style AuthService fill:#E1BEE7,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    style GamesService fill:#E1BEE7,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    style UserService fill:#E1BEE7,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    style APIClient fill:#E1BEE7,stroke:#7B1FA2,stroke-width:2px,color:#4A148C

    %% Side Effects
    style Storage fill:#FFE0B2,stroke:#E65100,stroke-width:2px,color:#BF360C
    style Toaster fill:#FFE0B2,stroke:#E65100,stroke-width:2px,color:#BF360C
    style EventBus fill:#FFE0B2,stroke:#E65100,stroke-width:2px,color:#BF360C
```

### 🎨 Leyenda del Diagrama

Este diagrama refleja la **composición real** de la aplicación React, no capas abstractas.

#### Colores por Tipo de Componente

| Color           | Componente / Responsabilidad | Ejemplo                                    |
| :-------------- | :--------------------------- | :----------------------------------------- |
| 🟨 **Amarillo** | **Usuario / i18n**           | Interacción externa, Traducciones globales |
| ⬜ **Gris**     | **Infraestructura**          | ErrorBoundary, Router                      |
| 🟩 **Verde**    | **Providers (Composition)**  | QueryClient, Auth, Cart, Wishlist          |
| 🟦 **Azul**     | **Components Tree**          | Pages, UI Components                       |
| 🟥 **Rojo**     | **Hooks (dentro de comps)**  | useAuth, useCart, useGames, useTranslation |
| 🟪 **Morado**   | **Services / API**           | auth.service, games.service, Axios         |
| 🟧 **Naranja**  | **Side Effects**             | LocalStorage, Toaster, EventBus            |

#### Flujo Principal Numerado

El diagrama muestra el flujo de datos con **11 pasos numerados**:

1. **Usuario interactúa** → Router
   2-7. **Provider Hierarchy** (Composition wrapping)
   - Router → ErrorBoundary → QueryProvider → AuthProvider → CartProvider → WishlistProvider → Pages
2. **Pages renderiza** Components
3. **Hooks llaman** Services (useAuth → AuthService, useGames → GamesService)
4. **Services hacen** Request (AuthService/GamesService → APIClient)
5. **APIClient** ↔ Backend (HTTP)

Las **líneas punteadas** (-.->)representan conexiones de lectura/uso sin transferencia de control:

- Components **usan** Hooks
- Hooks **leen de** Providers
- Providers **persisten en** Storage

### 📐 Vista Simplificada (Overview)

```mermaid
flowchart LR
    %% Nodos principales
    User([👤 Usuario])
    Backend[(🔌 Backend)]

    %% Capas simplificadas
    Entry["🚪 Entrada<br/>(Router + ErrorBoundary)"]
    UI["🎨 UI<br/>(Pages + Components)"]
    State["🌍 Estado<br/>(Auth + Cart + Wishlist + i18n)"]
    Logic["🧠 Lógica<br/>(Hooks + React Query)"]
    Data["📦 Datos<br/>(Services + Axios)"]
    Effects["⚡ Effects<br/>(Storage + Toast + Events)"]

    %% Flujo principal
    User -->|1| Entry
    Entry -->|2| UI
    UI -->|3| Logic
    Logic <-->|4| State
    Logic -->|5| Data
    Data <-->|6| Backend

    %% Side effects
    State -.-> Effects
    Data -.-> Effects

    %% Estilos
    style User fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px,color:#F57F17
    style Backend fill:#C8E6C9,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    style Entry fill:#FAFAFA,stroke:#9E9E9E,stroke-width:2px,color:#424242
    style UI fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1
    style State fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#01579B
    style Logic fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#B71C1C
    style Data fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    style Effects fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#BF360C
```

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
  - `AuthContext.tsx`: Context definition y `useAuth` hook para acceso al estado de autenticación
  - `AuthProvider.tsx`: Provider component que gestiona el estado global de autenticación
  - `pages/`: `LoginPage`, `RegisterPage`
  - `schemas.ts`: Validación con Zod
  - `types.ts`: Interfaces TypeScript
- **`games/`**: Catálogo de juegos
  - `hooks/`: `useGames` (infinite scroll), `useGameDetails`
  - `components/`: `GameCard`
- **`collection/`**: Biblioteca y wishlist
  - `hooks/`: `useLibrary`, `useWishlist` (Mutation hooks)
  - `services/`: usa `games.service.ts` (Library) y `user.service.ts` (Wishlist)
- **`wishlist/`**: Gestión de lista de deseos (Context-based)
  - `WishlistContext.tsx`: Context definition y `useWishlist` hook para acceso al estado de wishlist
  - `WishlistProvider.tsx`: Provider component con **optimistic updates** y React Query
  - Usado por `WishlistPage` para UX instantánea con rollback automático
- **`cart/`**: Carrito de compras
  - `CartContext.tsx`: Context definition y `useCart` hook para acceso al estado del carrito
  - `CartProvider.tsx`: Provider component con persistencia en localStorage
  - Gestión de items, cálculo de total y contador con `useMemo`
- **`checkout/`**: Proceso de compra
  - `hooks/`: `useCheckout`
  - `services/`: `checkout.service.ts`
- **`profile/`**: Gestión de perfil de usuario
  - `components/`: `AvatarUploadModal`, `ChangePasswordModal`, `EditProfileModal`
  - `hooks/`: `useUpdateProfile`

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
- **`LazyImage.tsx`**: Componente de imagen optimizado
  - Carga diferida (`loading="lazy"`)
  - Skeleton loader animado durante la carga
  - Manejo de estado de error visual (placeholder)

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
  - **Code Splitting (Lazy Loading)**:
    - Todas las páginas principales se importan con `React.lazy()`
    - Envueltas en `<Suspense fallback={<Loader />}>`
    - Vite genera chunks separados (`HomePage`, `GameDetails`, etc.) para reducir bundle inicial
  - **Estructura**:
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

### 1. Patrón de Context (2-File Pattern)

**Concepto**: Separación de Context definition y Provider implementation para Fast Refresh compliance.

A partir de Phase 16, todos los Contexts siguen este patrón:

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Developer
    participant Context as 📄 AuthContext.tsx
    participant Provider as 📄 AuthProvider.tsx
    participant Main as 🚀 main.tsx
    participant Comp as ⚛️ Component

    Note over Context: Define Context + Hook
    Dev->>Context: createContext()
    Dev->>Context: export AuthContext
    Dev->>Context: export useAuth()

    Note over Provider: Implement Provider
    Dev->>Provider: import AuthContext
    Dev->>Provider: useState, useEffect
    Dev->>Provider: Login/Logout Logic
    Dev->>Provider: export AuthProvider

    Note over Main,Comp: Usage Pattern
    Main->>Provider: import AuthProvider
    Main->>Main: Wrap App with Provider

    Comp->>Context: import useAuth
    Comp->>Context: const { user, login } = useAuth()

    Note over Context,Provider: Context imported by Provider
    Provider->>Context: Uses AuthContext internally
```

**Beneficios**:

1. **Fast Refresh**: Evita warnings `react-refresh/only-export-components`
2. **Separation of Concerns**: Context definition separada de implementación
3. **Mantenibilidad**: Archivos más pequeños (50-100 líneas vs 150-200)
4. **Claridad**: Responsabilidades bien definidas

**Estructura**:

```text
src/features/auth/
├── AuthContext.tsx      ← Context + useAuth hook (54 líneas)
└── AuthProvider.tsx     ← Provider component (127 líneas)
```

**Imports**:

```typescript
// En main.tsx (Provider)
import { AuthProvider } from "./features/auth/AuthProvider";

// En componentes (Hook)
import { useAuth } from "./features/auth/AuthContext";
```

### 2. Flujo de Autenticación (Dual Token)

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

### 3.5. Flujo de Cart (Persistencia y Gestión de Estado)

**Concepto**: Carrito de compras con persistencia automática en localStorage y prevención de duplicados.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant GameDetails as ⚛️ GameDetails
    participant Cart as 🛒 CartContext
    participant Storage as 💾 LocalStorage

    Note over User, Storage: Agregar Item al Carrito
    User->>GameDetails: Click "Add to Cart"
    GameDetails->>Cart: addItem(game)

    alt Juego ya en carrito
        Cart->>Cart: Check duplicates
        Cart-->>GameDetails: No action (skip)
        GameDetails-->>User: Toast "Already in cart"
    else Juego nuevo
        Cart->>Cart: Add to items array
        Cart->>Cart: useMemo recalcula total
        Note right of Cart: Optimización de performance
        Cart->>Storage: Persist cart (useEffect)
        Cart-->>GameDetails: Success
        GameDetails-->>User: Toast "Added to cart ✅"
    end

    Note over User, Storage: Eliminar Item
    User->>Cart: removeItem(id)
    Cart->>Cart: Filter items array
    Cart->>Storage: Persist updated cart
    Cart-->>User: Update UI

    Note over User, Storage: Vaciar Carrito (Post-Checkout)
    User->>Cart: clear()
    Cart->>Cart: setItems([])
    Cart->>Storage: Persist empty cart
```

### 4. Flujo Upload de Avatar (Manejo de Archivos)

**Concepto**: Manejo de BLOBs y UX inmediata.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Modal as ⚛️ AvatarModal
    participant Auth as 🔐 AuthProvider
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

### 4.5. Flujo de Error Boundary (Manejo Global de Errores)

**Concepto**: Captura de errores de React para prevenir crashes completos de la aplicación.

```mermaid
flowchart TD
    Start([⚛️ Component Render]) --> Try{Try Render}

    Try -->|✅ Success| Render[✅ Normal UI]
    Try -->|❌ Error Thrown| Catch[🛡️ Error Boundary]

    Catch --> Derive[getDerivedStateFromError]
    Derive --> SetState[hasError = true]

    SetState --> Log{Env === 'dev'?}
    Log -->|Yes| Console[📝 logger.error<br/>+ Component Stack]
    Log -->|No| Silent[🤫 Silent Mode]

    Console --> Fallback
    Silent --> Fallback

    Fallback[⚠️ Fallback UI<br/>Glassmorphism Card]

    Fallback --> ShowDetails{DEV Mode?}
    ShowDetails -->|Yes| Details[📋 Show Error Details<br/>+ Stack Trace]
    ShowDetails -->|No| NoDetails[🚫 Hide Technical Info]

    Details --> Actions
    NoDetails --> Actions

    Actions{User Action}

    Actions -->|Click Refresh| Reload[🔄 window.location.reload<br/>Full Page Reload]
    Actions -->|Click Try Again| Reset[🔄 handleReset<br/>Reset Error State]

    Reset --> Start
    Reload --> Start

    style Catch fill:#ffebee,stroke:#c62828,stroke-width:2px
    style Fallback fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style Render fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
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

> [!TIP] > **Pagination Hooks Pattern**:
> Implementamos una separación estricta:
>
> 1.  **URL Hook** (`useCatalogUrl`): Maneja la escritura en URL.
> 2.  **Data Hook** (`useGames`): Lee la URL y hace fetch.
>
> El componente de UI **nunca** llama al servicio directamente; solo actualiza la URL.

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

### 7. Flujo de Internacionalización (Language Toggle)

**Concepto**: Cambio de idioma con persistencia automática vía i18next.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Toggle as 🌐 LanguageToggle
    participant i18n as 📚 i18next
    participant Storage as 💾 LocalStorage
    participant App as ⚛️ App Components

    User->>Toggle: Click "ES"
    Toggle->>i18n: changeLanguage('es')

    Note right of i18n: i18next maneja persistencia
    i18n->>Storage: setItem('i18nextLng', 'es')
    i18n->>i18n: Load ES translations

    i18n-->>App: Trigger re-render
    Note right of App: useTranslation hooks actualizan

    App-->>User: UI en Español ✅

    Note over User, App: Próxima Sesión
    User->>App: Reload page
    App->>i18n: Initialize
    i18n->>Storage: getItem('i18nextLng')
    Storage-->>i18n: 'es'
    i18n-->>App: Auto-load Spanish
    App-->>User: UI en Español (Persistido)
```

### 8. Flujo de Admin RAWG Import

**Concepto**: Importación de juegos desde RAWG API al catálogo local.

````mermaid
sequenceDiagram
    participant Admin as 👤 Admin
    participant UI as ⚛️ RAWGImport Page
    participant Hook as 🪝 useSearchRAWG
    participant Service as 📦 AdminService
    participant Backend as ☁️ Backend
    participant RAWG as 🎮 RAWG API
    participant DB as 💾 MongoDB

    Note over Admin, DB: Fase 1: Búsqueda
    Admin->>UI: Enter "Zelda"
    UI->>Hook: searchRAWG("Zelda")
    Hook->>Service: searchRAWG("Zelda")
    Service->>Backend: GET /admin/rawg/search?q=Zelda
    Backend->>RAWG: GET /games?search=Zelda
    RAWG-->>Backend: [Game1, Game2, ...]
    Backend-->>Service: Mapped games
    Service-->>Hook: Games array
    Hook-->>UI: Display results grid

    Note over Admin, DB: Fase 2: Importación
    Admin->>UI: Click "Import" (Game ID: 123)
    UI->>Hook: importGame(123)
    Hook->>Service: importFromRAWG(123)
    Service->>Backend: POST /admin/rawg/import/:id

    Backend->>RAWG: GET /games/123 (Full details)
    RAWG-->>Backend: Complete game data

### 9. Flujo de Navegación Zero-Latency (Prefetching)

**Concepto**: Anticipación a la intención del usuario para eliminar tiempos de carga.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Card as ⚛️ GameCard
    participant QC as ⚡ QueryClient (Cache)
    participant API as 🔧 API Client
    participant Detail as ⚛️ GameDetails

    User->>Card: Hover (Mouse Enter) 🖱️
    Card->>QC: prefetchQuery(['game', id])

    alt Datos ya en caché (StaleTime valid)
        QC-->>Card: Do nothing (Cache Hit)
    else Datos no existen o expirados
        QC->>API: Fetch details (Background)
        API->>QC: Store Data
    end

    User->>Card: Click (Navegar)
    Card->>Detail: Navigation to /game/:id

    Detail->>QC: useQuery(['game', id])
    Note right of QC: ¡Datos disponibles inmediatamente!
    QC-->>Detail: Return Data (Status: Success)
    Detail-->>User: Render Instantáneo (0ms Spinner)
````

    Backend->>Backend: Transform to local schema
    Backend->>DB: Save game document
    DB-->>Backend: Success

    Backend-->>Service: { success: true, game }
    Service-->>Hook: Invalidate ["games"] cache
    Hook-->>UI: Toast "Game imported ✅"
    UI-->>Admin: Refresh catalog

````

### 9. Flujo de Infinite Scroll (Paginación)

**Concepto**: Carga progresiva de juegos con `useInfiniteQuery`.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Home as ⚛️ HomePage
    participant Hook as 🪝 useGames
    participant Query as ⚡ React Query
    participant Service as 📦 GamesService
    participant Backend as ☁️ Backend

    Note over User, Backend: Carga Inicial
    User->>Home: Visit /home
    Home->>Hook: useGames()
    Hook->>Query: useInfiniteQuery
    Query->>Service: getCatalog({ page: 1 })
    Service->>Backend: GET /games?page=1&limit=12
    Backend-->>Service: { games: [...], hasMore: true }
    Service-->>Query: Cache page 1
    Query-->>Hook: { pages: [page1] }
    Hook-->>Home: Display 12 games

    Note over User, Backend: Load More
    User->>Home: Scroll to bottom / Click "Load More"
    Home->>Hook: fetchNextPage()
    Hook->>Query: getNextPageParam(lastPage)
    Query->>Service: getCatalog({ page: 2 })
    Service->>Backend: GET /games?page=2&limit=12
    Backend-->>Service: { games: [...], hasMore: true }
    Service-->>Query: Cache page 2
    Query-->>Hook: { pages: [page1, page2] }
    Hook-->>Home: Display 24 games total
````

### 10. Flujo de Profile Update

**Concepto**: Actualización de perfil con validación Zod y refresh de AuthContext.

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Modal as ⚛️ EditProfileModal
    participant Hook as 🪝 useUpdateProfile
    participant Auth as 🔐 AuthProvider
    participant Service as 📦 AuthService
    participant Backend as ☁️ Backend

    User->>Modal: Edit username
    User->>Modal: Click "Save"

    Modal->>Modal: Zod validation
    alt Validation fails
        Modal-->>User: Show errors
    else Validation passes
        Modal->>Hook: updateProfile({ username })
        Hook->>Service: updateProfile(data)
        Service->>Backend: PUT /users/profile

        alt Success
            Backend-->>Service: { user: {...} }
            Service-->>Hook: Success
            Hook->>Auth: refreshUser()
            Auth->>Service: getProfile()
            Service->>Backend: GET /users/profile
            Backend-->>Service: Updated user
            Service-->>Auth: Update user state
            Auth-->>Modal: Context updated
            Modal-->>User: Toast "Profile updated ✅"
        else Error
            Backend-->>Service: 400 Error
            Service-->>Hook: Reject
            Hook-->>Modal: Error message
            Modal-->>User: Toast "Update failed ❌"
        end
    end
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

### Corto Plazo (Completado)

- [x] ~~Implementar lógica de refresh token~~ ✅ Completado
- [x] ~~Error Boundaries para manejo robusto de errores~~ ✅ Completado
- [x] ~~Type safety al 95%~~ ✅ Completado
- [x] ~~Cargar traducciones al español~~ ✅ Completado
- [x] ~~Mover estilos inline restantes a CSS modules~~ ✅ Completado (100% Clean Code)
- [x] ~~Implementar Buscador Avanzado (Search, Filters & Sort)~~ ✅ Completado
- [x] ~~Optimistic Updates en Wishlist~~ ✅ Completado
- [x] ~~Testing Strategy (74 tests, 16 archivos)~~ ✅ Completado

### Medio Plazo

- [ ] Refactorización Fast Refresh (Fase 16 - Opcional)
- [ ] Service Workers para PWA
- [ ] Integración con Sentry para tracking

### Largo Plazo

- [ ] Server-Side Rendering (SSR) con Next.js
- [ ] Testing E2E con Playwright
- [ ] Storybook para documentación
