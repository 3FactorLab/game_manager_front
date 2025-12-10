/**
 * App.tsx
 * Root application component that sets up global providers and routing.
 * Configures react-hot-toast for notifications with glassmorphism styling
 * to match the application's design system.
 * Includes Error Boundary for catching and handling React errors gracefully.
 */

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * Main App component
 * Renders the application routes with error boundary protection
 * and global toast notification system.
 * Toast notifications use CSS custom properties for consistent theming.
 *
 * @returns {JSX.Element} The root application component
 */
function App() {
  return (
    <ErrorBoundary>
      {/* Application routing system with error protection */}
      <AppRoutes />

      {/* Global toast notifications with glassmorphism styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-glass)",
            color: "var(--text-primary)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(16px)",
          },
          success: {
            iconTheme: {
              primary: "var(--accent-primary)",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

// Exported to main.tsx as the root component wrapped by providers
export default App;
