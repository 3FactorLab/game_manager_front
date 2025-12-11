import React from "react";
import { Link } from "react-router-dom";
import { useGames } from "../../games/hooks/useGames";
import styles from "./AutoScrollGameList.module.css";

export const AutoScrollGameList: React.FC = () => {
  // Fetch more games to ensure enough content for wider grids (e.g. 5 columns)
  const { data, isLoading } = useGames({ limit: 25 });
  // Derived state (no useState/useEffect needed)
  const allGames = data?.pages?.[0]?.data
    ? data.pages.flatMap((page) => page.data)
    : [];

  // Duplicate for infinite scroll effect
  const games = [...allGames, ...allGames];

  if (isLoading || games.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        <div className={styles.track}>
          {games.map((game, index) => (
            <Link
              to={`/game/${game._id}`}
              key={`${index}-${game._id}`}
              className={styles.gameCard}
              title={game.title}
            >
              <img
                src={
                  game.assets?.cover ||
                  "https://placehold.co/600x400/101010/FFF?text=No+Cover"
                }
                alt={game.title}
                className={styles.gameImage}
                loading="lazy"
              />
              <div className={styles.gameOverlay}>
                <p className={styles.gameTitle}>{game.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
