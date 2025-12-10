/**
 * useCheckout.ts
 * Custom hook for game purchase/checkout functionality.
 * Handles game purchase mutation and navigation to library on success.
 * Automatically invalidates library cache to show newly purchased game.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutService } from "../services/checkout.service";
import { useNavigate } from "react-router-dom";

/**
 * useCheckout hook
 * Handles game purchase process with automatic library refresh.
 * Navigates to library page on successful purchase.
 *
 * @returns {UseMutationResult} React Query mutation result for checkout
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: checkoutService.purchaseGame, // Purchase game via API
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] }); // Refresh library
      navigate("/library"); // Redirect to library page
    },
  });
};

// Exported to CheckoutPage for game purchase functionality
