import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import { Navbar } from "./Navbar";

export const MainLayout = () => {
  return (
    <div className={styles.root}>
      <header className={`${styles.header} glass-panel`}>
        <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          GameManager
        </div>
        <Navbar />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          © 2025 Game Manager. Created by{" "}
          <strong>Andrés Fernández Morelli</strong>.
        </p>
      </footer>
    </div>
  );
};
