import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Game } from "../../services/games.service";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  currency: string;
  cover?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
}

const STORAGE_KEY = "game_manager_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (game: Game) => {
    setItems((prev) => {
      if (prev.some((g) => g._id === game._id)) return prev;
      return [
        ...prev,
        {
          _id: game._id,
          title: game.title,
          price: game.isOffer && game.offerPrice !== undefined ? game.offerPrice : game.price,
          currency: game.currency,
          cover: game.assets?.cover,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((g) => g._id !== id));
  };

  const clear = () => setItems([]);

  const { count, total } = useMemo(
    () => ({
      count: items.length,
      total: items.reduce((acc, item) => acc + (item.price || 0), 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
