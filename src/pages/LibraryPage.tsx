import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLibrary } from "../features/collection/hooks/useLibrary";
import { useWishlist } from "../features/collection/hooks/useWishlist";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../features/collection/components/StatusBadge";
import { Link, useNavigate } from "react-router-dom";
// import { clsx } from "clsx";

const LibraryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"library" | "wishlist">("library");

  const { data: libraryItems, isLoading: loadingLib } = useLibrary();
  const { wishlist, isLoading: loadingWish } = useWishlist();

  const isLoading = activeTab === "library" ? loadingLib : loadingWish;

  if (isLoading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );

  const renderEmptyState = () => (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2 className="text-gradient">
        {activeTab === "library"
          ? "Your library is empty"
          : "Your wishlist is empty"}
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Go explore and find some games!
      </p>
      <Link
        to="/"
        style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
      >
        Browse Store
      </Link>
    </div>
  );

  const hasItems =
    activeTab === "library"
      ? libraryItems && libraryItems.length > 0
      : wishlist && wishlist.length > 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="text-gradient" style={{ marginRight: "auto" }}>
          {t("nav.library")}
        </h1>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            variant={activeTab === "library" ? "primary" : "ghost"}
            onClick={() => setActiveTab("library")}
            size="sm"
          >
            My Games
          </Button>
          <Button
            variant={activeTab === "wishlist" ? "primary" : "ghost"}
            onClick={() => setActiveTab("wishlist")}
            size="sm"
          >
            Wishlist
          </Button>
        </div>
      </div>

      {!hasItems ? (
        renderEmptyState()
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {activeTab === "library"
            ? libraryItems?.map((item) => (
                <Card
                  key={item._id}
                  hoverable
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/game/${item.game._id}`)}
                >
                  <div
                    style={{
                      width: "120px",
                      aspectRatio: "16/9",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={
                        item.game.assets?.cover ||
                        "https://placehold.co/200x112/101010/FFF?text=Game"
                      }
                      alt={item.game.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>
                      {item.game.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <StatusBadge status={item.status} />
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.9rem",
                        }}
                      >
                        Purchased on{" "}
                        {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            : wishlist?.map((game) => (
                <Card
                  key={game._id}
                  hoverable
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/game/${game._id}`)}
                >
                  <div
                    style={{
                      width: "120px",
                      aspectRatio: "16/9",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={
                        game.assets?.cover ||
                        "https://placehold.co/200x112/101010/FFF?text=Game"
                      }
                      alt={game.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{game.title}</h3>
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      {game.developer}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/checkout/${game._id}`);
                    }}
                  >
                    Buy Now
                  </Button>
                </Card>
              ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
