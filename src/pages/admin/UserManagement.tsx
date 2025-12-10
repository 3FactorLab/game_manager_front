import { useState } from "react";
import { useUsers, useDeleteUser } from "../../hooks/useAdmin";
import { handleApiError, getErrorMessage } from "../../utils/error.util";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useUsers(currentPage, limit);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async (userId: string, username: string) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar al usuario "${username}"?\n\nEsto eliminará permanentemente:\n- Su cuenta\n- Su biblioteca de juegos\n- Sus órdenes de compra\n- Sus tokens de sesión`
      )
    ) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        alert("Usuario eliminado correctamente");
      } catch (error) {
        handleApiError(error, "Failed to delete user");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error al cargar usuarios: {getErrorMessage(error)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Usuarios</h1>
        <p className={styles.subtitle}>
          Total de usuarios: <strong>{data?.total || 0}</strong>
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className={styles.username}>{user.username}</div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      user.role === "admin"
                        ? styles.badgeAdmin
                        : styles.badgeUser
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    className={styles.deleteBtn}
                    disabled={deleteUserMutation.isPending}
                  >
                    {deleteUserMutation.isPending
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            ← Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {currentPage} de {data.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(data.totalPages, p + 1))
            }
            disabled={currentPage === data.totalPages}
            className={styles.paginationBtn}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
