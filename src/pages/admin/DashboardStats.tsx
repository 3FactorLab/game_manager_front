import {
  FaUsers,
  FaGamepad,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";
/**
 * DashboardStats.tsx
 * Admin dashboard statistics component displaying KPIs, top games, and sales trends.
 */
import { useDashboardStats, usePublicStats } from "../../hooks/useAdmin";
import { getErrorMessage } from "../../utils/error.util";
import styles from "./DashboardStats.module.css";

const DashboardStats = () => {
  const {
    data: dashboardStats,
    isLoading: isLoadingDashboard,
    error: dashboardError,
  } = useDashboardStats();

  const {
    data: publicStats,
    isLoading: isLoadingPublic,
    error: publicError,
  } = usePublicStats();

  const isLoading = isLoadingDashboard || isLoadingPublic;
  const error = dashboardError || publicError;

  if (isLoading)
    return <div className={styles.loading}>Cargando estadísticas...</div>;
  if (error)
    return <div className={styles.error}>Error: {getErrorMessage(error)}</div>;

  if (!dashboardStats || !publicStats) return null;

  return (
    <div className={styles.container}>
      {/* 1. KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.green}`}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.kpiContent}>
            <h3>Ingresos Totales</h3>
            <p>${dashboardStats.revenue.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <FaUsers />
          </div>
          <div className={styles.kpiContent}>
            <h3>Usuarios</h3>
            <p>{publicStats.totalUsers}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
            <FaShoppingBag />
          </div>
          <div className={styles.kpiContent}>
            <h3>Colecciones</h3>
            <p>{publicStats.totalCollections}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
            <FaGamepad />
          </div>
          <div className={styles.kpiContent}>
            <h3>Juegos</h3>
            <p>{publicStats.totalGames}</p>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        {/* 2. Top Games Table */}
        <div className={styles.detailsCard}>
          <h3>🏆 Top 5 Juegos Más Vendidos</h3>
          <div className={styles.topGames}>
            <ul>
              {dashboardStats.topSelling.map((game) => (
                <li key={game._id}>
                  <span>{game.title}</span>
                  <div className={styles.gameStats}>
                    <span className={styles.soldBadge}>
                      {game.totalSold} vendidos
                    </span>
                    <span className={styles.revenueBadge}>
                      ${game.revenue.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Monthly Trends (Replaces Platforms) */}
        <div className={styles.detailsCard}>
          <h3>📈 Tendencias Mensuales</h3>
          <div className={styles.platformList}>
            {dashboardStats.monthlyTrends.map((trend) => (
              <div key={trend._id} className={styles.platformItem}>
                <span className={styles.platformName}>{trend._id}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      // Simple normalization relative to max revenue (approx) or 100% width for showcase
                      width: `${Math.min(
                        (trend.revenue / dashboardStats.revenue) * 100 * 5,
                        100
                      )}%`, // Scale logic
                    }}
                  />
                </div>
                <span className={styles.platformCount}>
                  ${trend.revenue.toFixed(2)}
                </span>
              </div>
            ))}
            {dashboardStats.monthlyTrends.length === 0 && (
              <p className={styles.emptyState}>
                No hay datos de tendencias aún.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
