import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogItem {
  sku: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  in_stock: boolean;
  available_qty: number;
}

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
      const { data, error: dbError } = await supabase
        .from("catalog_items")
        .select("*")
        .order("name");

      if (dbError) throw dbError;

      const mapped: CatalogItem[] = (data || []).map((row) => ({
        sku: row.id,
        name: row.name,
        price: Number(row.price),
        category: row.category,
        image_url: null,
        in_stock: row.stock > 0,
        available_qty: row.stock,
      }));
      setItems(mapped);
    } catch (e: any) {
      const msg = e.message || "Failed to load catalog";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getInStockItems = useCallback(() => items.filter((item) => item.in_stock), [items]);
  const getLowStockItems = useCallback(() => items.filter((item) => item.in_stock && item.available_qty <= 5), [items]);
  const getOutOfStockItems = useCallback(() => items.filter((item) => !item.in_stock), [items]);

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
