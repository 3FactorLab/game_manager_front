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

#### `hooks/useUpdateProfile.ts`

- **Qué hace**: Hook para actualizar perfil de usuario (incluye avatar).
- **Lógica**: Usa React Query mutation + FormData para subir archivos.

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

### `src/components/layout/`

Componentes de estructura de la aplicación.

#### `MainLayout.tsx`

- **Qué hace**: Layout principal con header, main y footer.
- **Detalle**: Usa `<Outlet />` de React Router para renderizar páginas anidadas.
- **Estructura**:
  ```
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

### `CheckoutPage.tsx`

- **Qué hace**: Página de confirmación de compra.
- **Lógica**: Muestra resumen del juego y botón de pago.

### `LandingPage.tsx`

- **Qué hace**: Página de bienvenida para usuarios no autenticados.

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
- **Interceptor de Response**:
  - Si recibe 401, borra el token y redirige a login
  - (Comentado: lógica de refresh token para implementar en el futuro)

### `auth.service.ts`

- **Funciones**:
  - `login(credentials)`: POST /users/login
  - `register(data)`: POST /users/register
  - `getProfile()`: GET /users/profile
  - `updateProfile(formData)`: PUT /users/profile
  - `logout()`: Borra token de localStorage

### `games.service.ts`

- **Funciones**:
  - `getCatalog(params)`: GET /games con paginación y búsqueda
  - `getGameById(id)`: GET /games/:id
- **Interface**: Define `Game` con todos los campos del juego.

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
- **Por qué**: Evita conflictos de nombres y facilita mantenimiento.
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
- Configura `<Toaster />` para notificaciones globales

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

## 🧪 Testing (`src/components/ui/Button.test.tsx`)

Nuestra red de seguridad.

- **Vitest**: Framework de testing (compatible con Vite)
- **Testing Library**: Para testear componentes React
- **Ejemplo**: Test de Button verifica que renderiza correctamente y responde a clicks

---

## 🚀 Scripts (`package.json`)

- `npm run dev`: Inicia servidor de desarrollo (Vite)
- `npm run build`: Compila para producción
- `npm run preview`: Previsualiza build de producción
- `npm run lint`: Ejecuta ESLint
- `npm run test`: Ejecuta tests con Vitest

---

¡Y eso es todo! Cada archivo tiene un propósito. Nada sobra. El frontend es una máquina bien aceitada donde cada pieza encaja perfectamente. 🎯
