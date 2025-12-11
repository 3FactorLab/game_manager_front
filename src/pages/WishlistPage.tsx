/**
 * WishlistPage.tsx
 * Page for displaying the user's wishlist games.
 */
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { GameCard } from "../features/games/components/GameCard";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import styles from "./WishlistPage.module.css";
import { useAuth } from "../features/auth/AuthContext";

export const WishlistPage = () => {
    const { t } = useTranslation();
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
        <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2 className="text-gradient">Your wishlist is empty</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Save games you're interested in to track their price or play them later.
            </p>
            <Link to="/home" style={{ color: "var(--accent-primary)", fontWeight: "bold" }}>
                Browse Store
            </Link>
        </div>
    );

    const hasItems = wishlist.length > 0;

    return (
        <div className={styles.page}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                }}
            >
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                    <h1 className="text-gradient">My Wishlist</h1>
                    <span className={styles.count}>
                        {wishlist.length} {wishlist.length === 1 ? "Game" : "Games"}
                    </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Button variant="ghost" onClick={() => navigate("/library")} size="sm">
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
