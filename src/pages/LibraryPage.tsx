import { useTranslation } from "react-i18next";
import { useLibrary } from "../features/collection/hooks/useLibrary";
import { Button } from "../components/ui/Button";
import { GameCard } from "../features/games/components/GameCard";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LibraryPage.module.css";
import { GameFilterBar } from "../components/common/GameFilterBar";
import { useGameFiltering } from "../hooks/useGameFiltering";
import { useMemo } from "react";

const LibraryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: libraryItems, isLoading } = useLibrary();

  if (isLoading) return <div className={styles.loadingState}>Loading...</div>;

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <h2 className="text-gradient">Your library is empty</h2>
      <p className={styles.emptyStateText}>Go explore and find some games!</p>
      <Link to="/" className={styles.browseLink}>
        Browse Store
      </Link>
    </div>
  );



  // Extract Game objects from UserGame array
  const games = useMemo(() => libraryItems?.map((item) => item.game) || [], [libraryItems]);

  const {
    filteredGames,
    filters,
    handleSearchChange,
    handleGenreChange,
    handlePlatformChange,
    handleSortChange,
    handleClear,
  } = useGameFiltering(games);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className="text-gradient">{t("nav.library")}</h1>
          <span className={styles.gameCount}>
            {filteredGames.length}{" "}
            {filteredGames.length === 1 ? "Game" : "Games"}
          </span>
        </div>

        <div className={styles.headerActions}>
          <Button variant="primary" size="sm">
            My Games
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/wishlist")}
            size="sm"
          >
            Wishlist
          </Button>
        </div>
      </div>

      <GameFilterBar
        searchQuery={filters.query}
        genre={filters.genre}
        platform={filters.platform}
        sortBy={filters.sortBy}
        order={filters.order}
        onSearchChange={handleSearchChange}
        onGenreChange={handleGenreChange}
        onPlatformChange={handlePlatformChange}
        onSortChange={handleSortChange}
        onClear={handleClear}
        collapsible
      />

      {!games.length ? (
        renderEmptyState()
      ) : (
        <div className={styles.grid}>
          {filteredGames.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
