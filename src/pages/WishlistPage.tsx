/**
 * WishlistPage.tsx
 * Page for displaying the user's wishlist games.
 */
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { GameCard } from "../features/games/components/GameCard";
import { Loader } from "../components/ui/Loader";
import styles from "./WishlistPage.module.css";
import { useAuth } from "../features/auth/AuthContext";

export const WishlistPage = () => {
    const { t } = useTranslation();
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

    if (wishlist.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <BsHeartFill size={48} className={styles.emptyIcon} />
                <h2>Your wishlist is empty</h2>
                <p>Save games you're interested in to track their price or play them later.</p>
                <Link to="/home" className={styles.browseButton}>
                    Browse Store
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>My Wishlist</h1>
                <span className={styles.count}>
                    {wishlist.length} {wishlist.length === 1 ? "Game" : "Games"}
                </span>
            </div>

            <div className={styles.grid}>
                {wishlist.map((game) => (
                    <GameCard key={game._id} game={game} />
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
