# 📘 La Biblia del Game Manager Frontend: Explicación Archivo por Archivo

Este documento es la guía definitiva del frontend. Vamos a recorrer **cada carpeta y cada archivo** del proyecto, explicando por qué existe, qué hace y cómo se conecta con los demás.

Si alguna vez te pierdes, vuelve aquí.

---

## 📂 1. Configuración (`src/lib/`)

Aquí definimos las reglas globales antes de empezar.

### `src/lib/queryClient.ts`

- **Qué hace**: Configura React Query (TanStack Query) con políticas de caché y refetch.
- **Por qué**: Centralizar la configuración evita repetir código y garantiza comportamiento consistente.
- **Detalle**:
  - Datos frescos por 5 minutos (`staleTime: 5 * 60 * 1000`)
  - Caché por 30 minutos (`gcTime: 30 * 60 * 1000`)
  - No refetch automático al cambiar de ventana (`refetchOnWindowFocus: false`)

### `src/lib/i18n.ts`

- **Qué hace**: Configura internacionalización con i18next.
- **Por qué**: Para soportar múltiples idiomas (inglés y español).
- **Detalle**: Actualmente solo carga inglés. Las traducciones al español existen en `/locales/es.json` pero están desactivadas.

---

## 📊 1.1. Tipos (`src/types/`)

Definiciones TypeScript centralizadas para garantizar type safety en toda la aplicación.

### `src/types/api.types.ts`

- **Qué hace**: Define interfaces para respuestas de API y manejo de errores.
- **Por qué**: Centralizar tipos garantiza consistencia y evita duplicación.
- **Interfaces principales**:
  - `ApiError`: Estructura estandarizada de errores del backend
  - `isApiError()`: Type guard para validación segura de errores en runtime
  - `GamesApiResponse`: Respuesta paginada del catálogo de juegos

### `src/types/rawg.types.ts`

- **Qué hace**: Define interfaces para la integración con RAWG API.
- **Por qué**: Tipado completo de respuestas de API externa.
- **Interfaces principales**:
  - `RAWGGame`: Estructura completa de un juego de RAWG
  - `RAWGSearchResponse`: Respuesta de búsqueda con paginación

---

## 📂 2. Features (`src/features/`)

Cada feature es un **módulo autocontenido** con todo lo necesario para funcionar independientemente.

### `src/features/auth/`

El módulo de autenticación completo.

#### `AuthContext.tsx`

- **Qué hace**: Gestiona el estado global de autenticación.
- **Por qué**: El estado de auth se necesita en muchos componentes (Navbar, rutas protegidas, etc.).
- **Detalle**:
  - Guarda el token en `localStorage`
  - Proporciona funciones: `login`, `register`, `logout`, `refreshUser`
  - Inicializa la sesión al cargar la app (verifica si hay token guardado)

#### `pages/LoginPage.tsx` y `RegisterPage.tsx`

- **Qué hacen**: Formularios de autenticación.
- **Detalle**: Usan `react-hook-form` + Zod para validación en tiempo real.

#### `schemas.ts`

- **Qué hace**: Define las reglas de validación con Zod.
- **Por qué**: Validación type-safe que se comparte entre formulario y TypeScript.
- **Ejemplo**: Email debe ser válido, password mínimo 6 caracteres, confirmPassword debe coincidir.

#### `types.ts`

- **Qué hace**: Interfaces TypeScript para User, AuthResponse, Credentials.
- **Por qué**: Type safety en toda la feature.
- **Detalle**: `AuthResponse` incluye tanto `token` (access) como `refreshToken` para sistema dual token.

### `src/features/games/`

El módulo del catálogo de juegos.

#### `hooks/useGames.ts`

- **Qué hace**: Implementa **infinite scroll** con paginación.
- **Por qué**: Cargar 1000 juegos de golpe sería lento. Cargamos 12 a la vez.
- **Detalle**: Usa `useInfiniteQuery` de React Query con `getNextPageParam`.

