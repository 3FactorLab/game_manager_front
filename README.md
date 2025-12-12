# 🎮 GameManager Frontend

![Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, high-performance **React + TypeScript** application built with a focus on **Software Architecture**, **Clean Code**, and **Premium UX**.

This project implements a robust **Game Management System** featuring a custom Glassmorphism design system, advanced authentication flows, and "Zero Inline Styles" policy.

---

## 🚀 Tech Stack

| Category           | Technology                                                       | Purpose                             |
| :----------------- | :--------------------------------------------------------------- | :---------------------------------- |
| **Core**           | [React 18](https://react.dev/)                                   | UI Library (Component-Based)        |
| **Language**       | [TypeScript](https://www.typescriptlang.org/)                    | Type Safety & Developer Experience  |
| **Build Tool**     | [Vite](https://vitejs.dev/)                                      | Lightning Fast HMR & bundling       |
| **State (Server)** | [TanStack Query](https://tanstack.com/query)                     | Async State, Caching & Revalidation |
| **State (Client)** | [React Context](https://react.dev/reference/react/createContext) | Global Auth & Theme State           |
| **Forms**          | [React Hook Form](https://react-hook-form.com/)                  | Performant Form Validation          |
| **Validation**     | [Zod](https://zod.dev/)                                          | Schema Validation                   |
| **Styling**        | [CSS Modules](https://github.com/css-modules/css-modules)        | Scoped Styles (No conflicts)        |
| **Icons**          | [React Icons](https://react-icons.github.io/react-icons/)        | Feather & Bootstrap Icons           |
| **i18n**           | [i18next](https://www.i18next.com/)                              | Internationalization (EN/ES)        |

---

## ✨ Key Features

### 🔐 Advanced Authentication (Dual Token)

- **Security**: HttpOnly Cookies for Refresh Tokens + Memory storage for Access Tokens.
- **Auto-Refresh**: Axios interceptors automatically handle 401 errors, refreshing the session transparently without logging the user out.
- **Role-Based Access**: Specialized `<ProtectedRoute>` component handling User/Admin roles.

### 🎨 Premium UI/UX (Glassmorphism)

- **Zero Inline Styles**: Strict adherence to CSS Modules.
- **Design System**: Centralized variables for colors, blur effects, and animations.
- **Feedback**: Optimistic UI updates for Wishlist & Cart actions.
- **Transitions**: Smooth page transitions and micro-interactions.

### 🌍 Internationalization (i18n)

- **Multi-language**: Full support for English and Spanish.
- **Persistence**: Language preference saved in LocalStorage.
- **Toggle**: Integrated switcher in Navbar (Desktop & Mobile).

### 🛡️ Robustness

- **Error Boundaries**: Graceful error handling prevents white screens.
- **Type Safety**: >95% TypeScript coverage with strict mode.
- **Centralized API**: Typed Service Layer separating API logic from UI components.

---

## 📚 Documentation

We maintain detailed documentation for the codebase. Please review these files to understand the architecture:

- [📐 Frontend Architecture](./docs/architecture-front.md): Deep dive into the data flow, layers, and decisions.
- [🎓 Tutorial & Guidelines](./docs/tutorial-front.md): Contribution guide and code standards.
- [📋 Project Roadmap](./docs/pendientes.md): Pending tasks and future improvements.
- [🧪 Testing Guide](./docs/test-guide.md): How to run and write tests.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/game-manager-front.git
   cd game-manager-front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root (optional, defaults provided in config):

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 📂 Project Structure

```
src/
├── features/        # Feature-based modules (THE CORE)
│   ├── auth/        # Login, Register, Context
│   ├── games/       # Catalog, Details
│   ├── cart/        # Shopping Cart logic
│   └── wishlist/    # Wishlist logic
├── components/      # Shared UI components
│   ├── ui/          # Buttons, Cards, Inputs
│   └── layout/      # Navbar, Footer
├── pages/           # Page orchestration
├── services/        # API communication layer
├── hooks/           # Shared custom hooks
├── lib/             # 3rd party config (axios, i18n, query)
└── types/           # Global TypeScript definitions
```

---

## 🧪 Running Tests

```bash
# Run Unit & Integration Tests
npm run test

# Run with UI preview
npm run test:ui
```

---

Made with ❤️ by AndyDev
