# Home Page Enhancement: Stats Section

## Goal

Improve the user engagement, visual appeal, and credibility of the Home page by adding a new "Stats & Benefits" section.

## Proposed Changes

### 1. New Component: `StatsSection`

- **File**: `frontend/src/features/home/components/StatsSection.tsx`
- **Purpose**: Add social proof and credibility by showing platform statistics.
- **Content**:
  - Animated counters for:
    - "Games Available" (e.g., 15,000+)
    - "Active Users" (e.g., 50k+)
    - "Collections Created" (e.g., 120k)
  - Value Props: Highlight "Zero Ads" or "Open Source" nature.
- **Design**:
  - Premium aesthetics: Dark card background, glassmorphism effects.
  - Typography: Large, gradient-colored numbers.
  - Animation: Smooth count-up effect on mount (using `framer-motion` or simple generic hook).

### 2. Update `Home.tsx`

- **File**: `frontend/src/pages/HomePage.tsx`
- **Action**: Import and integrate `StatsSection`.
- **Placement**: Insert it specifically between the closing of `contentWrapper` (which contains Hero + Trending) and the `DealSection`.
  - _Rationale_: It acts as a visual break and "Trust Builder" (Credibility) layer after the introduction and before the user dives into the commercial "Deals" section.

### 3. Refinements

- **Localization**: Add necessary keys to `en.json` and `es.json` under a new `home.stats` namespace.
  - `home.stats.games`: "Games Available"
  - `home.stats.users`: "Active Gamers"
  - `home.stats.collections`: "Collections"
  - `home.stats.trusted`: "Trusted Platform"

## Verification Plan

### Automated Tests

- Create `frontend/src/features/home/components/StatsSection.test.tsx`.
- Verify it renders without crashing.
- Verify translations are present.

### Manual Verification

1. Open the Home page (`npm run dev`).
2. Scroll down past the Trending widget.
3. Verify the "Stats Section" appears before the Deals section.
4. Verify the numbers animate (count up).
5. Switch languages and verify text updates.