#### `hooks/useGameDetails.ts`

- **Qué hace**: Fetch de detalles de un juego específico.
- **Detalle**: Solo hace fetch si hay ID (`enabled: !!id`).

#### `components/GameCard.tsx`

- **Qué hace**: Tarjeta visual de un juego.
- **Detalle**: Muestra cover, título, precio (con descuento si aplica), género.

### `src/features/collection/`

Biblioteca y wishlist del usuario.

#### `hooks/useLibrary.ts`

- **Qué hace**: Fetch de la biblioteca del usuario.
- **Detalle**: Solo fetch si está autenticado (`enabled: isAuthenticated`).

#### `hooks/useWishlist.ts`

- **Qué hace**: Gestiona la wishlist con mutations.
- **Lógica**:
  - `addToWishlist`: Mutation que añade juego
  - `removeFromWishlist`: Mutation que quita juego
  - `isInWishlist`: Helper para saber si un juego está en wishlist
  - Ambas mutations invalidan la query `["wishlist"]` para refetch automático

#### `services/collection.service.ts`

- **Qué hace**: API client para biblioteca y wishlist.
- **Endpoints**:
  - `GET /collection` - Biblioteca
  - `GET /collection/wishlist` - Wishlist
  - `POST /collection/wishlist` - Añadir a wishlist
  - `DELETE /collection/wishlist/:id` - Quitar de wishlist

### `src/features/wishlist/`

Módulo de lista de deseos con Context API.

#### `WishlistContext.tsx`

- **Qué hace**: Context provider para gestión de wishlist del usuario.
- **Por qué**: Alternativa a hooks con optimistic updates para mejor UX.
- **Características**:
  - Fetch automático al autenticarse
  - Optimistic updates (UI se actualiza antes de respuesta del servidor)
  - Rollback automático si falla la petición
  - Toast notifications para feedback
- **Funciones exportadas**:
  - `addToWishlist(game)`: Añade juego con update optimista
  - `removeFromWishlist(gameId)`: Quita juego con update optimista
  - `isInWishlist(gameId)`: Verifica si juego está en wishlist
- **Usado por**: `WishlistPage.tsx`

### `src/features/cart/`

Módulo de carrito de compras.

#### `CartContext.tsx`

- **Qué hace**: Context provider para gestión del carrito.
- **Por qué**: Estado global del carrito con persistencia.
- **Características**:
  - Persistencia en localStorage
  - Cálculo automático de total y contador
  - Previene duplicados
  - Maneja precios con descuento
- **Funciones exportadas**:
  - `addItem(game)`: Añade juego al carrito
  - `removeItem(id)`: Quita juego del carrito
  - `clear()`: Vacía el carrito
  - `count`: Número de items
  - `total`: Precio total
- **Interface**: `CartItem` con campos esenciales (id, title, price, cover)

### `src/features/checkout/`

Proceso de compra.

#### `hooks/useCheckout.ts`

- **Qué hace**: Mutation para comprar un juego.
- **Lógica**: Al completar compra, invalida `["library"]` y navega a `/library`.

#### `services/checkout.service.ts`

- **Qué hace**: API client para checkout.
- **Endpoint**: `POST /payments/checkout` con `{ gameIds: [id] }`.

### `src/features/profile/`

Gestión de perfil de usuario.

#### `hooks/useUpdateProfile.ts`

- **Qué hace**: Actualiza perfil (username, avatar).
- **Detalle**: Usa FormData para soportar upload de imágenes.
- **Lógica**: Al completar, refresca el usuario en AuthContext y muestra toast de éxito.

---

## 📂 3. UI Components (`src/components/`)

Componentes reutilizables sin lógica de negocio.

### `src/components/ui/`

Componentes base del sistema de diseño.

#### `Button.tsx`

