import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGames } from "../features/games/hooks/useGames";
import { GameCard } from "../features/games/components/GameCard";
import type { Game } from "../services/games.service";
import { Button } from "../components/ui/Button";
import styles from "./Home.module.css";

const Home = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGames({ limit: 12, search: searchQuery });

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={`${styles.title} text-gradient`}>
          {searchQuery ? `Results for "${searchQuery}"` : t("home.hero_title")}
        </h1>
        <p className={styles.subtitle}>{t("home.hero_subtitle")}</p>
      </section>

      {status === "pending" ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <span className="text-gradient" style={{ fontSize: "1.5rem" }}>
            Loading Games...
          </span>
          {/* Can replace with Skeleton later */}
        </div>
      ) : status === "error" ? (
        <div style={{ textAlign: "center", color: "var(--error)" }}>
          Error loading games. Please try again later.
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {data.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((game: Game) => (
                  <GameCard key={game._id} game={game} />
                ))}
              </React.Fragment>
            ))}
          </div>

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
              <span style={{ color: "var(--text-muted)" }}>
                You've reached the end!
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
