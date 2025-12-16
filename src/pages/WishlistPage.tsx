/**
 * WishlistPage.tsx
 * Page for displaying the user's wishlist games.
 */
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsHeart } from "react-icons/bs";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { GameCard } from "../features/games/components/GameCard";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import styles from "./WishlistPage.module.css";
import { useAuth } from "../features/auth/AuthContext";
import { GameFilterBar } from "../components/common/GameFilterBar";
import { useGameFiltering } from "../hooks/useGameFiltering";

export const WishlistPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlist, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  const {
    filteredGames,
    filters,
    handleSearchChange,
    handleGenreChange,
    handlePlatformChange,
    handleSortChange,
    handleClear,
  } = useGameFiltering(wishlist);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.emptyContainer}>
        <BsHeart size={48} className={styles.emptyIcon} />
        <h2>{t("wishlist.pleaseLogin")}</h2>
        <p>{t("wishlist.loginRequired")}</p>
        <Link to="/login" className={styles.browseButton}>
          {t("common.login")}
        </Link>
      </div>
    );
  }

  const renderEmptyState = () => (
    <div className={styles.emptyStateContainer}>
      <h2 className="text-gradient">{t("wishlist.emptyWishlist")}</h2>
      <p className={styles.emptyStateText}>{t("wishlist.emptyDescription")}</p>
      <Link to="/home" className={styles.browseLink}>
        {t("library.browseStore")}
      </Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="text-gradient">{t("wishlist.title")}</h1>
          <span className={styles.count}>
            {filteredGames.length}{" "}
            {filteredGames.length === 1
              ? t("wishlist.game")
              : t("wishlist.games")}
          </span>
        </div>

        <div className={styles.actionsArea}>
          <Button
            variant="ghost"
            onClick={() => navigate("/library")}
            size="sm"
          >
            {t("wishlist.myGames")}
          </Button>
          <Button variant="primary" size="sm">
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

      {!wishlist.length ? (
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

export default WishlistPage;