- **Qué hace**: Botón reutilizable con variantes y estados.
- **Props**:
  - `variant`: 'primary' | 'secondary' | 'ghost'
  - `size`: 'sm' | 'md' | 'lg'
  - `isLoading`: Muestra spinner animado ⏳
- **Detalle**: Usa CSS Modules para estilos con scope local.

#### `Card.tsx`

- **Qué hace**: Contenedor con efecto glassmorphism.
- **Props**: `padding` ('sm' | 'md' | 'lg' | 'none')
- **Estilo**: Fondo semi-transparente, backdrop-filter blur, borde sutil.

#### `Input.tsx`

- **Qué hace**: Input de formulario con label y error.
- **Detalle**: Usa `forwardRef` para compatibilidad con `react-hook-form`.
- **Props**: `label`, `error`, y todas las props nativas de input.

#### `Loader.tsx`

- **Qué hace**: Spinner de carga reutilizable.
- **Props**:
  - `size`: 'sm' | 'md' | 'lg' (default: 'md')
  - `className`: Clases CSS adicionales
- **Detalle**: Usa CSS Modules para animación del spinner.
- **Usado en**: Páginas con estados de carga (WishlistPage, LibraryPage, etc.)

#### `SearchBar.tsx`

- **Qué hace**: Barra de búsqueda con navegación.
- **Lógica**:
  - Al buscar, navega a `/?search=query`
  - Soporta Enter key para búsqueda rápida
  - Sincroniza con URL params (si llegas con `?search=`, pre-rellena el input)

#### `ImageModal.tsx`

- **Qué hace**: Modal para galería de imágenes (lightbox).
- **Props**: `images`, `currentIndex`, `onClose`, `onNavigate`
- **Detalle**: Navegación con flechas, cierre con ESC o click fuera.

### `src/components/ErrorBoundary.tsx`

Componente de manejo de errores a nivel de aplicación.

- **Qué hace**: Captura errores de React antes de que crasheen toda la app.
- **Por qué**: Mejora la experiencia de usuario y facilita debugging.
- **Características**:
  - UI fallback amigable con diseño glassmorphism
  - Logging automático de errores en desarrollo
  - Botones de "Refresh" y "Try Again"
  - Detalles del error visibles solo en modo desarrollo
  - Integrado en `App.tsx` para cubrir toda la aplicación
- **Estilos**: `ErrorBoundary.module.css` con diseño responsive

### `src/components/layout/`

Componentes de estructura de la aplicación.

#### `MainLayout.tsx`

- **Qué hace**: Layout principal con header, main y footer.
- **Detalle**: Usa `<Outlet />` de React Router para renderizar páginas anidadas.
- **Estructura**:

  ```jsx
  <header> → Navbar
  <main> → Outlet (páginas)
  <footer> → Copyright
  ```

#### `Navbar.tsx`

- **Qué hace**: Navegación principal con menú móvil.
- **Detalle**:
  - Desktop: Links horizontales
  - Mobile: Menú hamburguesa
  - Muestra diferentes opciones según autenticación (Login/Register vs Profile/Logout)
  - Admin: Muestra link a panel de admin

#### `UserDropdown.tsx`

- **Qué hace**: Dropdown de perfil de usuario.
- **Opciones**:
  - Ver perfil
  - Cambiar avatar
  - Mi biblioteca
  - Cerrar sesión
- **Detalle**: Muestra avatar del usuario o icono por defecto.

---

## 📂 4. Pages (`src/pages/`)

Componentes de página que orquestan features y UI.

### `Home.tsx`

- **Qué hace**: Página principal con catálogo de juegos.
- **Lógica**:
  - Usa `useGames` para infinite scroll
  - Muestra grid de `GameCard`
  - Botón "Load More" al final
  - Maneja estados de loading y error

### `GameDetails.tsx`

- **Qué hace**: Página de detalles de un juego.
- **Características**:
  - Hero section con cover grande
  - Descripción completa
  - Galería de screenshots (con modal)
  - Sidebar con precio y botones de compra/wishlist
  - Metadata (género, developer, fecha, Metacritic)
