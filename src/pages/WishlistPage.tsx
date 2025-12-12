/**
 * WishlistPage.tsx
 * Page for displaying the user's wishlist games.
 */
import { Link, useNavigate } from "react-router-dom";
import { BsHeart } from "react-icons/bs";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { GameCard } from "../features/games/components/GameCard";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import styles from "./WishlistPage.module.css";
import { useAuth } from "../features/auth/AuthContext";

export const WishlistPage = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlist, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

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
        <h2>Please login</h2>
        <p>You need to be logged in to view your wishlist.</p>
        <Link to="/login" className={styles.browseButton}>
          Login
        </Link>
      </div>
    );
  }

  const renderEmptyState = () => (
    <div className={styles.emptyStateContainer}>
      <h2 className="text-gradient">Your wishlist is empty</h2>
      <p className={styles.emptyStateText}>
        Save games you're interested in to track their price or play them later.
      </p>
      <Link to="/home" className={styles.browseLink}>
        Browse Store
      </Link>
    </div>
  );

  const hasItems = wishlist.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="text-gradient">My Wishlist</h1>
          <span className={styles.count}>
            {wishlist.length} {wishlist.length === 1 ? "Game" : "Games"}
          </span>
        </div>

        <div className={styles.actionsArea}>
          <Button
            variant="ghost"
            onClick={() => navigate("/library")}
            size="sm"
          >
            My Games
          </Button>
          <Button variant="primary" size="sm">
            Wishlist
          </Button>
        </div>
      </div>

      {!hasItems ? (
        renderEmptyState()
      ) : (
        <div className={styles.grid}>
          {wishlist.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
