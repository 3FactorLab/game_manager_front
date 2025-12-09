import { useQuery } from "@tanstack/react-query";
import { collectionService } from "../services/collection.service";
import { useAuth } from "../../auth/AuthContext";

export const useLibrary = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["library"],
    queryFn: collectionService.getLibrary,
    enabled: isAuthenticated,
  });
};