- **Lógica**:
  - Usa `useGameDetails` para fetch
  - Usa `useWishlist` para añadir/quitar
  - Botones deshabilitados si no estás autenticado

### `LibraryPage.tsx`

- **Qué hace**: Muestra la biblioteca del usuario.
- **Detalle**: Grid de juegos comprados con filtros por estado.

### `WishlistPage.tsx`

- **Qué hace**: Muestra la lista de deseos del usuario.
- **Lógica**:
  - Usa `WishlistContext` para estado global
  - Estados: loading (Loader), no autenticado, vacío, con juegos
  - Grid de `GameCard` para cada juego
  - Contador de juegos en header
- **Detalle**: Mensajes personalizados según estado (login requerido, lista vacía, etc.)

### `CheckoutPage.tsx`

- **Qué hace**: Página de confirmación de compra.
- **Lógica**: Muestra resumen del juego y botón de pago.

### `LandingPage.tsx`

- **Qué hace**: Página de bienvenida para usuarios no autenticados.

### `StorePage.tsx`

- **Qué hace**: Página placeholder para tienda.
- **Detalle**: Muestra "Coming Soon" con estilos inline (pendiente de refactorizar).
- **Nota**: Funcionalidad aún no implementada.

### `admin/`

Panel de administración (4 páginas):

- `AdminDashboard.tsx`: Vista general
- `UserManagement.tsx`: CRUD de usuarios
- `GameManagement.tsx`: CRUD de juegos
- `RAWGImport.tsx`: Importar juegos desde RAWG API

---

## 📂 5. Services (`src/services/`)

Capa de comunicación con el backend.

### `api.client.ts`

- **Qué hace**: Cliente Axios configurado con interceptores.
- **Interceptor de Request**:
  - Añade automáticamente `Authorization: Bearer <token>` si existe
- **Interceptor de Response (Auto-Refresh)**:
  - Detecta respuestas 401 (token expirado)
  - Automáticamente llama a `/users/refresh-token` con el refresh token
  - Actualiza ambos tokens en localStorage
  - **Reintenta la petición original** sin que el usuario lo note
  - Si el refresh falla, borra tokens y redirige a login
  - Previene loops infinitos con flag `_retry`

### `auth.service.ts`

- **Funciones**:
  - `login(credentials)`: POST /users/login - Devuelve access + refresh token
  - `register(data)`: POST /users/register - Devuelve access + refresh token
  - `getProfile()`: GET /users/profile
  - `updateProfile(formData)`: PUT /users/profile
  - `refreshToken()`: POST /users/refresh-token - Obtiene nuevos tokens
  - `logout()`: Borra **ambos tokens** de localStorage
- **Detalle**: Gestiona sistema dual token (access + refresh) para sesiones extendidas

### `games.service.ts`

- **Funciones**:
  - `getCatalog(params)`: GET /games con paginación y búsqueda
  - `getGameById(id)`: GET /games/:id
- **Interface**: Define `Game` con todos los campos del juego.

### `user.service.ts`

Servicio para gestión de wishlist del usuario (sistema context-based).

- **Qué hace**: API client para wishlist usando endpoints de usuario.
- **Por qué**: Sistema alternativo a `collection.service.ts`, usado por `WishlistContext`.
- **Funciones**:
  - `getWishlist()`: GET /users/wishlist - Devuelve array de juegos
  - `addToWishlist(gameId)`: POST /users/wishlist/:id - Añade juego
  - `removeFromWishlist(gameId)`: DELETE /users/wishlist/:id - Quita juego
- **Detalle**: Mapea estructura del backend a interfaz `Game` del frontend.
- **Nota**: Coexiste con `collection.service.ts` para compatibilidad. WishlistContext usa este servicio.

### `admin.service.ts`

- **Funciones**:
  - User Management: `getAllUsers`, `deleteUser`
  - Game Management: `createGame`, `updateGame`, `deleteGame`
  - RAWG Integration: `searchRAWG`, `importFromRAWG`

