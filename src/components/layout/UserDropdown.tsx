/**
 * UserDropdown.tsx
 * User profile dropdown menu with avatar, user info, and actions.
 * Features:
 * - Animated dropdown with Framer Motion
 * - Click-outside detection to close menu
 * - Avatar upload modal integration
 * - Password change modal integration
 * - Quick access to library and logout
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaCamera,
  FaBook,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import { useAuth } from "../../features/auth/AuthContext";
import { AvatarUploadModal } from "../../features/profile/components/AvatarUploadModal";
import { ChangePasswordModal } from "../../features/profile/components/ChangePasswordModal";
import styles from "./UserDropdown.module.css";

/**
 * UserDropdown component
 * Displays user avatar and dropdown menu with profile actions.
 * Automatically closes when clicking outside the dropdown.
 *
 * @returns {JSX.Element | null} User dropdown menu or null if not authenticated
 */

export const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Close dropdown when clicking outside
   * Uses event listener to detect clicks outside the dropdown element
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeAvatar = () => {
    setIsOpen(false);
    setIsAvatarModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (!user) return null;

  return (
    <>
      <div className={styles.container} ref={dropdownRef}>
        {/* Avatar Button */}
        <button
          className={styles.avatarButton}
          onClick={handleAvatarClick}
          aria-label="User menu"
        >
          <div className={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <FaUserCircle size={32} />
            )}
          </div>
          <span className={styles.username}>{user.username}</span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* User Info */}
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <FaUserCircle size={40} />
                  )}
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{user.username}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
              </div>

              <div className={styles.divider} />

              {/* Menu Items */}
              <button className={styles.menuItem} onClick={handleChangeAvatar}>
                <FaCamera />
                <span>Change Avatar</span>
              </button>

              <button
                className={styles.menuItem}
                onClick={handleChangePassword}
              >
                <FaLock />
                <span>Change Password</span>
              </button>

              <Link
                to="/library"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FaBook />
                <span>My Library</span>
              </Link>

              <div className={styles.divider} />

              <button
                className={`${styles.menuItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user.avatar}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
