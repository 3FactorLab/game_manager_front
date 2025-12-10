/**
 * MainLayout.tsx
 * Main application layout wrapper component.
 * Provides consistent structure with header (navbar), main content area, and footer.
 * Uses React Router's Outlet for nested route rendering.
 */

import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";
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

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.brandRow}>
              <img
                src="/game_manager_icon.png"
                alt="GameManager"
                className={styles.brandIcon}
              />
              <div>
                <div className={styles.brandName}>
                  Game<span>Manager</span>
                </div>
                <p className={styles.tagline}>
                  Discover, collect, and manage your games with a polished stack.
                </p>
              </div>
            </div>
            <p className={styles.muted}>
              Curated catalog, secure checkout, and admin controls in one
              glassmorphic experience.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.sectionTitle}>Product</h4>
            <Link to="/">{t("nav.home")}</Link>
            <Link to="/library">{t("nav.library")}</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/games">Catalog</Link>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/register">{t("nav.register")}</Link>
            <Link to="/home">Store</Link>
            <a href="mailto:support@gamemanager.dev">Support</a>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.sectionTitle}>Community</h4>
            <div className={styles.socialRow}>
              <a href="#" aria-label="Discord" className={styles.socialIcon}>
                <FaDiscord />
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href="#" aria-label="GitHub" className={styles.socialIcon}>
                <FaGithub />
              </a>
            </div>
            <p className={styles.muted}>
              Feedback? Drop us a line and help shape the roadmap.
            </p>
          </div>
        </div>
                                                        <div className={styles.footerBottom}>
          <div className={styles.footerText}>
            <div>&copy; {new Date().getFullYear()} GameManager.</div>
            <div>
              Crafted with <span className={styles.heart}>&hearts;</span> by the team (
              <a href="https://andres-fdz-morelli-portfolio.netlify.app/projects" target="_blank" rel="noreferrer">Andr&eacute;s Fern&aacute;ndez Morelli</a>
              {" "}&middot;{" "}
              <a href="https://alonsovine.github.io/portfolioR/" target="_blank" rel="noreferrer">Alonso Vi&ntilde;e</a>
              {" "}&middot;{" "}
              <a href="https://javieerca.github.io/javier-cortes-portfolio/" target="_blank" rel="noreferrer">Javier Cort&eacute;s</a>
              ).
            </div>
          </div>
          <span className={styles.muted}>Glass UI | React | Vite | TS</span>
        </div>
      </footer>
    </div>
  );
};

// Exported to AppRoutes as layout wrapper for all pages
export default MainLayout;