---

## 📂 6. Routing (`src/routes/`)

### `AppRoutes.tsx`

- **Qué hace**: Configuración de todas las rutas de la app.
- **Estructura**:
  - Rutas públicas: `/`, `/home`, `/store`, `/game/:id`, `/login`, `/register`
  - Rutas protegidas (requieren auth): `/library`, `/checkout/:id`
  - Rutas admin (requieren role admin): `/admin/*`
- **Componente `ProtectedRoute`**:
  - Verifica autenticación
  - Opcionalmente verifica rol de admin
  - Redirige a login si no cumple requisitos

---

## 📂 7. Hooks Globales (`src/hooks/`)

### `useAdmin.ts`

- **Qué hace**: Colección de hooks para operaciones de admin.
- **Hooks exportados**:
  - `useUsers`: Lista de usuarios con paginación
  - `useDeleteUser`: Mutation para borrar usuario
  - `useCreateGame`: Mutation para crear juego
  - `useUpdateGame`: Mutation para editar juego
  - `useDeleteGame`: Mutation para borrar juego
  - `useSearchRAWG`: Query para buscar en RAWG
  - `useImportFromRAWG`: Mutation para importar de RAWG

---

## 📂 8. Utils (`src/utils/`)

Funciones helper sin dependencias de React.

### `format.ts`

- **Qué hace**: Formatea moneda con `Intl.NumberFormat`.
- **Función**: `formatCurrency(amount, currency)` → "$19.99"
- **Por qué**: Centralizar formateo garantiza consistencia.

### `error.util.ts`

Utilidades centralizadas para manejo de errores.

- **Qué hace**: Proporciona funciones helper para manejo consistente de errores.
- **Por qué**: Evita duplicación de lógica try/catch y estandariza mensajes de error.
- **Funciones principales**:
  - `logger.error()`, `logger.warn()`, `logger.info()`: Logging condicional (solo en desarrollo)
  - `getErrorMessage(error)`: Extrae mensaje de error de forma segura desde cualquier tipo de error
  - `handleApiError(error, customMessage?)`: Manejo estandarizado con toast + logging automático
  - `withErrorHandling(fn, errorMessage?)`: Wrapper para operaciones async con try/catch automático
- **Uso**: Importado en componentes admin, hooks y servicios para manejo consistente

---

## 📂 9. Estilos

### `src/index.css`

- **Qué hace**: Estilos globales y variables CSS.
- **Contenido**:
  - CSS Custom Properties (variables de color, spacing, etc.)
  - Reset básico
  - Clases utilitarias (`.glass-panel`, `.text-gradient`)
  - Tema oscuro por defecto

### CSS Modules (`*.module.css`)

- **Qué hacen**: Estilos con scope local para cada componente.
- **Por qué**: Evita conflictos de nombres, facilita mantenimiento y mejora performance.
- **Regla de Oro**: 🚫 **Prohibido usar Inline Styles** (`style={{...}}`).
- **Excepción**: Valores dinámicos estrictamente necesarios (ej: imágenes de fondo user-generated) mediante CSS Variables.
- **Ejemplo**: `Button.module.css` solo afecta a `Button.tsx`.

---

## 📂 10. El Jefe (`src/main.tsx` y `src/App.tsx`)

### `main.tsx`

El punto de entrada de la aplicación.

1. Inicializa i18n
2. Crea el provider hierarchy:
   - `StrictMode` (detecta problemas)
   - `HelmetProvider` (gestiona `<head>`)
   - `QueryClientProvider` (React Query)
   - `AuthProvider` (autenticación)
   - `BrowserRouter` (routing)
3. Renderiza `<App />`

### `App.tsx`

El componente raíz.

- Renderiza `<AppRoutes />` (todas las rutas)
- Envuelve rutas con `<ErrorBoundary>` para captura de errores
- Configura `<Toaster />` para notificaciones globales
- **Detalle**: ErrorBoundary previene crashes completos de la app

