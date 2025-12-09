import apiClient from "../../../services/api.client";

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  message: string;
}

export const checkoutService = {
  async purchaseGame(gameId: string): Promise<CheckoutResponse> {
    // Backend expects POST /api/payments/checkout with gameIds array
    const { data } = await apiClient.post<CheckoutResponse>(
      "/payments/checkout",
      {
        gameIds: [gameId],
      }
    );
    return data;
  },
};
