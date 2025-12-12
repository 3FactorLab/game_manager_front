/**
 * Home.tsx
 * Main games catalog page with infinite scroll pagination.
 * Displays game grid with search functionality and React Query for data fetching.
 * Supports search via URL query parameters.
 */

import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGames } from "../features/games/hooks/useGames";
import { GameCard } from "../features/games/components/GameCard";
import type { Game } from "../services/games.service";
import { Button } from "../components/ui/Button";
import styles from "./CatalogPage.module.css";

/**
 * CatalogPage component
 * Displays paginated game catalog with search and infinite scroll.
 * Uses React Query's useInfiniteQuery for efficient data fetching and caching.
 *
 * @returns {JSX.Element} Home page with game grid
 */
const CatalogPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Fetch games with infinite scroll pagination (12 games per page)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGames({
      limit: 12,
      search: searchQuery,
    });

  return (
    <div className={styles.container}>
      {/* Hero section with title */}
      {/* Hero section with title */}
      <section className={styles.hero}>
        <div className={styles.introContent}>
          <h1 className={`${styles.title} text-gradient`}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : t("home.hero_title")}
          </h1>
          <p className={styles.subtitle}>{t("home.hero_subtitle")}</p>
        </div>

        {/* Only show the widget if not searching, to keep focus on results when searching */}
      </section>

      {/* Loading state */}
      {status === "pending" ? (
        <div className={styles.loadingState}>
          <span className={`text-gradient ${styles.loadingText}`}>
            Loading Games...
          </span>
        </div>
      ) : status === "error" ? (
        /* Error state */
        <div className={styles.errorState}>
          Error loading games. Please try again later.
        </div>
      ) : (
        <>
          {/* Game grid with infinite scroll */}
          <div className={styles.grid}>
            {data.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((game: Game) => (
                  <GameCard key={game._id} game={game} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Load more button */}
          <div className={styles.loadMoreContainer}>
            {hasNextPage ? (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                size="lg"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More Games"}
              </Button>
            ) : (
              <span className={styles.endMessage}>You've reached the end!</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Exported to AppRoutes as main games catalog page
export default CatalogPage;
