import React from "react";
import { useOrders } from "../features/orders/hooks/useOrders";
import styles from "./OrdersPage.module.css";
import { Link } from "react-router-dom";

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useOrders();

  const formatDateString = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
        <h1 className="text-gradient" style={{ marginBottom: 0 }}>My Orders</h1>
        <span style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          {orders?.length || 0} {(orders?.length || 0) === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {isLoading && <div className={styles.loading}>Loading orders...</div>}

      {error && (
        <div className={styles.emptyState}>
          Failed to load orders. Please try again later.
        </div>
      )}

      {!isLoading && !orders?.length && (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h2 className="text-gradient">No orders yet</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            You haven't purchased any games yet.
          </p>
          <Link
            to="/catalog"
            style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
          >
            Browse Store
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <div className={styles.orderDate}>
                    {formatDateString(order.createdAt)}
                  </div>
                  <div className={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                </div>
                <div className={styles.orderTotal}>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Activation Key</th>
                    <th style={{ textAlign: "right" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>
                        <span className={styles.keyContainer}>
                          {item.licenseKey}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
