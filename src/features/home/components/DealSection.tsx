import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGames } from "../../games/hooks/useGames";
import { GameCard } from "../../games/components/GameCard";
import styles from "./DealSection.module.css";
import { SeasonalOffersMarquee } from "./SeasonalOffersMarquee";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const DealSection = () => {
  const { t } = useTranslation();
  const { data: freeResponse, isLoading: loadingFree } = useGames({
    maxPrice: 0,
    sortBy: "score",
    limit: 16,
  });

  const { data: cheapResponse, isLoading: loadingCheap } = useGames({
    maxPrice: 10,
    sortBy: "score",
    limit: 16,
  });

  const [freeIndex, setFreeIndex] = useState(0);
  const [cheapIndex, setCheapIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const freeGamesAll = freeResponse?.data || [];
  const cheapGamesAll = cheapResponse?.data || [];

  // Calculate visible batches (4 games each, wider layout)
  const visibleFreeGames = freeGamesAll.slice(
    freeIndex * 4,
    (freeIndex + 1) * 4
  );
  const visibleCheapGames = cheapGamesAll.slice(
    cheapIndex * 4,
    (cheapIndex + 1) * 4
  );

  // Synchronized rotation logic (Alternating every 4 seconds)
  useEffect(() => {
    if (freeGamesAll.length <= 4 && cheapGamesAll.length <= 4) return;

    // Start by rotating Free Games immediately
    let shouldRotateFree = true;

    const interval = setInterval(() => {
      // Pause animation if hovering over any card
      if (isPaused) return;

      if (shouldRotateFree) {
        // Rotate Free Games
        if (freeGamesAll.length > 4) {
          setFreeIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex * 4 < freeGamesAll.length ? nextIndex : 0;
          });
        }
      } else {
        // Rotate Cheap Games
        if (cheapGamesAll.length > 4) {
          setCheapIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex * 4 < cheapGamesAll.length ? nextIndex : 0;
          });
        }
      }
      // Toggle for next iteration
      shouldRotateFree = !shouldRotateFree;
    }, 4000);

    return () => clearInterval(interval);
  }, [freeGamesAll.length, cheapGamesAll.length, isPaused]);

  if (loadingFree || loadingCheap)
    return <div className="text-center py-10">{t("home.loading")}</div>;

  return (
    <>
      <SeasonalOffersMarquee />
      <section className={styles.container}>
        {/* Free Games Column */}
        <motion.div
          className={`glass-panel ${styles.dealColumn} ${styles.flashColumn}`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>
              🎁{" "}
              <span className={styles.flashTitle}>{t("home.free_games")}</span>
            </h2>
            <Link
              to="/catalog?maxPrice=0"
              className={styles.link}
              style={{ color: "var(--bg-primary)" }}
            >
              {t("home.view_all")}
            </Link>
          </div>
          <div className={styles.grid}>
            <AnimatePresence mode="wait" initial={false}>
              {visibleFreeGames.map((game, index) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    delay: index * 0.02,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </AnimatePresence>
            {freeGamesAll.length === 0 && (
              <p className="text-muted">{t("home.no_free_games")}</p>
            )}
          </div>
        </motion.div>

        {/* Under $10 Column */}
        <motion.div
          className={`glass-panel ${styles.dealColumn}`}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>
              💎 <span className="text-gradient">{t("home.under_10")}</span>
            </h2>
            <Link to="/catalog?maxPrice=10" className={styles.link}>
              {t("home.view_all")}
            </Link>
          </div>

          <div className={styles.grid}>
            <AnimatePresence mode="wait" initial={false}>
              {visibleCheapGames.map((game, index) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    delay: index * 0.02,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </AnimatePresence>
            {cheapGamesAll.length === 0 && (
              <p className="text-muted">{t("home.no_cheap_games")}</p>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
};
