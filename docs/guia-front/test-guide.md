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

### 1. Authentication Flow (Advanced)

- [ ] **Registration**:
  - Go to `/register`.
  - Sign up with a new email (e.g., `testuser@example.com`).
  - Verify redirection to Home/Login and **Auto-Login** (Token in `localStorage`).
- [ ] **Login & Persistence**:
  - Go to `/login`.
  - Enter valid credentials.
  - Verify Navbar changes (User Avatar appears).
  - **Refresh Page**: Verify you remain logged in.
  - **New Tab**: Open app in new tab -> Verify session persists.
- [ ] **Dual Token System (Critical)**:
  - **Modify Token**: Manually edit `token` in LocalStorage (make it invalid).
  - **Trigger Action**: Navigate to `/library` (Protected Route).
  - **Verify Behavior**:
    - Should **NOT** log out immediately if refresh token is valid.
    - Console should show "Refreshing token...".
    - `token` in LocalStorage should automatically update to a new valid one.
- [ ] **Session Expiry**:
  - Delete `refreshToken` from LocalStorage.
  - Trigger any protected action.
  - Verify immediate **Automatic Logout** and redirect to `/login`.
- [ ] **Logout**:
  - Click User Avatar -> Logout.
  - Verify both `token` and `refreshToken` are removed from LocalStorage.

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

### 6. Error Handling & Resilience

- [ ] **404 Not Found**:
  - Visit non-existent route (e.g., `/random-page`).
  - Verify redirection to Home or 404 Page (if implemented).
- [ ] **Error Boundary (Crash Test)**:
  - Temporarily throw an error in a component (e.g., `throw new Error("Test")`).
  - Verify app DOES NOT turn white blank screen.
  - Verify "Something went wrong" Glassmorphism UI appears.
  - Click "Refresh Page" -> Verify recovery.

### 7. Admin Panel (Role Based)

- [ ] **Access Control**:
  - Login as **Standard User**.
  - Try to visit `/admin`.
  - Verify "Access Denied" message or redirection.
- [ ] **Admin Features** (Login as Admin):
  - **User Management**:
    - Delete a user -> Verify confirmation modal -> Verify deletion.
  - **Game Management**:
    - Import Game from RAWG -> Verify it appears in main catalog.
    - Delete Game -> Verify it disappears from Store.

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
