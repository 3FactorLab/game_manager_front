/**
 * Navbar.tsx
 * Main navigation bar component with responsive design.
 */

import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { clsx } from "clsx";
import { useAuth } from "../../features/auth/AuthContext";
import { useCart } from "../../features/cart/CartContext";
import { Button } from "../ui/Button";
import { SearchBar } from "../ui/SearchBar";
import { UserDropdown } from "./UserDropdown";
import { LanguageToggle } from "../ui/LanguageToggle";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items: cartItems, removeItem, clear, count, total } = useCart();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCart = () => setIsCartOpen((open) => !open);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className={styles.navbar}>
      <Link to="/home" className={styles.logo}>
        <img
          src="/game_manager_icon.png"
          alt="GameManager"
          className={styles.logoIcon}
        />
        Game<span>Manager</span>
      </Link>

      {/* Desktop Navigation */}
      <div className={styles.navLinks}>
        <NavItem
          to="/home"
          label={t("nav.inicio") ?? "Home"}
          onClick={() => setIsMobileOpen(false)}
        />
        <NavItem
          to="/catalog"
          label={t("nav.home") ?? "Catalog"}
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

      <div className={`${styles.desktopParams} ${styles.searchContainer}`}>
        <SearchBar />
      </div>

      {/* Desktop Actions */}
      <div className={clsx(styles.actions, styles.desktopParams)}>
        <LanguageToggle />
        {count > 0 && (
          <div className={styles.cartWrapper} ref={cartRef}>
            <button
              className={styles.cartButton}
              onClick={toggleCart}
              title="View cart"
            >
              <FaShoppingCart />
              <span className={styles.cartBadge}>{count}</span>
            </button>
            {isCartOpen && (
              <div className={styles.cartDropdown}>
                <div className={styles.cartHeader}>
                  <span>Cart ({count})</span>
                  <button
                    onClick={clear}
                    className={styles.clearCart}
                    title="Clear cart"
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.cartList}>
                  {cartItems.map((item) => (
                    <div key={item._id} className={styles.cartItem}>
                      <div className={styles.cartItemInfo}>
                        <div className={styles.cartItemTitle}>{item.title}</div>
                        <div className={styles.cartItemPrice}>
                          {item.price === 0
                            ? "Free"
                            : `${item.currency.toUpperCase()} ${item.price.toFixed(
                                2
                              )}`}
                        </div>
                      </div>
                      <button
                        className={styles.removeCartItem}
                        onClick={() => removeItem(item._id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.cartFooter}>
                  <div className={styles.cartTotal}>
                    Total: {total.toFixed(2)}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCheckout}
                    className={styles.fullWidth}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                clsx(styles.wishlistLink, isActive && styles.wishlistActive)
              }
              title="Wishlist"
            >
              <FaHeart className={styles.wishlistIcon} />
            </NavLink>
            <UserDropdown />
          </>
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
          to="/home"
          label={t("nav.inicio") ?? "Home"}
          onClick={() => setIsMobileOpen(false)}
        />
        <NavItem
          to="/catalog"
          label={t("nav.home") ?? "Catalog"}
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

        <div className={styles.mobileDivider} />

        {/* Mobile Language Toggle */}
        <div style={{ padding: "0 1rem 1rem" }}>
          <LanguageToggle />
        </div>

        <div className={styles.mobileDivider} />

        {isAuthenticated ? (
          <div className={styles.mobileUserSection}>
            <div className={styles.mobileUserInfo}>
              <FaUserCircle /> <span>{user?.username}</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={styles.mobileLogoutBtn}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        ) : (
          <div className={styles.mobileAuthButtons}>
            <Link to="/login" onClick={() => setIsMobileOpen(false)}>
              <Button variant="ghost" className={styles.fullWidth}>
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileOpen(false)}>
              <Button className={styles.fullWidth}>{t("nav.register")}</Button>
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
