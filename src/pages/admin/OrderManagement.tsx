/**
 * OrderManagement.tsx
 * Admin order management component for viewing and searching orders.
 */
import { useState } from "react";
import { useOrders } from "../../hooks/useAdmin";
import { getErrorMessage } from "../../utils/error.util";
import styles from "./UserManagement.module.css"; // Reuse existing styles for consistency

/**
 * Interface for order item
 */
interface OrderItem {
  game?: string;
  title: string;
  price?: number;
}

/**
 * Interface for order data
 */
interface Order {
  _id: string;
  user?: {
    username: string;
    email: string;
  };
  items?: OrderItem[];
  totalAmount?: number;
  createdAt: string;
  status?: string;
}

const OrderManagement = () => {
  const { data: orders, isLoading, error } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders?.filter((order: Order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesId = order._id.toLowerCase().includes(searchLower);
    const matchesUser =
      order.user?.username.toLowerCase().includes(searchLower) ||
      order.user?.email.toLowerCase().includes(searchLower);
    return matchesId || matchesUser;
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {getErrorMessage(error)}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Pedidos</h1>
        <p className={styles.subtitle}>
          Total de pedidos: <strong>{orders?.length || 0}</strong>
        </p>
      </div>

      <div className={styles.searchContainer} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por ID de pedido o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--text-primary)",
            fontSize: "1rem",
          }}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Usuario</th>
              <th>Juegos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order: Order) => (
              <tr key={order._id}>
                <td style={{ fontSize: "0.9rem", color: "#888" }}>
                  {order._id.slice(-6).toUpperCase()}
                </td>
                <td>
                  <div className={styles.username}>
                    {order.user?.username || "Usuario eliminado"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    {order.user?.email}
                  </div>
                </td>
                <td>
                  {order.items?.map((item: OrderItem) => (
                    <div
                      key={item.game || item.title}
                      style={{ fontSize: "0.9rem" }}
                    >
                      • {item.title}
                    </div>
                  ))}
                </td>
                <td style={{ fontWeight: "bold", color: "#4caf50" }}>
                  ${order.totalAmount?.toFixed(2)}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={styles.badge}
                    style={{
                      background:
                        order.status === "completed"
                          ? "rgba(76, 175, 80, 0.2)"
                          : "rgba(255, 152, 0, 0.2)",
                      color:
                        order.status === "completed" ? "#4caf50" : "#ff9800",
                    }}
                  >
                    {order.status || "COMPLETED"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
