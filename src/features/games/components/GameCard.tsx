import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import type { Game } from "../../../services/games.service";
import { formatCurrency } from "../../../utils/format";
import styles from "./GameCard.module.css";

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/game/${game._id}`);
  };

  const hasOffer = game.isOffer && game.offerPrice !== undefined;
  const currentPrice = hasOffer ? game.offerPrice : game.price;

  return (
    <Card
      className={styles.gameCard}
      padding="none"
      hoverable
      onClick={handleCardClick}
    >
      <div className={styles.coverImageWrapper}>
        <img
          src={
            game.assets?.cover ||
            "https://placehold.co/600x400/101010/FFF?text=No+Cover"
          }
          alt={game.title}
          className={styles.coverImage}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title} title={game.title}>
          {game.title}
        </h3>

        <div className={styles.badges}>
          <span className={styles.genreBadge}>{game.genre}</span>
          <span className={styles.platformBadge}>{game.platform}</span>
          {game.score && (
            <span className={styles.scoreBadge}>⭐ {game.score}/10</span>
          )}
        </div>

        <div className={styles.footer}>
          {/* Action Button Placeholder (e.g. Add to Cart) - Optional on card */}
          <div />

          <div className={styles.priceContainer}>
            {hasOffer && (
              <span className={styles.discount}>
                -
                {Math.round(
                  ((game.price - (game.offerPrice || 0)) / game.price) * 100
                )}
                %
              </span>
            )}
            {hasOffer && (
              <span className={styles.oldPrice}>
                {formatCurrency(game.price, game.currency)}
              </span>
            )}
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
