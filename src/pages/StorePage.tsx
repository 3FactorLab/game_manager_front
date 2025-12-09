import { useTranslation } from "react-i18next";

const StorePage = () => {
  const { t } = useTranslation();
  return (
    <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h1 className="text-gradient">Store</h1>
      <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
        {t("common.loading", "Coming Soon...")}
      </p>
    </div>
  );
};

export default StorePage;
