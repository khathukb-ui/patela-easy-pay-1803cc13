import { useState, useEffect, useCallback } from "react";
import { catalogApi, CatalogItem, ApiError } from "@/lib/api-client";

export type { CatalogItem };

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  category: string | null;
}

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogApi.getItems();
      setItems(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load catalog";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getInStockItems = useCallback(() => {
    return items.filter((item) => item.in_stock);
  }, [items]);

  const getLowStockItems = useCallback(() => {
    return items.filter((item) => item.in_stock && item.available_qty <= 5);
  }, [items]);

  const getOutOfStockItems = useCallback(() => {
    return items.filter((item) => !item.in_stock);
  }, [items]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    getInStockItems,
    getLowStockItems,
    getOutOfStockItems,
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.sku === item.sku);
      if (existing) {
        return prev.map((c) =>
          c.sku === item.sku ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { sku: item.sku, name: item.name, price: item.price, quantity: 1, category: item.category }];
    });
  }, []);

  const removeFromCart = useCallback((sku: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.sku === sku);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.sku === sku ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.sku !== sku);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
}
