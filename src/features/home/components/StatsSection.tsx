/**
 * StatsSection.tsx
 * Displays platform statistics (Dynamic Games count + Static social proof).
 * Fetches real game count from backend via gamesService.
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaGamepad,
  FaUsers,
  FaLayerGroup,
  FaCode,
  FaBan,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { gamesService } from "../../../services/games.service";
import styles from "./StatsSection.module.css";
import React from "react";

interface StatItemProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  delay?: number;
}

const StatItem = ({ icon: Icon, value, label, delay = 0 }: StatItemProps) => {
  return (
    <motion.div
      className={styles.statItem}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Icon className={styles.icon} />
      <motion.span
        className={styles.number}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.span>
      <span className={styles.label}>{label}</span>
    </motion.div>
  );
};

export const StatsSection = () => {
  const { t } = useTranslation();

  // Fetch real game count (limit=1 is enough to get pagination.total)
  const { data, isLoading } = useQuery({
    queryKey: ["games-count"],
    queryFn: () => gamesService.getCatalog({ limit: 1 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const totalGames = data?.pagination.total || 0;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Dynamic: Games Available */}
      <StatItem
        icon={FaGamepad}
        value={isLoading ? "..." : totalGames} // Simple loading state
        label={t("home.stats.games")}
        delay={0}
      />

      {/* Static: Active Users (Social Proof) */}
      <StatItem
        icon={FaUsers}
        value="50k+"
        label={t("home.stats.users")}
        delay={0.1}
      />

      {/* Static: Collections (Social Proof) */}
      <StatItem
        icon={FaLayerGroup}
        value="120k+"
        label={t("home.stats.collections")}
        delay={0.2}
      />

      {/* Value Prop: Open Source */}
      <StatItem
        icon={FaCode}
        value="100%"
        label={t("home.stats.open_source")}
        delay={0.3}
      />

      {/* Value Prop: Zero Ads */}
      <StatItem
        icon={FaBan}
        value={t("home.stats.no_ads")} // "Zero Ads" text as value
        label={t("home.stats.trusted")}
        delay={0.4}
      />
    </motion.div>
  );
};
