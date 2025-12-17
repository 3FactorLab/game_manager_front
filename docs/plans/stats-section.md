# Plan: Home Page Stats Section

## 1. Objective

Enhance the Home Page with a "Stats & Benefits" section to increase social proof and visual appeal, utilizing real-time data from the backend.

## 2. Technical Specifications

### A. Component Architecture

- **Component**: `StatsSection`
- **Path**: `frontend/src/features/home/components/StatsSection.tsx`
- **Type**: Functional Component with Local State (TanStack Query)
- **Props**: None (Self-contained data fetching)

### B. Logic & Data

- **Dynamic Data**: "Games Available" count fetched via `gamesService.getCatalog({ limit: 1 })` -> `pagination.total`.
- **Static Data**:
  - "Active Users": 50k+
  - "Collections Created": 120k+
- **Value Props**: "Zero Ads", "100% Open Source"

### C. Design & Styling (Glassmorphism)

- **File**: `StatsSection.module.css`
- **CSS Variables**: `var(--bg-glass)`, `var(--glass-border)`, `var(--text-primary)`, `var(--text-secondary)`.
- **Layout**: Flexbox (Row on Desktop, Stack on Mobile).
- **Icons**: `react-icons/fa` (`FaGamepad`, `FaUsers`, `FaLayerGroup`, `FaCode`, `FaBan`).
- **Animations**: `framer-motion` for entrance & count-up.

### D. Localization (`i18n`)

| Key                      | English             | Spanish             |
| ------------------------ | ------------------- | ------------------- |
| `home.stats.games`       | Games Available     | Juegos Disponibles  |
| `home.stats.users`       | Active Gamers       | Jugadores Activos   |
| `home.stats.collections` | Collections Created | Colecciones Creadas |
| `home.stats.open_source` | 100% Open Source    | 100% Open Source    |
| `home.stats.no_ads`      | Zero Ads            | Cero Anuncios       |

## 3. Detailed Implementation Phases

### Phase 1: Styling Infrastructure

- **Action**: Create `frontend/src/features/home/components/StatsSection.module.css`.
- **Key Styles**:
  - `.container`: `display: flex`, `justify-content: space-around`, `padding: 3rem 0`, `background: var(--bg-glass)`, `backdrop-filter: blur(12px)`, `border-radius: var(--radius-xl)`, `border: 1px solid var(--glass-border)`.
  - `.statItem`: `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 0.5rem`.
  - `.icon`: `font-size: 2rem`, `color: var(--accent-primary)`, `margin-bottom: 0.5rem`.
  - `.number`: `font-size: 3.5rem`, `font-weight: 800`, `background: linear-gradient(...)`, `-webkit-text-fill-color: transparent`.
  - `.label`: `font-size: 1rem`, `color: var(--text-secondary)`, `letter-spacing: 1px`.

### Phase 2: Component Logic (`StatsSection.tsx`)

- **Action**: Create the component file.
- **Interface**:
  ```typescript
  interface StatItemProps {
    icon: React.ElementType;
    value: string | number;
    label: string;
    delay?: number;
  }
  ```
- **Data Fetching**:
  ```typescript
  const { data } = useQuery({
    queryKey: ["games-count"],
    queryFn: () => gamesService.getCatalog({ limit: 1 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const totalGames = data?.pagination.total || 0;
  ```
- **Animations**: Use `<motion.div>` with `initial={{ opacity: 0, y: 20 }}` and `whileInView={{ opacity: 1, y: 0 }}`.

### Phase 3: Localization Update

- **Action**: Update `frontend/src/locales/{en,es}.json`.
- **Structure**:
  ```json
  "home": {
    "stats": {
       "games": "...",
       "users": "...",
       "collections": "...",
       // ...
    }
  }
  ```

### Phase 4: Page Integration

- **Action**: Edit `frontend/src/pages/HomePage.tsx`.
- **Insertion Point**: Outside `contentWrapper`, immediately **after** its closing tag `</div>` and **before** `<DealSection />`.
- **Constraint**: This ensures it acts as a full-width section separating the Hero area from the Store.

### Phase 5: Strict Testing

- **Action**: Create `frontend/src/features/home/components/StatsSection.test.tsx`.
- **Test Suite**:
  1.  `it("renders static stats correctly")`: Check for "Active Users" and "Collections".
  2.  `it("fetches and displays dynamic game count")`: Mock `gamesService.getCatalog` to return `{ pagination: { total: 1234 } }` and await findByText("1234").
  3.  `it("handles loading state gracefully")`: Ensure no crash while `isLoading` (display 0 or spinner).

## 4. Verification Plan

### Automated Tests (Vitest)

- **File**: `StatsSection.test.tsx`
- **Cmd**: `npm test src/features/home/components/StatsSection.test.tsx` -> Must pass.

### Manual Verification

- [ ] **Visual**: Open `http://localhost:5173`. Check if the "Glass" effect blends with the background.
- [ ] **Data**: Verify "Games Available" is not 0 (should be ~18-20 based on seeds).
- [ ] **Responsiveness**: Resize window to <768px. Verify the row becomes a column grid.
- [ ] **Localization**: Click "ES" in navbar. Verify "Games Available" -> "Juegos Disponibles".

## 5. Compliance Checklist (PROMPT_AI_front.md)

- [ ] **JSDoc**: File and Component headers present.
- [ ] **Strict Typing**: No `any` types.
- [ ] **State**: No `useEffect` for data fetching (use `useQuery`).
- [ ] **Clean Code**: No `console.log`.
- [ ] **Styles**: No inline styles; strict CSS modules.
