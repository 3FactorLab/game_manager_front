/**
 * StorePage.tsx
 * Placeholder page for the store feature.
 * Currently displays "Coming Soon" message while store functionality is being developed.
 * Will be replaced with actual store implementation in future iterations.
 */
import { useTranslation } from "react-i18next";

/**
 * StorePage Component
 * Temporary placeholder page for the future store feature.
 * Shows a centered "Coming Soon" message with i18n support.
 * Uses inline styles (to be refactored to CSS modules).
 *
 * @returns Store placeholder page with glassmorphism panel
 */
const StorePage = () => {
  const { t } = useTranslation();
  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        textAlign: "center",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 className="text-gradient">Store</h1>
      <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
        {t("common.loading", "Coming Soon...")}
      </p>
    </div>
  );
};

// Exported to AppRoutes for /store route
export default StorePage;
