/**
 * GameDetails.tsx
 * Detailed game information page with purchase and wishlist functionality.
 * Features:
 * - Game cover, screenshots, and videos
 * - Full game description and metadata
 * - Purchase button with checkout navigation
 * - Wishlist add/remove functionality
 * - Image modal for viewing screenshots
 * - Responsive layout with glassmorphism design
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { BsCartPlus, BsHeart, BsHeartFill } from "react-icons/bs";
import { useGameDetails } from "../features/games/hooks/useGameDetails";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { useCart } from "../features/cart/CartContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ImageModal } from "../components/ui/ImageModal";
import { formatCurrency } from "../utils/format";
import { useAuth } from "../features/auth/AuthContext";
import styles from "./GameDetails.module.css";

/**
 * GameDetails component
 * Displays comprehensive game information with purchase and wishlist options.
 * Fetches game data using useGameDetails hook.
 *
 * @returns {JSX.Element} Game details page
 */

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data: game, isLoading, error } = useGameDetails(id);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  // Modal state for screenshot lightbox
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = isInWishlist(game?._id || "");

  const handleToggleWishlist = async () => {
    if (!game) return;
    if (isWishlisted) {
      await removeFromWishlist(game._id);
    } else {
      await addToWishlist(game);
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );
  if (error || !game)
    return (
      <div
        style={{ padding: "4rem", textAlign: "center", color: "var(--error)" }}
      >
        Game not found
      </div>
    );

  const hasOffer = game.isOffer && game.offerPrice !== undefined;
  const currentPrice = hasOffer ? game.offerPrice : game.price;

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <img
          src={
            game.assets?.cover ||
            "https://placehold.co/1200x600/101010/FFF?text=No+Cover"
          }
          alt={game.title}
          className={styles.heroBackground}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>{game.title}</h1>
          <div className={styles.meta}>
            <span
              style={{
                background: "var(--bg-secondary)",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              {game.platform}
            </span>
            <span>{game.developer}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <Card>
            <h2 style={{ marginBottom: "1rem" }}>About this game</h2>
            <p className={styles.description}>{game.description}</p>
          </Card>

          {/* Screenshot Gallery */}
          {game.assets?.screenshots && game.assets.screenshots.length > 0 && (
            <Card>
              <h2 style={{ marginBottom: "1rem" }}>Screenshots</h2>
              <div className={styles.gallery}>
                {game.assets.screenshots.slice(0, 6).map((screenshot, i) => (
                  <img
                    key={i}
                    src={screenshot}
                    alt={`${game.title} screenshot ${i + 1}`}
                    className={styles.screenshot}
                    onClick={() => {
                      setCurrentImageIndex(i);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className={styles.sidebar}>
          {/* Cover Image Card */}
          <Card padding="none">
            <img
              src={
                game.assets?.cover ||
                "https://placehold.co/350x500/101010/FFF?text=No+Cover"
              }
              alt={game.title}
              className={styles.coverImage}
            />
          </Card>

          <Card className={styles.priceCard} padding="lg">
            <div className={styles.priceRow}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {hasOffer && (
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "var(--text-muted)",
                    }}
                  >
                    {formatCurrency(game.price, game.currency)}
                  </span>
                )}
                <span className={styles.price}>
                  {currentPrice === 0
                    ? "Free"
                    : formatCurrency(currentPrice || 0, game.currency)}
                </span>
              </div>
              {hasOffer && (
                <span
                  style={{
                    background: "var(--accent-primary)",
                    color: "white",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  OFFER
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <Button
                size="lg"
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Login to buy" : ""}
                onClick={() => navigate(`/checkout/${game._id}`)}
              >
                <BsCartPlus /> Buy Now
              </Button>
              <Button
                variant="ghost"
                disabled={!isAuthenticated}
                onClick={() => addItem(game)}
              >
                Add to Cart
              </Button>
              <Button
                variant="ghost"
                disabled={
                  !isAuthenticated ||
                  addToWishlist.isPending ||
                  removeFromWishlist.isPending
                }
                onClick={handleToggleWishlist}
              >
                {isWishlisted ? (
                  <BsHeartFill color="var(--accent-primary)" />
                ) : (
                  <BsHeart />
                )}
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </Button>
              {!isAuthenticated && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  Login to purchase
                </p>
              )}
            </div>
          </Card>

          <Card padding="md">
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Genre</span>
              <span className={styles.genreValue}>{game.genre}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Developer</span>
              <span>{game.developer}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Publisher</span>
              <span>{game.publisher}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Release Date</span>
              <span>
                {game.releaseDate
                  ? new Date(game.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "TBA"}
              </span>
            </div>
            {game.metacritic && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Metacritic</span>
                <span className={styles.metacriticScore}>
                  {game.metacritic}/100
                </span>
              </div>
            )}
            {game.score && (
              <div
                className={styles.detailRow}
                style={{ borderBottom: "none" }}
              >
                <span className={styles.detailLabel}>User Score</span>
                <span style={{ color: "var(--success)", fontWeight: "bold" }}>
                  {game.score}/10
                </span>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {/* Image Modal */}
      {modalOpen && game?.assets?.screenshots && (
        <ImageModal
          images={game.assets.screenshots}
          currentIndex={currentImageIndex}
          onClose={() => setModalOpen(false)}
          onNavigate={setCurrentImageIndex}
        />
      )}
    </div>
  );
};

export default GameDetails;
