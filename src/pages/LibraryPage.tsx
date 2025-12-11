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

  if (isLoading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );

  const renderEmptyState = () => (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2 className="text-gradient">Your library is empty</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Go explore and find some games!
      </p>
      <Link
        to="/"
        style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
      >
        Browse Store
      </Link>
    </div>
  );

  const hasItems = libraryItems && libraryItems.length > 0;

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginRight: "auto" }}>
          <h1 className="text-gradient">
            {t("nav.library")}
          </h1>
          <span style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            {libraryItems?.length || 0} {(libraryItems?.length || 0) === 1 ? "Game" : "Games"}
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
        <div className={styles.emptyState}>
          <h2 className={`${styles.emptyTitle} text-gradient`}>
            Your library is empty
          </h2>
          <p className={styles.emptyText}>Go explore and find some games!</p>
          <Link to="/" className={styles.browseLink}>
            Browse Store
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {libraryItems?.map((item) => (
            <Card
              key={item._id}
              hoverable
              className={styles.libraryCard}
              onClick={() => navigate(`/game/${item.game._id}`)}
              padding="md"
            >
              <div className={styles.imageWrapper}>
                <img
                  src={
                    item.game.assets?.cover ||
                    "https://placehold.co/200x112/101010/FFF?text=Game"
                  }
                  alt={item.game.title}
                  className={styles.image}
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.gameTitle}>{item.game.title}</h3>
                <div className={styles.metaRow}>
                  <StatusBadge status={item.status} />
                  <span className={styles.purchaseDate}>
                    Purchased on {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
