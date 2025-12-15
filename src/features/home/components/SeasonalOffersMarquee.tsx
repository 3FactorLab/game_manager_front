import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GameCard } from "../../games/components/GameCard";
import { useGames } from "../../games/hooks/useGames";
import styles from "./SeasonalOffersMarquee.module.css";
import { useRef } from "react";

export const SeasonalOffersMarquee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch games strictly on sale
  const { data: seasonalGamesResponse, isLoading } = useGames({
    onSale: true,
    limit: 10,
    sortBy: "discount", // Assuming backend supports this or just defaults
  });

  const seasonalGames = seasonalGamesResponse?.data || [];

  if (isLoading || seasonalGames.length === 0) return null;

  // Clone items to ensure seamless loop (tripling usually safeguards wide screens)
  const marqueeItems = [...seasonalGames, ...seasonalGames, ...seasonalGames];

  return (
    <div className={styles.marqueeContainer} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.seasonalTitle}>
          🎄 {t("home.seasonal_offers")} 🎄
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => navigate("/catalog?onSale=true")}
        >
          {t("home.view_all")}
        </button>
      </div>

      <div className={styles.trackWrapper}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((game, index) => (
            <GameCard
              key={`${game._id}-${index}`}
              game={game}
              className={styles.seasonalCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
