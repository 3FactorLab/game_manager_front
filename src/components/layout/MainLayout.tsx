import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./MainLayout.module.css";
import { Navbar } from "./Navbar";

export const MainLayout = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.root}>
      <header className={`${styles.header} glass-panel`}>
        <Navbar />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          {t("footer.rights", { year: new Date().getFullYear() })}{" "}
          <strong>Andrés Fernández Morelli</strong>.
        </p>
      </footer>
    </div>
  );
};
