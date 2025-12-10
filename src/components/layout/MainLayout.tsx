/**
 * MainLayout.tsx
 * Main application layout wrapper component.
 * Provides consistent structure with header (navbar), main content area, and footer.
 * Uses React Router's Outlet for nested route rendering.
 */

import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./MainLayout.module.css";
import { Navbar } from "./Navbar";

/**
 * MainLayout component
 * Wraps all pages with consistent header and footer.
 * Main content area renders nested routes via Outlet.
 *
 * @returns {JSX.Element} Layout with navbar, content area, and footer
 */
export const MainLayout = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.root}>
      {/* Header with navigation */}
      <header className={`${styles.header} glass-panel`}>
        <Navbar />
      </header>

      {/* Main content area - renders nested routes */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer with copyright */}
      <footer className={styles.footer}>
        <p>
          {t("footer.rights", { year: new Date().getFullYear() })}{" "}
          <strong>Andrés Fernández Morelli</strong>.
        </p>
      </footer>
    </div>
  );
};

// Exported to AppRoutes as layout wrapper for all pages
