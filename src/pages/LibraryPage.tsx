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

  // Extract Game objects from UserGame array
  const games = useMemo(
    () => libraryItems?.map((item) => item.game) || [],
    [libraryItems]
  );

  const {
    filteredGames,
    filters,
    handleSearchChange,
    handleGenreChange,
    handlePlatformChange,
    handleSortChange,
    handleClear,
  } = useGameFiltering(games);

  if (isLoading)
    return <div className={styles.loadingState}>{t("library.loading")}</div>;

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <h2 className="text-gradient">{t("library.emptyLibrary")}</h2>
      <p className={styles.emptyStateText}>{t("library.emptyDescription")}</p>
      <Link to="/" className={styles.browseLink}>
        {t("library.browseStore")}
      </Link>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className="text-gradient">{t("nav.library")}</h1>
          <span className={styles.gameCount}>
            {filteredGames.length}{" "}
            {filteredGames.length === 1
              ? t("wishlist.game")
              : t("wishlist.games")}
          </span>
        </div>

        <div className={styles.headerActions}>
          <Button variant="primary" size="sm">
            {t("library.myGames")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/wishlist")}
            size="sm"
          >
            {t("library.wishlist")}
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
