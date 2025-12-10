/**
 * format.ts
 * Utility functions for formatting data for display.
 * Provides currency formatting using Intl.NumberFormat API.
 */

/**
 * Format number as currency
 * Uses Intl.NumberFormat for locale-aware currency formatting
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (e.g., "USD", "EUR")
 * @returns {string} Formatted currency string (e.g., "$19.99")
 */
export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

// Exported to GameCard and other components for price display
