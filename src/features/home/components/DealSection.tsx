/**
 * DealSection.tsx
 * Displays "Flash Deals" and "Games Under $10" using the modern store design.
 * Uses css variables for theming.
 */
import { useTranslation } from "react-i18next";
import { useGames } from "../../games/hooks/useGames";
import { GameCard } from "../../games/components/GameCard";
import styles from "./DealSection.module.css";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const DealSection = () => {
  const { t } = useTranslation();
  const { data: freeResponse, isLoading: loadingFree } = useGames({
    maxPrice: 0,
    sortBy: "score",
    limit: 15, // Fetch 15 for rotation (3 batches of 5)
  });

  const { data: cheapResponse, isLoading: loadingCheap } = useGames({
    maxPrice: 10,
    sortBy: "score",
    limit: 15,
  });

  const [freeIndex, setFreeIndex] = useState(0);
  const [cheapIndex, setCheapIndex] = useState(0);

  const freeGamesAll = freeResponse?.data || [];
  const cheapGamesAll = cheapResponse?.data || [];

  // Calculate visible batches (5 games each)
  const visibleFreeGames = freeGamesAll.slice(
    freeIndex * 5,
    (freeIndex + 1) * 5
  );
  const visibleCheapGames = cheapGamesAll.slice(
    cheapIndex * 5,
    (cheapIndex + 1) * 5
  );

  // Cycle logic for Free Games (Interval: 8s)
  useEffect(() => {
    if (freeGamesAll.length <= 5) return;
    const interval = setInterval(() => {
      setFreeIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex * 5 < freeGamesAll.length ? nextIndex : 0;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [freeGamesAll.length]);

  // Cycle logic for Cheap Games (Interval: 8s, delayed by 4s for stagger)
  useEffect(() => {
    if (cheapGamesAll.length <= 5) return;

    // Initial delay to offset from Free Games
    const timeout = setTimeout(() => {
      setCheapIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex * 5 < cheapGamesAll.length ? nextIndex : 0;
      });

      // Start interval after first tick
      const interval = setInterval(() => {
        setCheapIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex * 5 < cheapGamesAll.length ? nextIndex : 0;
        });
      }, 8000);

      // Cleanup interval on unmount (or when this effect re-runs)
      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [cheapGamesAll.length]);

  if (loadingFree || loadingCheap)
    return <div className="text-center py-10">{t("home.loading")}</div>;

  return (
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
            🎁 <span className={styles.flashTitle}>{t("home.free_games")}</span>
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
          <AnimatePresence mode="wait">
            {visibleFreeGames.map((game) => (
              <motion.div
                key={game._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
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
          <AnimatePresence mode="wait">
            {visibleCheapGames.map((game) => (
              <motion.div
                key={game._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
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
  );
};
