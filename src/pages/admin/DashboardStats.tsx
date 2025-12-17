import {
  FaUsers,
  FaGamepad,
  FaShoppingBag,
  FaMoneyBillWave,
  FaChartLine,
  FaHeart,
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
          <h3>🏆 Top 5 Juegos (Ingresos)</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Juego</th>
                <th>Unds.</th>
                <th>Total</th>
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
          <h3>🎮 Plataformas</h3>
          <div className={styles.platformList}>
            {stats.platforms.map((p: any) => (
              <div key={p.name} className={styles.platformItem}>
                <span className={styles.platformName}>{p.name}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min((p.count / (stats.kpis.totalGames || 1)) * 100 * 3, 100)}%`, // Scale visually
                    }}
                  />
                </div>
                <span className={styles.platformCount}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* 4. Sales Trend & Library Stats */}
       <div className={styles.detailsGrid}>
        {/* Sales Trend - Basic List Visualization */}
        <div className={styles.detailsCard}>
          <h3><FaChartLine style={{ marginRight: "0.5rem" }}/> Ventas (Últimos 12 Meses)</h3>
           {stats.salesTrend?.length > 0 ? (
            <div className={styles.trendList}>
              {stats.salesTrend.map((t: any) => (
                <div key={t.date} className={styles.trendItem}>
                   <span className={styles.trendDate}>{t.date}</span>
                   <span className={styles.trendValue}>${t.sales.toFixed(2)}</span>
                   <span className={styles.trendCount}>({t.orders} pedidos)</span>
                </div>
              ))}
            </div>
           ) : (
             <p className={styles.emptyText}>No hay datos de ventas recientes.</p>
           )}
        </div>

        {/* Top Library Games */}
        <div className={styles.detailsCard}>
          <h3><FaHeart style={{ marginRight: "0.5rem", color: "#e91e63" }}/> Top en Bibliotecas</h3>
           <table className={styles.table}>
            <thead>
              <tr>
                <th>Juego</th>
                <th>Usuarios</th>
              </tr>
            </thead>
            <tbody>
              {stats.libraryStats?.map((game: any) => (
                <tr key={game.title}>
                  <td>{game.title}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>{game.count}</td>
                </tr>
              ))}
              {(!stats.libraryStats || stats.libraryStats.length === 0) && (
                <tr><td colSpan={2} className={styles.emptyText}>Sin datos aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
