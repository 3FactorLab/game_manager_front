import { useState } from "react";
import { useImportFromRAWG } from "../../hooks/useAdmin";
import { FaSearch, FaDownload, FaCheckCircle } from "react-icons/fa";
import styles from "./RAWGImport.module.css";

const RAWGImport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const importMutation = useImportFromRAWG();

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      alert("Escribe al menos 3 caracteres para buscar");
      return;
    }

    setIsSearching(true);
    try {
      // Simulated RAWG search (replace with actual API call when backend is ready)
      // const results = await adminService.searchRAWG(searchQuery);

      // For now, show placeholder message
      setSearchResults([]);
      alert(
        "Función de búsqueda RAWG en desarrollo.\n\nPróximamente podrás buscar e importar juegos desde la base de datos RAWG."
      );
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (rawgId: number, title: string) => {
    if (
      window.confirm(
        `¿Importar "${title}" desde RAWG?\n\nEsto creará el juego en tu catálogo con toda la metadata de RAWG.`
      )
    ) {
      try {
        await importMutation.mutateAsync({ rawgId });
        alert("Juego importado correctamente");
      } catch (err: any) {
        alert(`Error: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Importar desde RAWG</h1>
        <p className={styles.subtitle}>
          Busca juegos en la base de datos de RAWG e impórtalos a tu catálogo
        </p>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar juegos en RAWG (ej: GTA V, Minecraft)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className={styles.searchInput}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={styles.searchBtn}
          >
            <FaSearch /> {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h3>ℹ️ Cómo funciona</h3>
        <ol>
          <li>Busca un juego por su nombre en la base de datos de RAWG</li>
          <li>Selecciona el juego que quieres importar</li>
          <li>
            El sistema traerá automáticamente:
            <ul>
              <li>Título, descripción y fecha de lanzamiento</li>
              <li>Imágenes (portada y screenshots)</li>
              <li>Desarrollador y publisher</li>
              <li>Precio de Steam (si está disponible)</li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Results */}
      {searchResults.length > 0 && (
        <div className={styles.results}>
          <h2>Resultados ({searchResults.length})</h2>
          <div className={styles.grid}>
            {searchResults.map((game: any) => (
              <div key={game.id} className={styles.card}>
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: `url(${
                      game.background_image ||
                      "https://placehold.co/300x200/1a1a1a/666"
                    })`,
                  }}
                />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{game.name}</h3>
                  <p className={styles.cardMeta}>
                    {game.released && `Lanzamiento: ${game.released}`}
                  </p>
                  {game.rating && (
                    <div className={styles.rating}>⭐ {game.rating}/5</div>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleImport(game.id, game.name)}
                    disabled={importMutation.isPending}
                    className={styles.importBtn}
                  >
                    <FaDownload /> Importar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && searchResults.length === 0 && searchQuery && (
        <div className={styles.emptyState}>
          <p>No se encontraron resultados para "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default RAWGImport;
