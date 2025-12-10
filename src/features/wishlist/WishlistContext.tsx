/**
 * WishlistContext.tsx
 * Context provider for managing user's wishlist.
 * Handles adding, removing, and checking items in the wishlist with backend persistence.
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import {
    getWishlist,
    addToWishlist as addToWishlistApi,
    removeFromWishlist as removeFromWishlistApi,
} from "../../services/user.service";
import type { Game } from "../../services/games.service";

interface WishlistContextType {
    wishlist: Game[];
    addToWishlist: (game: Game) => Promise<void>;
    removeFromWishlist: (gameId: string) => Promise<void>;
    isInWishlist: (gameId: string) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch wishlist when user logs in
    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            return;
        }

        try {
            setIsLoading(true);
            const items = await getWishlist();
            setWishlist(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            // toast.error("Failed to load wishlist");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (game: Game) => {
        if (!isAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        // Optimistic update
        const previousWishlist = [...wishlist];
        setWishlist((prev) => [...prev, game]);

        try {
            await addToWishlistApi(game._id);
            toast.success("Added to wishlist");
            // Optionally refetch to ensure sync
            // await fetchWishlist();
        } catch (error) {
            setWishlist(previousWishlist); // Rollback
            console.error("Failed to add to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (gameId: string) => {
        if (!isAuthenticated) return;

        // Optimistic update
        const previousWishlist = [...wishlist];
        setWishlist((prev) => prev.filter((item) => item._id !== gameId));

        try {
            await removeFromWishlistApi(gameId);
            toast.success("Removed from wishlist");
        } catch (error) {
            setWishlist(previousWishlist); // Rollback
            console.error("Failed to remove from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (gameId: string) => {
        return Array.isArray(wishlist) && wishlist.some((item) => item._id === gameId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                isLoading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
