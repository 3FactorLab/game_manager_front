import { useTranslation } from "react-i18next";
import { useLibrary } from "../features/collection/hooks/useLibrary";
import { Button } from "../components/ui/Button";
import { GameCard } from "../features/games/components/GameCard";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LibraryPage.module.css";

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

  const hasItems = libraryItems && libraryItems.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className="text-gradient">{t("nav.library")}</h1>
          <span className={styles.gameCount}>
            {libraryItems?.length || 0}{" "}
            {(libraryItems?.length || 0) === 1 ? "Game" : "Games"}
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

      {!hasItems ? (
        renderEmptyState()
      ) : (
        <div className={styles.grid}>
          {libraryItems?.map((item) => (
            <GameCard key={item._id} game={item.game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
