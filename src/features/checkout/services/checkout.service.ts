/**
 * checkout.service.ts
 * Service for handling game purchase/checkout operations.
 * Communicates with backend payment endpoints to process game purchases.
 */

import apiClient from "../../../services/api.client";

/**
 * CheckoutResponse interface
 * Response structure from successful game purchase
 */
export interface CheckoutResponse {
  success: boolean;
  orderId: string; // Order ID for tracking
  message: string;
}

/**
 * Checkout service
 * Handles game purchase operations
 */
export const checkoutService = {
  /**
   * Purchase a game
   * Sends game purchase request to backend payment endpoint
   * @param {string} gameId - ID of game to purchase
   * @returns {Promise<CheckoutResponse>} Purchase confirmation
   */
  async purchaseGame(gameId: string): Promise<CheckoutResponse> {
    // Backend expects POST /api/payments/checkout with gameIds array
    const { data } = await apiClient.post<CheckoutResponse>(
      "/payments/checkout",
      {
        gameIds: [gameId], // Array format for potential multi-game purchases
      }
    );
    return data;
  },
};

// Exported to useCheckout hook for game purchase functionality