---

## 🎨 11. Patrones y Mejores Prácticas

### Separación de Concerns

- **Components**: Solo UI y eventos
- **Hooks**: Lógica de estado y side effects
- **Services**: Comunicación con API
- **Utils**: Funciones puras

### Colocación de Estado

- **Local** (`useState`): Modal abierto/cerrado, índice de imagen
- **Feature** (Context): Estado de autenticación
- **Server** (React Query): Datos del backend

### Custom Hooks

Extraemos lógica compleja a hooks reutilizables:

```typescript
// En lugar de repetir esto en cada componente:
const { data, isLoading, error } = useQuery(...)

// Creamos:
const { wishlist, addToWishlist, isInWishlist } = useWishlist()
```

### React Query Patterns

- **Queries**: Para fetch de datos (GET)
- **Mutations**: Para modificar datos (POST, PUT, DELETE)
- **Invalidación**: Tras mutation, invalidamos queries relacionadas para refetch automático

---

## 🧪 11. Testing (`src/components/ui/Button.test.tsx`)

Nuestra red de seguridad.

- **Vitest**: Framework de testing (compatible con Vite)
- **Testing Library**: Para testear componentes React
- **Ejemplo**: Test de Button verifica que renderiza correctamente y responde a clicks

---

## 📝 12. Documentación Académica

Todos los archivos críticos incluyen documentación estilo académico:

### Estilo de Comentarios

- **Nivel de archivo**: Comentario inicial explicando propósito y responsabilidad
- **Nivel de función/componente**: Comentario breve con:
  - Qué hace (propósito)
  - Parámetros principales (si no son obvios)
  - Valor de retorno (si aplica)
- **Exports**: Explicación de destino y propósito
- **Idioma**: Todos los comentarios en inglés

### Archivos Documentados (35+)

- Core: `App.tsx`, `main.tsx`, `AuthContext.tsx`, `api.client.ts`
- UI: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Navbar.tsx`, `UserDropdown.tsx`
- Pages: `Home.tsx`, `LoginPage.tsx`, `GameDetails.tsx`
- Services: `auth.service.ts`, `games.service.ts`, `checkout.service.ts`
- Hooks: `useGames.ts`, `useWishlist.ts`, `useCheckout.ts`
- Config: `queryClient.ts`, `i18n.ts`, `schemas.ts`

---

## 🚀 13. Scripts (`package.json`)

- `npm run dev`: Inicia servidor de desarrollo (Vite)
- `npm run build`: Compila para producción
- `npm run preview`: Previsualiza build de producción
- `npm run lint`: Ejecuta ESLint
- `npm run test`: Ejecuta tests con Vitest

---

## 🎯 14. Mejoras Recientes (Diciembre 2025)

### Type Safety (95% Coverage)

- Eliminación de 12 de 13 usos de `any`
- Interfaces centralizadas en `src/types/`
- Type guards para validación en runtime

### Error Handling

- Error Boundary a nivel de aplicación
- Utilidades centralizadas en `error.util.ts`
- Logging condicional (solo desarrollo)

### Autenticación

- Sistema dual token (access + refresh)
- Auto-refresh transparente
- Sesiones extendidas de 15 min a 7 días

### UI/UX

- Botón con spinner animado ⏳
- **100% Styles Clean Code**: Migración total a CSS Modules (70+ archivos refactorizados)
- Diseño glassmorphism consistente

### Clean Code Architecture

- **Separación estricta**: Logic (Hooks) vs UI (Components) vs Styles (Modules)
- **Zero Inline Styles**: Política estricta implementada globalmente
- **Dev Experience**: Logs de autenticación filtrados por entorno (dev-only)

---

¡Y eso es todo! Cada archivo tiene un propósito. Nada sobra. El frontend es una máquina bien aceitada donde cada pieza encaja perfectamente. 🎯
