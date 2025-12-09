import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { clsx } from "clsx";
import { useAuth } from "../../features/auth/AuthContext";
import { Button } from "../ui/Button";
import { SearchBar } from "../ui/SearchBar";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileOpen(false);
  };

  return (
    <div className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Game<span>Manager</span>
      </Link>

      {/* Desktop Navigation */}
      <div className={styles.navLinks}>
        <NavItem
          to="/"
          label={t("nav.inicio")}
          onClick={() => setIsMobileOpen(false)}
        />
        <NavItem
          to="/home"
          label={t("nav.home")}
          onClick={() => setIsMobileOpen(false)}
        />
        {isAuthenticated && (
          <NavItem
            to="/library"
            label={t("nav.library")}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        {isAuthenticated && user?.role === "admin" && (
          <NavItem
            to="/admin"
            label="Admin Panel"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </div>

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          margin: "0 2rem",
        }}
        className={styles.desktopParams}
      >
        <SearchBar />
      </div>

      {/* Desktop Actions */}
      <div className={clsx(styles.actions, styles.desktopParams)}>
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <div className={styles.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <FaUserCircle size={24} />
              )}
            </div>
            <span style={{ fontWeight: 500 }}>{user?.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt />
            </Button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">{t("nav.register")}</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className={styles.mobileMenuBtn} onClick={toggleMobile}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Drawer */}
      <div className={clsx(styles.mobileDrawer, isMobileOpen && styles.open)}>
        <NavItem
          to="/"
          label={t("nav.inicio")}
          onClick={() => setIsMobileOpen(false)}
        />
        <NavItem
          to="/home"
          label={t("nav.home")}
          onClick={() => setIsMobileOpen(false)}
        />
        {isAuthenticated && (
          <NavItem
            to="/library"
            label={t("nav.library")}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        {isAuthenticated && user?.role === "admin" && (
          <NavItem
            to="/admin"
            label="Admin Panel"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <div
          style={{
            height: "1px",
            background: "var(--glass-border)",
            margin: "0.5rem 0",
          }}
        />

        {isAuthenticated ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaUserCircle /> <span>{user?.username}</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              style={{ justifyContent: "flex-start" }}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link to="/login" onClick={() => setIsMobileOpen(false)}>
              <Button variant="ghost" style={{ width: "100%" }}>
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileOpen(false)}>
              <Button style={{ width: "100%" }}>{t("nav.register")}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(styles.link, isActive && styles.linkActive)
    }
    onClick={onClick}
  >
    {label}
  </NavLink>
);
