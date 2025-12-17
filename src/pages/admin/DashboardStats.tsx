import {
  FaUsers,
  FaGamepad,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useDashboardStats } from "../../hooks/useAdmin";
import { getErrorMessage } from "../../utils/error.util";
import styles from "./DashboardStats.module.css";

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <div className={styles.loading}>Cargando estadísticas...</div>;
  if (error) return <div className={styles.error}>Error: {getErrorMessage(error)}</div>;

  if (!stats) return null;

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
            <p>${stats.kpis.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <FaUsers />
          </div>
          <div className={styles.kpiContent}>
            <h3>Usuarios</h3>
            <p>{stats.kpis.totalUsers}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
            <FaShoppingBag />
          </div>
          <div className={styles.kpiContent}>
            <h3>Pedidos</h3>
            <p>{stats.kpis.totalOrders}</p>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
            <FaGamepad />
          </div>
          <div className={styles.kpiContent}>
            <h3>Juegos</h3>
            <p>{stats.kpis.totalGames}</p>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        {/* 2. Top Games Table */}
        <div className={styles.detailsCard}>
          <h3>🏆 Top 5 Juegos Más Vendidos</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Juego</th>
                <th>Ventas</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {stats.topGames.map((game: any) => (
                <tr key={game.title}>
                  <td>{game.title}</td>
                  <td style={{ textAlign: "center" }}>{game.sales}</td>
                  <td style={{ textAlign: "right", color: "#4caf50" }}>
                    ${game.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Platform Distribution */}
        <div className={styles.detailsCard}>
          <h3>🎮 Distribución de Plataformas</h3>
          <div className={styles.platformList}>
            {stats.platforms.map((p: any) => (
              <div key={p.name} className={styles.platformItem}>
                <span className={styles.platformName}>{p.name}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(p.count / stats.kpis.totalGames) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.platformCount}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
