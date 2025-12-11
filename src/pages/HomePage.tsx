import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGamepad, FaBook, FaSignInAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/ui/Button";
import styles from "./HomePage.module.css";
import { AutoScrollGameList } from "../features/home/components/AutoScrollGameList";

const HomePage = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
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
                        <img src="/game_manager_icon.png" alt="Game Manager" className={styles.heroIconImg} />
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
                        {/* Link to CATALOG now, not /home */}
                        <Link to="/catalog">
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
                        <Link to="/catalog" className={styles.featureLink}>
                            <div className={styles.feature}>
                                <div className={styles.featureIconWrapper}>
                                    <img src="/discover_image.png" alt="Discover" className={styles.featureIcon} />
                                </div>
                                <span className={styles.featureText}>{t("landing.feature_discover")}</span>
                            </div>
                        </Link>
                        <Link to={isAuthenticated ? "/library" : "/login"} className={styles.featureLink}>
                            <div className={styles.feature}>
                                <div className={styles.featureIconWrapper}>
                                    <img src="/catalog_image.png" alt="Organize" className={styles.featureIcon} />
                                </div>
                                <span className={styles.featureText}>{t("landing.feature_organize")}</span>
                            </div>
                        </Link>
                        <Link to={isAuthenticated ? "/wishlist" : "/login"} className={styles.featureLink}>
                            <div className={styles.feature}>
                                <div className={styles.featureIconWrapper}>
                                    <img src="/track_image.png" alt="Track" className={styles.featureIcon} />
                                </div>
                                <span className={styles.featureText}>{t("landing.feature_track")}</span>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* AutoScroll Widget - Added to the right side */}
                <div className={styles.widgetContainer}>
                    <AutoScrollGameList />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
