import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionService } from "../services/collection.service";
import { useAuth } from "../../auth/AuthContext";

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: collectionService.getWishlist,
    enabled: isAuthenticated,
  });

  const addToWishlist = useMutation({
    mutationFn: collectionService.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: collectionService.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const isInWishlist = (gameId: string) => {
    return wishlist?.some((g) => g._id === gameId) ?? false;
  };

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
