import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGamepad, FaBook, FaSignInAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/ui/Button";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.heroCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={styles.iconWrapper}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          <FaGamepad className={styles.heroIcon} />
        </motion.div>

        <motion.h1
          className={`${styles.title} text-gradient`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {t("landing.hero_title")}
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {t("landing.hero_subtitle")}
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link to="/home">
            <Button size="lg" className={styles.primaryBtn}>
              <FaGamepad />
              {t("landing.explore_games")}
            </Button>
          </Link>

          {isAuthenticated ? (
            <Link to="/library">
              <Button size="lg" variant="secondary" className={styles.secondaryBtn}>
                <FaBook />
                {t("landing.my_library")}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg" variant="secondary" className={styles.secondaryBtn}>
                <FaSignInAlt />
                {t("landing.login")}
              </Button>
            </Link>
          )}
        </motion.div>

        <motion.div
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎮</span>
            <span className={styles.featureText}>{t("landing.feature_discover")}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📚</span>
            <span className={styles.featureText}>{t("landing.feature_organize")}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⭐</span>
            <span className={styles.featureText}>{t("landing.feature_track")}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
