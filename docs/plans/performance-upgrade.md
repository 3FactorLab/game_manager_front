# Performance Upgrade Plan (Phase 3 & 4)

## Goal

Elevate the application's performance from "Optimized" to **"Elite"**. Focus on heavy-asset handling (images) and large-list rendering efficiency to ensure 60fps scrolling and LCP < 2.5s even on 3G networks.

---

## Phase 3: Advanced Image Optimization (The "Media" Layer)

**Objective**: Eliminate wasted bandwidth by serving exact-size, modern-format images tailored to the user's device.

### 3.1 CDN Integration Strategy

- **Concept**: Do not resize images on the backend. Use a Dynamic Image CDN (e.g., Cloudinary, Imgix, or a self-hosted Sharp proxy) to transform the original bucket URL on the fly.
- **Action**: Create `src/utils/imageOptimizer.ts`.
- **Implementation**:
  ```typescript
  export const optimizeImage = (url: string, width: number) => {
    // Example: Transforming a raw URL into a CDN optimized URL
    // return `https://my-cdn.com/image/fetch/w_${width},f_auto,q_auto/${url}`;
    return url; // Placeholder until CDN selection
  };
  ```

### 3.2 Responsive `LazyImage`

- **Objective**: Implement `srcSet` so mobile phones download 400px images instead of 1920px covers.
- **Target**: `src/components/common/LazyImage.tsx`.
- **Changes**:
  - Accept `sizes` prop (e.g., `(max-width: 768px) 100vw, 33vw`).
  - Auto-generate `srcSet` candidates using the `optimizeImage` utility.
  - **Draft**:
    ```tsx
    // srcSet="url?w=640 640w, url?w=1024 1024w..."
    ```

### 3.3 Low Quality Image Placeholders (LQIP)

- **Objective**: Improve Perceived Load Speed.
- **Action**: Instead of a generic gray skeleton, display a tiny (20px), blurred version of the image immediately while the HD version fetches.

---

## Phase 4: Compute & Rendering Efficiency

**Objective**: Handle large datasets without UI lag (Main Thread Blocking).

### 4.1 Virtualization (Catalog Grid)

- **Problem**: Rendering 50+ DOM nodes for game cards (with event listeners, effects) consumes memory.
- **Solution**: Implement "Windowing" or "Virtual Scrolling".
- **Tool**: `react-window` or `@tanstack/react-virtual`.
- **Target**: `CatalogPage.tsx` Grid.
- **Benefit**: Constant DOM size regardless of whether the catalog has 100 or 10,000 games.

### 4.2 Bundle Analysis & Fine Tuning

- **Action**: Run `rollup-plugin-visualizer` to identify hidden "heavy" dependencies.
- **Target**: Check `vendor-ui` chunk (currently ~130KB gzipped).
- **Optimization**: Tree-shake unused icons from `react-icons` (monitor import patterns).

---

## 5. Execution Roadmap

### Step 1: Image Infrastructure

- [ ] Choose Image CDN provider (or mock strategy).
- [ ] Implement `imageOptimizer` utility.
- [ ] Update `LazyImage` to support `srcSet/sizes`.

### Step 2: Grid Virtualization

- [ ] Install `@tanstack/react-virtual`.
- [ ] Refactor `CatalogPage` grid to use virtualizer.
- [ ] Verify scroll performance (FPS) in DevTools.

### Step 3: Verification

- [ ] Lighthouse Performance Score > 95 (Mobile).
- [ ] Zero CLS (Cumulative Layout Shift) confirmed.
