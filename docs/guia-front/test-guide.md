# 🧪 Frontend Testing Guide

This guide explains how to validate the functionality of the Game Manager Frontend.

## 🟢 Prerequisites

1.  **Backend Running**:

    - Ensure MongoDB is active.
    - Run the backend services: `cd game-manager-BACK && npm start`.
    - Backend should be on `http://localhost:3500`.

2.  **frontend Running**:
    - Run `cd frontend && npm run dev`.
    - Access via `http://localhost:5173`.

---

## 🔍 Manual Testing Scenarios

### 1. Authentication Flow

- [ ] **Registration**:
  - Go to `/register`.
  - Sign up with a new email (e.g., `testuser@example.com`).
  - Verify redirection to Home/Login.
- [ ] **Login**:
  - Go to `/login`.
  - Enter valid credentials.
  - Verify Navbar changes (User Avatar appears).
  - **Refresh Page**: Verify you remain logged in (`localStorage` check).
- [ ] **Logout**:
  - Click User Avatar -> Logout.
  - Verify redirection to Home and Navbar update.

### 2. Catalog & Search

- [ ] **Infinite Scroll**:
  - Scroll down on Home page.
  - Verify new games load automatically or via "Load More".
- [ ] **Search**:
  - Type query in Navbar Search (e.g., "Mario").
  - Press Enter or click Search icon.
  - Verify the grid updates with filtered results.
  - Clear search -> Verify all games return.
- [ ] **Game Card**:
  - Hover over card -> Verify animation.
  - Click card -> Navigate to `/game/:id`.

### 3. Game Details & Actions

- [ ] **Metadata**: Verify Title, Developer, and Price match expected data.
- [ ] **Guest Mode**:
  - Logout.
  - Visit a game page.
  - Verify "Buy Now" and "Wishlist" buttons are **Disabled**.
- [ ] **User Mode**:
  - Login.
  - **Wishlist**: Click Heart button.
    - Verify icon fills red.
    - Refresh page -> Verify state persists.
  - **Buy Now**: Click button -> Navigate to Checkout.

### 4. Checkout Process

- [ ] **Checkout Page**:
  - Verify Order Summary (Game Title, Price).
  - Select Payment Method (UI Toggle).
  - Click **"Confirm Purchase"**.
- [ ] **Post-Purchase**:
  - Verify redirection to `/library`.
  - **Library**: Verify the purchased game appears in "My Games" tab.
  - **Wishlist**: Verify the game is removed from Wishlist (if logic appplies) or allows managing status.

### 5. Collection Management

- [ ] **Library Tabs**:
  - Click "My Games": See purchased titles.
  - Click "Wishlist": See favorited titles.
- [ ] **Wishlist Actions**:
  - From Wishlist tab, click "Buy Now" on a game card.
  - Verify flow to Checkout.

---

## 🤖 Automated Tests (Vitest)

We use **Vitest** for unit and integration testing.

### Running Tests

```bash
npm test
```

### Current Test Scope

- **Utilities**: `formatCurrency`
- **Components**: Basic rendering tests for `Button`, `Input`.
- **Hooks**: `useAuth` mock tests (Planned).

### Writing New Tests

1. Create file `Component.test.tsx` next to your component.
2. Import `render`, `screen` from `@testing-library/react`.
3. Example:

```tsx
test("renders button text", () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});
```
