/**
 * SearchBar.tsx
 * Search input component for filtering games catalog.
 * Navigates to home page with search query parameter on submit.
 * Supports Enter key for quick search.
 */

import { useState, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import styles from "./SearchBar.module.css";

/**
 * SearchBar component
 * Provides search functionality for games catalog.
 * Updates URL with search query and navigates to filtered results.
 *
 * @returns {JSX.Element} Search input with icon
 */
export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  /**
   * Handle search submission
   * Navigates to home with search query or clears search if empty
   */
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/"); // Clear search
    }
  };

  /**
   * Handle Enter key press
   * Triggers search on Enter key
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <FiSearch className={styles.icon} />
        <input
          type="text"
          className={styles.input}
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

// Exported to Navbar for search functionality
