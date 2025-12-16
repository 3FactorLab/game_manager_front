# Plan: Mejora de Filtros & UI de Temporada (Reboot)

> [!IMPORTANT]
> Este plan reinicia la implementación de filtros y la sección de "Winter Sales", incorporando las lecciones aprendidas de intentos anteriores (errores visuales, clipping, lógica de precios).

## 1. Análisis de Errores Previos ("Lessons Learned")

1.  **UI de "Seasonal Offers"**:

    - **Problema**: El diseño con título flotante (`absolute`) causaba clipping y problemas de espaciado.
    - **Solución**: Usar un layout `flex-column` donde el título sea un bloque hijo dentro del contenedor, evitando superposiciones.
    - **Tamaño**: Las tarjetas de 200px eran muy estrechas. Se estandarizarán a **320px**.
    - **Estética**: Usar fuente "Mountains of Christmas" y añadir iconos 🎄 al título explícitamente.

2.  **Lógica de Precios en Base de Datos**:
    - **Problema**: Los filtros del catálogo (`< 10€`) no funcionaban porque la DB tenía el precio original en el campo `price` y el descuento en `offerPrice`.
    - **Solución**: Un script debe invertir esto. `price` será el precio final (rebajado) y `originalPrice` será el precio de lista (tachado). Esto arregla los filtros nativamente.

---

## 2. Estrategia de Implementación (Paso a Paso)

### Fase 1: Lógica de Datos (Cimientos)

**Objetivo**: Que los filtros funcionen correctamente ANTES de tocar la UI.

1.  **Script de Migración (`apply-seasonal-sale.ts`)**:
    - Generar ofertas aleatorias en el 30% del catálogo.
    - **CRÍTICO**: Setear `price = discountedPrice` y `originalPrice = MSRP`.
2.  **Hooks y Tipos**:
    - Actualizar `Game` interface para incluir `originalPrice`.
    - Actualizar `useCatalogUrl` para manejar `maxPrice` y `onSale` (revertido previamente).

### Fase 2: UI del Catálogo

**Objetivo**: Permitir al usuario filtrar por estas nuevas ofertas.

1.  **Controles (`CatalogControls.tsx`)**:
    - Re-implementar Dropdown de Precio (Gratis, <10, <30, <60).
    - Re-implementar Toggle "Ofertas Navideñas" (o On Sale).
    - **Mejora Visual**: Chips de filtros activos estilizados correctamente (fuera del grid para no romper layout).

### Fase 3: Sección Visual "Winter Sales" (Home)

**Objetivo**: La marquesina visualmente atractiva y robusta.

1.  **Componente `SeasonalOffersMarquee.tsx`**:
    - **Layout**:
      ```jsx
      <Container>
        <Title>🎄 Ofertas Navideñas 🎄</Title>
        <MarqueeTrack>...</MarqueeTrack>
      </Container>
      ```
    - **Estilos**:
      - Fondo gradiente rojo/verde.
      - Padding reducido (compacto).
      - Tarjetas de 320px de ancho.
      - Título dentro del flujo del documento (sin `position: absolute` peligroso).
2.  **Integración en `DealSection.tsx`**:
    - Colocar encima de las columnas de deals.
    - Asegurar animación suave (`AnimatePresence mode="popLayout"`).

---

## 3. Plan de Verificación

1.  **Datos**: Ejecutar script y verificar en DB que `price` es el menor.
2.  **Filtros**: Ir al catálogo, poner "Menos de 10€" y ver juegos rebajados (ej. 60€ -> 5€).
3.  **Visual**: Verificar que el título "Ofertas Navideñas" no se corta y que las tarjetas se ven anchas (320px).

## 4. Archivos Clave

- `backend/src/scripts/apply-seasonal-sale.ts` (Nuevo)
- `frontend/src/features/home/components/SeasonalOffersMarquee.tsx` (Nuevo)
- `frontend/src/features/games/components/CatalogControls.tsx` (Modificar)
- `frontend/src/features/games/components/GameCard.tsx` (Ajustar visualización de precio)
