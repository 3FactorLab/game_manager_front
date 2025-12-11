import { useTranslation } from "react-i18next";
import { useLibrary } from "../features/collection/hooks/useLibrary";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../features/collection/components/StatusBadge";
import { Link, useNavigate } from "react-router-dom";

const LibraryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: libraryItems, isLoading } = useLibrary();

  if (isLoading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );

  const renderEmptyState = () => (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2 className="text-gradient">Your library is empty</h2>
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

  const hasItems = libraryItems && libraryItems.length > 0;

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
          <Button variant="primary" size="sm">
            My Games
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/wishlist")}
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
          {libraryItems?.map((item) => (
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
                <h3 style={{ marginBottom: "0.5rem" }}>{item.game.title}</h3>
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
                    Purchased on {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
