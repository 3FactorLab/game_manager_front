/**
 * GameCard.tsx
 * Displays individual game information in a card format.
 * Shows game cover, title, genre, platform, score, and pricing with offer calculations.
 * Navigates to game details page on click.
 */

import { useNavigate } from "react-router-dom";
import { BsCartPlus, BsHeart, BsHeartFill } from "react-icons/bs";
import { Card } from "../../../components/ui/Card";
import type { Game } from "../../../services/games.service";
import { formatCurrency } from "../../../utils/format";
import { useCart } from "../../cart/CartContext";
import { useWishlist } from "../../wishlist/WishlistContext";
import { useQueryClient } from "@tanstack/react-query";
import { gamesService } from "../../../services/games.service";
import { LazyImage } from "../../../components/common/LazyImage";
import styles from "./GameCard.module.css";

/**
 * GameCard component props
 */
interface GameCardProps {
  game: Game; // Game data to display
}

/**
 * GameCard component
 * Clickable card displaying game information with cover image and pricing.
 * Calculates and displays offer discounts when applicable.
 *
 * @param {GameCardProps} props - Component props
 * @returns {JSX.Element} Game card with image, details, and pricing
 */
export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const queryClient = useQueryClient();

  /**
   * Navigate to game details page
   */
  const handleCardClick = () => {
    navigate(`/game/${game._id}`);
  };

  /**
   * Prefetch game details on hover
   * Improves perceived performance by loading data before click
   */
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["game", game._id],
      queryFn: () => gamesService.getGameById(game._id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Calculate offer pricing
  const hasOffer = game.isOffer && game.offerPrice !== undefined;
  const currentPrice = hasOffer ? game.offerPrice : game.price;

  return (
    <Card
      className={styles.gameCard}
      padding="none"
      hoverable
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Game cover image */}
      <div className={styles.coverImageWrapper}>
        <LazyImage
          src={
            game.assets?.cover ||
            game.image ||
            "https://placehold.co/600x400/101010/FFF?text=No+Cover"
          }
          alt={game.title}
          imageClassName={styles.coverImage}
        />
        <button
          className={styles.addToCart}
          onClick={(e) => {
            e.stopPropagation();
            addItem(game);
          }}
          title="Add to cart"
        >
          <BsCartPlus />
        </button>
        <button
          className={`${styles.wishlistBtn} ${
            isInWishlist(game._id) ? styles.active : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isInWishlist(game._id)) {
              removeFromWishlist(game._id);
            } else {
              addToWishlist(game);
            }
          }}
          title={
            isInWishlist(game._id) ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          {isInWishlist(game._id) ? <BsHeartFill /> : <BsHeart />}
        </button>
      </div>

      {/* Game information */}
      <div className={styles.content}>
        {/* Header: Title and Score */}
        <div className={styles.header}>
          <h3 className={styles.title} title={game.title}>
            {game.title}
          </h3>
          {game.score && (
            <span className={styles.scoreBadge}>⭐ {game.score}</span>
          )}
        </div>

        {/* Meta Info: Genre */}
        <div className={styles.metaContainer}>
          <span className={styles.genreBadge}>{game.genre}</span>
        </div>

        {/* Platform Badge (on its own line) */}
        {/* Platform Badges */}
        <div className={styles.platformContainer}>
          {(game.platforms?.length ? game.platforms : ["Unknown"]).map(
            (platform, index) => (
              <span key={index} className={styles.platformBadge}>
                {platform}
              </span>
            )
          )}
        </div>

        {/* Footer with pricing */}
        <div className={styles.footer}>
          <div className={styles.developerContainer}>
            {game.developer && (
              <span className={styles.developerBadge}>{game.developer}</span>
            )}
          </div>

          <div className={styles.priceContainer}>
            {/* Discount percentage badge */}
            {hasOffer && (
              <span className={styles.discount}>
                -
                {Math.round(
                  ((game.price - (game.offerPrice || 0)) / game.price) * 100
                )}
                %
              </span>
            )}
            {/* Original price (strikethrough) */}
            {hasOffer && (
              <span className={styles.oldPrice}>
                {formatCurrency(game.price, game.currency)}
              </span>
            )}
            {/* Current price */}
            <span className={styles.price}>
              {currentPrice === 0
                ? "Free"
                : formatCurrency(currentPrice || 0, game.currency)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Exported to Home and other pages for game grid display
